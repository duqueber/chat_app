const onlineUsers = [];

exports.addUser = (alias, socketId) => {

  if (onlineUsers.find((user)=> user.alias === alias)) return {error:"Duplicated alias"};
  user = {alias, socketId};
  onlineUsers.push(user);
  console.log ("User added to online users" + JSON.stringify(user));
  return {user};
}

exports.findUserByAlias = (alias) => onlineUsers.find((user) => user.alias === alias );

exports.findUserBySocketId = (socketId) => onlineUsers.find((user) => user.socketId === socketId );

exports.removeUser = (alias) =>{
  const index = onlineUsers.findIndex((user) => user.alias === alias);

  if(index !== -1) return onlineUsers.splice(index, 1)[0];
}
