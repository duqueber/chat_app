import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Messages from '../../borrowed_components/Messages/Messages';
import Input from '../../borrowed_components/Input/Input';
import '../../borrowed_css/Chat/Chat.css';


let socket;

//location comes from prop router
const Chat = ({location}) => {

  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const ENDPOINT = 'localhost:5000';
  useEffect(() => {
      const { user } = queryString.parse(location.search);
      socket = io(ENDPOINT);
      setUser(user);

      socket.emit('join', {user}, () => {

      });

      //unmount
      return () => {
        socket.emit('disconnect');

        socket.off();
      }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
      socket.on('message', message => {
        setMessageList(messageList => [ ...messageList, message ]);
      });
  }, [messageList]);
 //added argument: if present, method called when element changes
const handleMessage = (event) => {
  event.preventDefault();
  if(message){
    socket.emit('sendMessage', message, () => setMessage(''));
  }
}

  return (
    <div className="outerContainer">
      <div className="container">
         <Messages messages={messageList} name={user} />
         <Input message={message} setMessage={setMessage} sendMessage={handleMessage} />
      </div>
    </div>
  );
};

export default Chat;
