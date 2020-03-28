const app = require('express')();
const server = require ('http').Server(app);
const io = require ('socket.io')(server);
const router = require ('./router');

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log("connection done");

  socket.on('join', ({ user }, callback)=>{
    //const {error, user} = addUser ({id: socket.id, user});
    console.log (user);
    //if (error) return callback (error);

    callback();
  });
  socket.on('sendMessage', (message, callback) => {
    console.log (message);

  });


  socket.on('disconnect', () => {
    console.log("user has left");
  });



})

app.use(router);

server.listen(PORT, () => console.log (`Server started on ${PORT}`))
