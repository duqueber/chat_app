
var db = require ("./db.js");

exports.handleGetUser = (req, res) => {
  let user = req.query.user;
  let found = db.findUser(user);
  console.log ("handleGetUser "+ JSON.stringify(found));
  res.status(200).send(found)

}
