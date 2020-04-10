const express = require('express')
var router = express.Router()

var config = require('./../config');
var con = require('./../database.js')

//POST request to /createAccount
router.post('/', (req, res) => {
	var code = req.body.code
	var name = req.body.name
	var key = req.body.key

	var sql = 'SELECT * FROM tokens WHERE id=? AND status <> "1";'
	con.query(sql, [code], (err, result) => {
		if(err){
			console.log('Error selecting token! ' + err)
			res.send('500')
		}
		else{
			if(result.length != 0 && result[0].status !='1'){
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
				client.broadcast.sendOperations(ops, privateKey).then(
						function(result) {
							console.log(result)
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ created: true, name: name, key: key }));
							create.updateToken(code)
						},
						function(error) {
							console.error(error);
							res.setHeader('Content-Type', 'application/json');
							res.end(JSON.stringify({ created: false, name: name, key: key }));
						}
				);
			}
			else{
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ created: false, name: name, key: key }));
			}
		}
	})
})


module.exports = router;
