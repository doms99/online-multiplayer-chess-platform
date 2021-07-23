import { Socket } from "node:dgram";
import { Server } from "socket.io";
import pairing from "./pairings";
import queue from "./queue";
import { query } from '../db';
import { randomBytes } from 'crypto';
import { Server as HttpServer } from "node:http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { frontendURL } from "../constants";

export let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;

const nameToIdMap: Record<string, string> = {};
const idToNameMap: Record<string, string> = {};
const timeouts: Record<string, NodeJS.Timeout> = {};
const elapseCounters: Record<string, NodeJS.Timeout | null> = {};

const elapseFunc = (username: string) => pairing.setElapsed(username, pairing.getElapsed(username)+1);

const newGameBuilder = async (white: string, black: string, duration: number) => {
  let gameId: string;
  while(true) {
    gameId = randomBytes(32).toString('hex');
    const count = (await query(`select count(*) from games where id=$1`, gameId)).rows[0].count;

    if(parseInt(count, 10) === 0) break;
  }

  pairing.put(white, black, gameId);
  elapseCounters[white] = setInterval(() => elapseFunc(white), 1000);
  elapseCounters[black] = null;

  query(`insert into games(id, start, duration, status)
         values($1, current_timestamp, $2, (select id from status where status='in progress'));`,
         gameId, duration)
  .then(() => {
    query(`insert into players(game_id, username, color)
            values($1, $2, 'white');`, gameId, white).catch((err) => console.trace('player 1 create', err.message));
    query(`insert into players(game_id, username, color)
            values($1, $2, 'black')`, gameId, black).catch((err) => console.trace('player 2 create', err.message));
  })
  .catch((err) => console.trace('game create', err.message));

  return new Promise((res, rej) => {
    res(true);
  })
}

