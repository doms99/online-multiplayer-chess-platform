import { Card, CardContent, CardActions, Button, TextField, Typography, Paper }  from '@material-ui/core';
import React, { FormEvent, FormEventHandler, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Events } from '../../../../connection/definitions';
import { SocketContext } from '../../../contexts/SocketContextComponent';
import { FullState } from '../../../../redux/state';
import './Chat.css';

type MessageObject = {sender: string, message: string};

const Chat = () => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageObject[]>([]);
  const [muted, setMuted] = useState<boolean>(false);
  const username = useSelector<FullState, string>(state => state.auth.username!);
  const { send, listen } = useContext(SocketContext);

  useEffect(() => {
    listen(Events.CHAT, (message: string) => {
      if(!muted) {
        setMessages(current => [...current, {sender: 'other', message}]);
      }
    })
  }, [])

  const sendMessage: FormEventHandler = (e: FormEvent) => {
    e.preventDefault();
    if(currentMessage.trim() === "") return;
    setMessages(current => [...current, {sender: username, message: currentMessage.trim()}]);

    send(Events.CHAT, currentMessage.trim());

    setCurrentMessage("");
  }

  const muteFlipFlop = () => {
    if(!muted) {
      setMuted(true);
      return;
    }

    setMuted(false);
  }

  return (
    <Card className="chat">
      <CardContent className="messages">
        {messages.map((message, index) => (
          <div key={index} style={{display: 'flex', justifyContent: message.sender === username ? 'flex-end' : 'flex-start'}}>
            <Paper className="message"><Typography>{message.message}</Typography></Paper>
          </div>
          ))}
      </CardContent>
        <form noValidate onSubmit={sendMessage} autoComplete="off">
          <CardActions>
            <TextField value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} fullWidth placeholder="message..." size="small" variant="outlined" />
            <Button type="submit" variant="contained">Send</Button>
            <Button onClick={muteFlipFlop}>{muted ? 'Unmute' : 'Mute'}</Button>
          </CardActions>
        </form>
    </Card>
  );
};

export default Chat;