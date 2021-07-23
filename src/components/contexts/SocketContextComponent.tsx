import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Colors from '../game/board/constants/Colors';
import LogicContext from './LogicContext';
import { backendURL } from '../../constants';
import { resetActionCreator, startActionCreator } from '../../redux/actions/game/gameAction';
import { FullState, Opponent } from '../../redux/state';
import { Events } from '../../connection/definitions';

export interface Props {}

export interface SocketInterface {
  send: (event: Events, data?: any) => void,
  sendWithAnswer: (event: Events, answerEvent: Events, callback: (data: any) => void, data?: any) => void,
  listen: (event: Events, callback: (data: any) => void) => void,
  startGameSearch: (duration: number, level: number) => void,
  cancelGameSearch: () => void,
  disconnect: () => void
}

export const SocketContext = createContext<SocketInterface>({} as SocketInterface);

const socket = io(backendURL, {
  transports: ["websocket"],
  autoConnect: false
});

const SocketContextComponent: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const username = useSelector<FullState, string>(state => state.auth.username!);

  useEffect(() => {

    if(!socket.hasListeners(Events.PAIRED)) {
      socket.on(Events.PAIRED, (data: {side: Colors, opponent: Opponent}) => {
        console.log('paired', data);
        dispatch(startActionCreator(data.side, 'multi', data.opponent));
      });
    }
    
    if(!socket.hasListeners(Events.AUTH)) {
      socket.on(Events.AUTH, () => {
        socket.emit(Events.AUTH, username);
      })
    }
    
    return () => {
      socket.disconnect();
      console.log('disconnect');
      dispatch(resetActionCreator());
    }
  }, []);

  const sendWithAnswer = (event: Events, answerEvent: Events, callback: (data: any) => void, data?: any) => {
    socket.on(answerEvent, (callbackData: any) => {
      socket.off(answerEvent);

      callback(callbackData);
    });

    send(event, data);
  }

  const send = (event: Events, data?: any) => {
    socket.emit(event, data);
  }

  const listen = (event: Events, callback: (data: any) => void) => {
    socket.off(event);

    socket.on(event, callback);
  }

  const startGameSearch = (duration: number, level: number) => {
    socket.connect();
    socket.on(Events.DURATION, () => {
      socket.off(Events.DURATION);
      socket.emit(Events.DURATION, {duration, level});
    })
    socket.emit(Events.AUTH, username);
  }

  const cancelGameSearch = () => {
    socket.disconnect();
    socket.emit(Events.CANCEL);
  }

  const disconnect = () => {
    socket.disconnect()
  }

  const data: SocketInterface = {
    send,
    listen,
    sendWithAnswer,
    startGameSearch,
    cancelGameSearch,
    disconnect
  }

  return <SocketContext.Provider value={data}>{children}</SocketContext.Provider>;
};

export default SocketContextComponent;