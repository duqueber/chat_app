import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import request from 'superagent';
import _ from 'lodash';
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
  const [onlineFriendsList, setOnlineFriendsList] = useState([]);
  const [friends, setFriends]= useState([]);
  const [sendMessageTo, setSendMessageTo] = useState('');

  const ENDPOINT = 'localhost:5000';
  const USER_URL = 'http://localhost:5020/api/v1/user';
  useEffect(() => {
      const { user } = queryString.parse(location.search);
      socket = io(ENDPOINT);
      setUser(user);

      socket.emit('join', {user}, (error, onlineUsers) => {
          if (error){
            alert(error);
          }
          console.log ("from join event ");
          request
            .get(USER_URL)
            .query({user: user})
            .then(res => {
              console.log ("online users "+ JSON.stringify(onlineUsers));
              console.log ("friends of user " + user + ": "+ res.body.friends);
              setFriends(res.body.friends);
              const onlineFriends = _.intersection(res.body.friends,
                _.map(onlineUsers, "alias"));
              console.log ("online friend now: "+ onlineFriends);
              setOnlineFriendsList(onlineFriends);
             })
            .catch(err => {
              alert ("Error retrieving user");
            });
      });

      socket.on('userHasJoined', onlineUsers => {
          handleUserHasJoined(user, onlineUsers);
        });

        socket.on('message', message => {
          handleOnMessage(message);
        });

          socket.on('createdRoom', id =>{
              socket.emit('joinRoom', id);
          });

      //unmount
      return () => {
        socket.emit('disconnect');

        socket.off();
      }
  }, [ENDPOINT, location.search]);

useEffect(() => {
  console.log ("create a room with user "+sendMessageTo);
  if (sendMessageTo){
    var data= {sendMessageTo, user};
    socket.emit('createRoom', data);
  }
}, [sendMessageTo]);


// added argument: if present, method called when element changes
const handleUserHasJoined = (user, onlineUsers) =>{
  request
    .get(USER_URL)
    .query({user: user})
    .then(res => {
      console.log ("friends of user " + user + ": "+ res.body.friends);
      setFriends(res.body.friends);
      const onlineFriends = _.intersection(res.body.friends,
        _.map(onlineUsers, "alias"));
      console.log ("online friend now: "+ onlineFriends);
      setOnlineFriendsList(onlineFriends);
     })
    .catch(err => {
      alert ("Error retrieving user");
    });
}

const handleOnMessage = (message) => {
  console.log ("on message " + JSON.stringify(message));
  setMessageList(messageList => [ ...messageList, message ]);
}

const handleMessage = (event) => {
  event.preventDefault();

  if(message){
    console.log ("I'm user "+ user + " sending to " + sendMessageTo);
    const messageData = { message:message,toUsers:sendMessageTo,fromUser:user};
    console.log ("I'm user "+ user +" sending message " + JSON.stringify(messageData));

    socket.emit('sendMessage', messageData, () => {
      console.log ("user from sendMsg " +user);
      setMessage('')});
  }
};


  return (
    <div className="outerContainer">
      <div className="container">
        <div className="inner">
         <Messages messages={messageList} name={user} />
          <Friends friends={onlineFriendsList} setFriendSelected={setSendMessageTo}/>
         </div>
         <Input message={message} setMessage={setMessage} sendMessage={handleMessage} />
      </div>
    </div>
  );
};

export default Chat;