const endScore = async (winner: string, losser: string) => {
  const winnerScore = (await query(`select score from users where username=$1`, winner)).rows[0].score;
  const losserScore = (await query(`select score from users where username=$1`, losser)).rows[0].score;

  query(`update users set score=$1 where username=$2`,
  winnerScore + 10, winner);

  query(`update users set score=$1 where username=$2`,
  Math.max(0, losserScore - 10), losser);

  return new Promise((resolve) => resolve([winnerScore+10, losserScore-10]));
}

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, { cors: { origin: frontendURL }});

  io.on('connection', (socket) => {
    console.log('socket connection', socket.id);

    socket.on('auth', async (username: string) => {
      console.log('auth', socket.id, ' -> ', username);
      let send = true;
      if(Object.keys(timeouts).includes(username)) {
        clearTimeout(timeouts[username]);
        delete timeouts[username];
        send = false;
        const moves = (await query(`select move from moves
               where game_id=$1
               order by time`, pairing.getGameId(username)
        )).rows;
        const side = (await query(`select color from players
                             where game_id=$1 and username=$2`, pairing.getGameId(username), username)).rows[0].color;
        const score = (await query(`select score from users where username=$1`, pairing.get(username))).rows[0].score;

        socket.emit('reconnectData', {side, opponent: {username: pairing.get(username), score}, moves: moves.map((value: any) => value.move)});
        const other = pairing.get(username);
        socket.emit('elapsed', { me: pairing.getElapsed(username), other: pairing.getElapsed(other)});
      }

      nameToIdMap[username] = socket.id;
      idToNameMap[socket.id] = username;
      if(send) socket.emit('duration');
    });

    socket.on('duration', async (data: {duration: number, level: number}) => {
      console.log('duration', data);

      if(!queue.hasWaiting(data.duration, data.level)) {
        queue.add(data.duration, data.level, idToNameMap[socket.id]);
        return;
      }

      const otherSocket = nameToIdMap[queue.get(data.duration, data.level)];
      if(otherSocket === undefined) return;

      const rand = Math.random();
      const scoreOther = (await query(`select score from users where username=$1`, idToNameMap[otherSocket])).rows[0].score;
      const score = (await query(`select score from users where username=$1`, idToNameMap[socket.id])).rows[0].score;
      socket.emit('paired', {side: rand < 0.5 ? 'white' : 'black', opponent: { username: idToNameMap[otherSocket], score: scoreOther}});
      socket.to(otherSocket).emit('paired', {side: rand < 0.5 ? 'black' : 'white', opponent: { username: idToNameMap[socket.id], score}});
      socket.emit('elapsed', { me: 0, other: 0 });
      socket.to(otherSocket).emit('elapsed', { me: 0, other: 0 });

      newGameBuilder(
        rand < 0.5 ? idToNameMap[socket.id] : idToNameMap[otherSocket],
        rand < 0.5 ? idToNameMap[otherSocket] : idToNameMap[socket.id],
        data.duration
      )
    });

    socket.on('cancel', () => {
      queue.removeIfExists(idToNameMap[socket.id]);
    });

    socket.on('disconnect', () => {
      console.log('socket dissconect', idToNameMap[socket.id]);

      if(!pairing.get(idToNameMap[socket.id])) {
        queue.removeIfExists(idToNameMap[socket.id]);
        return;
      }

      if(Object.keys(timeouts).includes(pairing.get(idToNameMap[socket.id]))) {
        if(!pairing.isGameOver(idToNameMap[socket.id], pairing.get(idToNameMap[socket.id]))) {
          query(`update games set status=(select id from status where status='draw') where id=$1`,
          pairing.getGameId(idToNameMap[socket.id]));
        }

        const other = pairing.get(idToNameMap[socket.id]);
        clearInterval(elapseCounters[idToNameMap[socket.id]]);
        delete elapseCounters[idToNameMap[socket.id]];
        clearInterval(elapseCounters[other]);
        delete elapseCounters[other];

        pairing.remove(idToNameMap[socket.id]);

        clearTimeout(timeouts[other]);
        delete timeouts[other];
        delete nameToIdMap[idToNameMap[socket.id]];
        delete idToNameMap[socket.id];
        delete idToNameMap[nameToIdMap[other]];
        delete nameToIdMap[other];

        return;
      }

      timeouts[idToNameMap[socket.id]] = setTimeout(async () => {
        const otherSocket = nameToIdMap[pairing.get(idToNameMap[socket.id])];

        if(otherSocket === undefined) return;

        socket.to(otherSocket).emit('winner');
        query(`update games set status=(select id from status where status='win'), winner=$1 where id=$2`,
        idToNameMap[otherSocket], pairing.getGameId(idToNameMap[otherSocket]));

        endScore(idToNameMap[otherSocket], idToNameMap[socket.id]).then(([winnerScore, losserScore]) => {
          socket.to(otherSocket).emit('score', winnerScore);
          socket.emit('score', losserScore);
        });


        pairing.remove(idToNameMap[socket.id]);
        delete nameToIdMap[idToNameMap[socket.id]];
        delete timeouts[idToNameMap[socket.id]];
        delete idToNameMap[socket.id];
      }, 30000);
    });

    socket.on('move', (data) => {
      console.log('move', data);

      const other = pairing.get(idToNameMap[socket.id]);
      clearInterval(elapseCounters[idToNameMap[socket.id]]);
      elapseCounters[idToNameMap[socket.id]] = null;
      elapseCounters[other] = setInterval(() => elapseFunc(other), 1000);

      socket.to(nameToIdMap[other]).emit('move', data);
      socket.emit('elapsed', { me: pairing.getElapsed(idToNameMap[socket.id]), other: pairing.getElapsed(other)});
      socket.to(nameToIdMap[other]).emit('elapsed', { other: pairing.getElapsed(idToNameMap[socket.id]), me: pairing.getElapsed(other)});

      query(`insert into moves(game_id, move, time)
             values($1, $2, CURRENT_TIMESTAMP)`,
            pairing.getGameId(idToNameMap[socket.id]), JSON.stringify(data))
    });

    socket.on('resign', async () => {
      console.log('resign', idToNameMap[socket.id]);
      const otherSocket = nameToIdMap[pairing.get(idToNameMap[socket.id])];

      if(pairing.isGameOver(idToNameMap[socket.id], idToNameMap[otherSocket])) return

      pairing.setGameOver(idToNameMap[socket.id], idToNameMap[otherSocket]);

      socket.to(otherSocket).emit('winner');

      clearInterval(elapseCounters[idToNameMap[socket.id]]);
      delete elapseCounters[idToNameMap[socket.id]];
      clearInterval(elapseCounters[idToNameMap[otherSocket]]);
      delete elapseCounters[idToNameMap[otherSocket]];

      query(`update games set status=(select id from status where status='win'), winner=$1 where id=$2`,
            pairing.get(idToNameMap[socket.id]), pairing.getGameId(idToNameMap[socket.id]));

      endScore(pairing.get(idToNameMap[socket.id]), idToNameMap[socket.id]).then(([winnerScore, losserScore]) => {
        socket.to(otherSocket).emit('score', winnerScore);
        socket.emit('score', losserScore);
      });
    });

    socket.on('loss', async () => {
      if(pairing.isGameOver(idToNameMap[socket.id], pairing.get(idToNameMap[socket.id]))) return;

      pairing.setGameOver(idToNameMap[socket.id], pairing.get(idToNameMap[socket.id]));

      console.log('loss', idToNameMap[socket.id]);

      const other = pairing.get(idToNameMap[socket.id]);
      clearInterval(elapseCounters[idToNameMap[socket.id]]);
      delete elapseCounters[idToNameMap[socket.id]];
      clearInterval(elapseCounters[other]);
      delete elapseCounters[other];

      query(`update games set status=(select id from status where status='win'), winner=$1 where id=$2`,
            pairing.get(idToNameMap[socket.id]), pairing.getGameId(idToNameMap[socket.id]));


      endScore(pairing.get(idToNameMap[socket.id]), idToNameMap[socket.id]).then(([winnerScore, losserScore]) => {
        socket.to(nameToIdMap[pairing.get(idToNameMap[socket.id])]).emit('score', winnerScore);
        socket.emit('score', losserScore);
      });
    });

    socket.on('draw', () => {
      if(pairing.isGameOver(idToNameMap[socket.id], pairing.get(idToNameMap[socket.id]))) return;

      pairing.setGameOver(idToNameMap[socket.id], pairing.get(idToNameMap[socket.id]));

      console.log('draw', idToNameMap[socket.id]);

      const other = pairing.get(idToNameMap[socket.id]);
      clearInterval(elapseCounters[idToNameMap[socket.id]]);
      delete elapseCounters[idToNameMap[socket.id]];
      clearInterval(elapseCounters[other]);
      delete elapseCounters[other];

      query(`update games set status=(select id from status where status='draw') where id=$1`, pairing.getGameId(idToNameMap[socket.id]));
    })

    socket.on('rematchRequest', () => {
      console.log('rematchRequest', socket.id);

      const otherSocket = nameToIdMap[pairing.get(idToNameMap[socket.id])];

      console.log(otherSocket, idToNameMap[otherSocket]);

      socket.to(otherSocket).emit('rematchRequest');
    });

    socket.on('rematchAnswer', async (answer: boolean) => {
      console.log('rematchAnswer', socket.id);

      const otherSocket = nameToIdMap[pairing.get(idToNameMap[socket.id])];

      if(!answer || pairing.didOtherStart(idToNameMap[socket.id])) return;

      const rand = Math.random();
      const duration = (await query(`select duration from games where id=$1`, pairing.getGameId(idToNameMap[socket.id]))).rows[0].duration;

      const color = (await query(`select color from players where username=$1 and game_id=$2`, idToNameMap[socket.id], pairing.getGameId(idToNameMap[socket.id]))).rows[0].color;
      const scoreOther = (await query(`select score from users where username=$1`, idToNameMap[otherSocket])).rows[0].score;
      const score = (await query(`select score from users where username=$1`, idToNameMap[socket.id])).rows[0].score;
      socket.emit('paired', {side: color === 'black' ? 'white' : 'black', opponent: { username: idToNameMap[otherSocket], score: scoreOther}});
      socket.to(otherSocket).emit('paired', {side: color === 'black' ? 'black' : 'white', opponent: { username: idToNameMap[socket.id], score}});
      socket.emit('elapsed', { me: 0, other: 0 });
      socket.to(otherSocket).emit('elapsed', { me: 0, other: 0 });

      newGameBuilder(
        rand < 0.5 ? idToNameMap[socket.id] : idToNameMap[otherSocket],
        rand < 0.5 ? idToNameMap[otherSocket] : idToNameMap[socket.id],
        duration
      ).then(() => {
        pairing.print();
        queue.print();
      });
    });

    socket.on('chat', (message: string) => {
      console.log('chat', socket.id);

      socket.to(nameToIdMap[pairing.get(idToNameMap[socket.id])]).emit('chat', message);
    });

    socket.on('promote', (data: any) => {
      const otherSocket = nameToIdMap[pairing.get(idToNameMap[socket.id])];

      socket.to(otherSocket).emit('promote', data);
    });

    // socket.emit('auth');
  });
}