import express from "express";
import { query } from "../db";
import { validatePassword, validateEmail } from "../util/validatorFunc";
import { createToken } from '../auth/tokenFuncs';
import { join } from 'path';
const router = express.Router();

export default router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const username = (req as any).username;

  console.log("/game", { id, username });

  if(!id) {
    res.status(403).json({
      error: 'Invalid game id'
    })
    return;
  }

  try {
    const result = await query(`select count(*) from games join
                                (select game_id, p1.username as white, p2.username as black
                                from  players as p1 inner join players as p2 using(game_id)
                                where p1.color <> p2.color and p1.color = 'white') p2
                                on games.id=p2.game_id
                                where id=$1 and (white=$2 or black=$2)`, id, username);

    if(parseInt(result.rows[0].count, 10) === 0) {
      res.status(200).json({
        error: 'Can\'t access the game'
      });
      return;
    }

    const moves = (await query(`select move from moves
                              where game_id=$1
                              order by time`, id)).rows.map((entry: any) => entry.move);

    const side = (await query(`select color from players where game_id=$1 and username=$2`, id, username)).rows[0].color;
    const opponent = (await query(`select username, score from users join players using(username) where game_id=$1`, id)).rows[0];

    res.status(200).json({
      side, opponent, moves
    });

  } catch(err) {
    console.log(err);
    res.status(403).json({
      error: 'Error while retrieving game from datebase'
    });
  }
})