var _ =require ('lodash');
const rooms = [];

exports.addRoom = (id, members) => {
  room = {id, members};
  rooms.push(room);
  console.log ("Room added to rooms" + JSON.stringify(room));
  return {room};
}

exports.findRoomByMembers = (members) => {
  console.log ("members "+ members);
  members.sort();
  return rooms.find((room) => _.isEqual (members, room.members.sort() ));
}

exports.findRoomByMember = (member) => {
  console.log ("member "+ member);
  console.log(rooms.filter((room) => room.members.includes(member)));
  return rooms.filter((room) => room.members.includes(member));
}
exports.getRooms =() => rooms;

exports.removeRoom = (id) =>{
  const index = rooms.findIndex((room) => room.id === id);
  if(index !== -1) return rooms.splice(index, 1)[0];
}
