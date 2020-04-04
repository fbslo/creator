var con = require('../database.js')
var money = require('./money.js')

module.exports = {
  createToken: function createToken(amount, customer){
    var token = generateHexString(12*amount)
    var tokens = token.match(/.{12}/g)
    insertIntoDatabase(tokens)
    money.sendToken(tokens, customer)
  }
}

function insertIntoDatabase(tokens){
  var newArray = new Array(Math.ceil(tokens.length / 1)).fill("")
    .map(function() { return this.splice(0, 1) }, tokens.slice());

  var sql = 'INSERT INTO tokens(id) VALUES ?'
  con.query(sql, [newArray], (err, result) => {
    if(err) console.log("Error inserting token: " + err)
    if(!err) console.log("Tokens "+tokens+" inserted!")
  })
}

function generateHexString(length) {
  var ret = "";
  while (ret.length < length) {
    ret += Math.random().toString(16).substring(2);
  }
  return ret.substring(0,length);
}
