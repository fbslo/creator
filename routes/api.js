const express = require('express')
var router = express.Router()

var config = require('./../config');
var con = require('./../database.js')

const dsteem = require('dsteem');
let opts = {};
const client = new dsteem.Client(config.rpc);
var return_status;

//GET /api for basic info about service
router.get('/', (req, res) => {
	var api_response = {
		price_per_account: config.price.split(" ")[0],
		currency: config.price.split(" ")[1],
		owner_account: config.account,
		memo: 'account_creation'
	}
	res.json(api_response)
})

/*POST to /api/createAccount
* Headers: authority
* Body: name, key
*/
router.post('/createAccount', (req, res) => {
  if(config.create_account_api == 'true'){
    //req.headers.authority is auth token
    if(!req.headers.authority){
      res.send("Authorization header missing!")
    } else {
      var auth = req.headers.authority
      var sql = 'SELECT * FROM apiTokens WHERE token = ?;'
      con.query(sql, [auth], (err, result) => {
        if(err) {
          res.send('Error selecting authorization token!')
          console.log("Error selecting authorization token from database! " + err)
        }
        if(result){
          if(result.length != 0) {
            //result[0].user is creator of the account
            var name = req.body.name
            var key = req.body.key
            res.setHeader('Content-Type', 'application/json');
            createAccount(result[0].user, result[0].token, name, key).then((response) => {
              console.log(response)
              res.send(response)
            })
          } else {
            var ip_raw = req.ip || req.ips || req.connection.remoteAddress
            var ip = ip_raw.replace('::ffff:', '');
            res.send('Authorization token is not correct!')
            console.log('Failed api request from IP: ' + ip)
          }
        }
      })
    }
  } else {
    res.send('API is not enabled!')
  }
})


function createAccount(user, token, name, key){
  const jsonMetadata = JSON.stringify(['account_creation_service', {
    creator: config.account,
    price: config.price
  }]);
  const ownerKey = dsteem.PrivateKey.fromLogin(name, key, 'owner');
  const activeKey = dsteem.PrivateKey.fromLogin(name, key, 'active');
  const postingKey = dsteem.PrivateKey.fromLogin(name, key, 'posting');
  const memoKey = dsteem.PrivateKey.fromLogin(
      name,
      key,
      'memo'
  ).createPublic(opts.addressPrefix);

  const ownerAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
  };
  const activeAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
  };
  const postingAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
  };

  //create account
  const privateKey = dsteem.PrivateKey.fromString(config.key);
  let ops = [];
  const create_op = [
      'create_claimed_account',
      {
          creator: config.account,
          new_account_name: name,
          owner: ownerAuth,
          active: activeAuth,
          posting: postingAuth,
          memo_key: memoKey,
          json_metadata: jsonMetadata,
          extensions: []
      },
  ];
  ops.push(create_op)
  //send transaction to blockchain
  return client.broadcast.sendOperations(ops, privateKey).then(
      function(result) {
        console.log(result)
        var status = 'true'
        return_status = JSON.stringify({ created: true, name: name, key: key })
		saveToDatabase(status, name, user)
        return return_status;
      },
      function(error) {
        var status = 'false'
        //console.error(error);
        return_status = JSON.stringify({ created: false, name: name, key: key })
		saveToDatabase(status, name, user)
        return return_status;
      }
  );
}

/*
* Status is true/false
* Name is account name of new account
* User is owner of Api Tokens (dApp...)
*/

function saveToDatabase(status, name, user){
  var time = new Date
  var values = [[status, name, user, time]]
  var sql = 'INSERT INTO logs (status, name, user, time) values ?'
  con.query(sql, [values], (err, result) => {
    if(err) console.log("Error inserting logs! " + err)
    if(result) console.log("Logs inserted!")
  })
}

module.exports = router;
