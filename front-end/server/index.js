const app = require('express')();
const server = require ('http').Server(app);
const io = require ('socket.io')(server);
const router = require ('./router');
const users = require ('./onlineUsers');

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log("connection to front-end server made");

  socket.on('join', ({ user }, callback)=>{
    const {error, userObj} = users.addUser (user, socket.id);
    if (error) return callback(error);
    callback();
  });
  socket.on('sendMessage', (messageData, callback) => {
    const alias =messageData.toUsers;
    console.log ("send message to user " + alias);
    const socket = users.findUserByAlias(alias).socketId;
    io.to(socket).emit('message', {user:alias, text:messageData.message});
    callback();
  });


  socket.on('disconnect', () => {
    console.log("user has left");
  });



})

app.use(router);

server.listen(PORT, () => console.log (`Server started on ${PORT}`))
