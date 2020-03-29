var db = require ('./db.json');
exports.findUser = function (user){
  return db.find( o => o.alias === user);

}
