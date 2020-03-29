import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import request from 'superagent';
import Messages from '../../borrowed_components/Messages/Messages';
import Input from '../../borrowed_components/Input/Input';
import Friends from '../Friends/Friends';
import '../../borrowed_css/Chat/Chat.css';


let socket;

//location comes from prop router
const Chat = ({location}) => {

  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const ENDPOINT = 'localhost:5000';
  const USER_URL = 'http://localhost:5020/api/v1/user';
  useEffect(() => {
      const { user } = queryString.parse(location.search);
      socket = io(ENDPOINT);
      setUser(user);

      socket.emit('join', {user}, (error) => {
          if (error){
            alert(error);
          }
      });
      request
        .get(USER_URL)
        .query({user: user})
        .then(res => {
          setFriendsList(res.body.friends);
         })
        .catch(err => {
          alert ("Error retrieving user");
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
    console.log ("I'm user "+ user);
    const messageData = { message:message,toUsers:"user1"};
    console.log ("sending message " + JSON.stringify(messageData));
  //  socket.emit('sendMessage', messageData, () => setMessage(''));
  }
}

  return (
    <div className="outerContainer">
      <div className="container">
        <div className="inner">
         <Messages messages={messageList} name={user} />
          <Friends friends={friendsList}/>
         </div>
         <Input message={message} setMessage={setMessage} sendMessage={handleMessage} />
      </div>
    </div>
  );
};

export default Chat;
