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
exports.getRooms =() => rooms;
