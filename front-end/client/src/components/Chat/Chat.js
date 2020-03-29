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
          console.log (onlineUsers);
          request
            .get(USER_URL)
            .query({user: user})
            .then(res => {
              console.log ("online users "+ JSON.stringify(onlineUsers));
              console.log (res);
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

      //unmount
      return () => {
        socket.emit('disconnect');

        socket.off();
      }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    console.log ("userhasJoined " + user);
      socket.on('userHasJoined', onlineUsers => {
         console.log ("friends "+ friends);
          const onlineFriends = _.intersection(friends,
              _.map(onlineUsers, "alias"));
            console.log ("online friend now: "+ onlineFriends);
            setOnlineFriendsList(onlineFriends);
          });

      }, [onlineFriendsList, friends]);

  useEffect(() => {
      socket.on('message', message => {
        setMessageList(messageList => [ ...messageList, message ]);
      });
  }, [messageList]);
 //added argument: if present, method called when element changes

 useEffect(() =>{

 }, []);

const handleMessage = (event) => {
  event.preventDefault();

  if(message){
    console.log ("I'm user "+ user + " sending to " + sendMessageTo);
    const messageData = { message:message,toUsers:sendMessageTo};
    console.log ("I'm user "+ user +" sending message " + JSON.stringify(messageData));
    socket.emit('sendMessage', messageData, () => setMessage(''));
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
