import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContextComponent';
import { Events } from '../../connection/definitions';
import Colors from './board/constants/Colors';

export interface Props {
  running: boolean
  secunds: number,
  over: () => void,
  counterRestartCallback?: (func: (time: number) => void) => void
}

const secundsFormt = (value: number) => {
  if(value < 10) return '0'+value;
  return value.toString();
}

let previous: Props = { running: false, secunds: 1, over: () => {} }

const GameTimer: React.FC<Props> = ({ counterRestartCallback, running, secunds, over }) => {
  // console.log('counterRestartCallback', previous.counterRestartCallback === counterRestartCallback);
  // console.log('running', previous.running === running);
  // console.log('secunds', previous.secunds === secunds);
  // console.log('over', previous.over === over);

  // previous = { counterRestartCallback, running, secunds, over };

  const [time, setTime] = useState<number>(secunds);
  const [isOver, setIsOver] = useState<boolean>(false);

  useEffect(() => {
    if(counterRestartCallback) counterRestartCallback((time: number) => {
      setTime(time);
    });
  }, [counterRestartCallback])

  useEffect(() => {
    if(time === 0 && !isOver) {
      over();
      setIsOver(true);
    }
  }, [time, over, isOver]);

  useEffect(() => {
    setTime(secunds);
  }, [secunds])

  useEffect(() => {
    if(running) {
      const interval = setInterval(() => setTime(current => current-1), 1000);

      return () => clearInterval(interval);
    }
  }, [running]);
  
  return (
    <>
      {Math.floor(time / 60)}:{secundsFormt(time % 60)}
    </>
  );
};

export default GameTimer;

// import React, { useContext, useEffect, useState } from 'react';
// import { SocketContext } from '../contexts/SocketContextComponent';
// import { Events } from '../../connection/definitions';
// import Colors from './board/constants/Colors';

// export interface Props {
//   running: boolean
//   secunds: number,
//   over: () => void,
//   counterRestartCallback?: (func: () => void) => void,
//   side: Colors
// }

// const secundsFormt = (value: number) => {
//   if(value < 10) return '0'+value;
//   return value.toString();
// }

// interface Timers {
//   white: null | NodeJS.Timer,
//   black: null | NodeJS.Timer
// }

// const timers: Timers = {
//   white: null,
//   black: null
// }

// const GameTimer: React.FC<Props> = ({ counterRestartCallback, running, secunds, over, side }) => {
//   const [time, setTime] = useState<number>(secunds);
//   const { listen, send } = useContext(SocketContext);

//   useEffect(() => {
//     listen(side === Colors.white ? Events.GET_TIME_WHITE : Events.GET_TIME_BLACK, () => {
//       send(side === Colors.white ? Events.GET_TIME_WHITE : Events.GET_TIME_BLACK, {time, currentSecunds: new Date().getSeconds()});
//     });

//     listen(side === Colors.white ? Events.SET_TIME_WHITE : Events.SET_TIME_WHITE, (data: {time: number, currentSecunds: number}) => {
//       if(side === Colors.white) {
//         clearInterval(timers.white!);
//         timers.white = setInterval(() => setTime(current => current-1), 1000);
//       } else {
//         clearInterval(timers.black!);
//         timers.black = setInterval(() => setTime(current => current-1), 1000);
//       }
//       const myCurrentSecunds = new Date().getSeconds();
//       setTime(data.time - (myCurrentSecunds > data.currentSecunds ? (data.currentSecunds + 60 - myCurrentSecunds) : (data.currentSecunds - myCurrentSecunds)));
//     });
//   }, [time]);

//   useEffect(() => {
//     if(counterRestartCallback) counterRestartCallback(() => setTime(secunds));
//   }, [counterRestartCallback, setTime, secunds])

//   useEffect(() => {
//     if(time === 0) {
//       over();
//     }
//   }, [time, over]);

//   useEffect(() => setTime(secunds), [secunds]);

//   useEffect(() => {
//     if(running) {
//       if(side === Colors.white) {
//         timers.white = setInterval(() => setTime(current => current-1), 1000);
//       } else {
//         timers.black = setInterval(() => setTime(current => current-1), 1000);
//       }

//       return () => {
//         if(side === Colors.white) {
//           clearInterval(timers.white!);
//           timers.white = null;
//         } else {
//           clearInterval(timers.black!);
//           timers.black = null;
//         }
//       }
//     }
//   }, [running, side]);
  
//   return (
//     <>
//       {Math.floor(time / 60)}:{secundsFormt(time % 60)}
//     </>
//   );
// };

// export default GameTimer;