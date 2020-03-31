const app = require('express')();
const server = require ('http').Server(app);
const io = require ('socket.io')(server);
const router = require ('./router');
const users = require ('./onlineUsers');
const rooms = require ('./rooms');
const _ = require ('lodash');

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log("connection to front-end server made");

  socket.on('join', ({ user }, callback)=>{
    const {error, userObj} = users.addUser (user, socket.id);
    if (error) return callback(error);
    onlineUsers = users.getOnlineUsers();
    console.log ("get online users from on join " + JSON.stringify(onlineUsers));
    socket.broadcast.emit('onlineUsersChanged', users.getOnlineUsers());
    callback(null, users.getOnlineUsers());
  });

  socket.on('sendMessage', (messageData, callback) => {
    const alias =messageData.toUsers;
    const members = [alias, messageData.fromUser];
    console.log ("find room for members "+ members )
    const room = rooms.findRoomByMembers([alias, messageData.fromUser])
    //assume that there is a room, if created after clicking
    console.log ("send message to room "+ JSON.stringify(room));
    io.to(room.id).emit('message', {user:messageData.fromUser, text:messageData.message});

    // const socket = users.findUserByAlias(alias);
    // if (!socket){
    //   return callback("there is no socket for that user")
    // }
      // socketId = socket.socketId;
    // io.to(`${socketId}`).emit('message', {user:messageData.fromUser, text:messageData.message});
    callback();
  });

  socket.on('createRoom', data =>{
    const members = [data.sendMessageTo, data.user];
      if (!rooms.findRoomByMembers(members)){
        // probably need a uuid, something that avoids duplicates. Using random for simplicity
        const id =Math.floor(Math.random() * 1000);
        rooms.addRoom(id, members);
        console.log (data.user + " joins "+ id);
        socket.join(id);
        const socketOfOther = users.findUserByAlias(data.sendMessageTo);

        if (socketOfOther){
          console.log ("other socket "+ JSON.stringify(socketOfOther));
          socketId=socketOfOther.socketId;
          io.to(`${socketId}`).emit('createdRoom', id);
        }else {
          console.log ("error joining room");
        }
    }
  });

  socket.on('joinRoom', id =>{
      console.log ("joined room "+ id + " for socket "+ socket.id);
      socket.join(id);
  });

  socket.on('leaveRoom', roomId =>{
    console.log("leaving room "+ roomId)
    socket.leave(roomId);
  });
  socket.on('disconnect', () =>{
    console.log("user has left ");
    const user = users.findUserBySocketId(socket.id);
    if (user){
      users.removeUser(socket.id);
      socket.broadcast.emit('onlineUsersChanged', users.getOnlineUsers());
      const rooms_ = rooms.findRoomByMember(user.alias);
      console.log (JSON.stringify (rooms_));
    // I'm closing room bc only two members can be in room
    _.forEach (rooms_, room => {
        io.to(room.id).emit('userHasLeft', user.alias)
        io.to(room.id).emit('closeRoom', room.id)
        rooms.removeRoom(room.id);
      });


    }
    //console.log (Object.keys(socket.rooms));
  });



})

app.use(router);

server.listen(PORT, () => console.log (`Server started on ${PORT}`))
