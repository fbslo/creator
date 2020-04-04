var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var hive = require('steem-js-patched');
var fs = require('fs')

var con = require('./database.js')

//hive.api.setOptions({ url: 'https://api.hive.blog' });

hive.api.setOptions({
  address_prefix: 'TST',
  chain_id: '46d82ab7d8db682eb1959aed0ada039a6d49afa1602491f93dde9cac3e8e6c32',
  useTestNet: true,
});

var config = JSON.parse(fs.readFileSync('config.json'))

var payment = require("./scripts/payment.js")

if(config.accept_payment == 'true'){
	payment.getPayment()
}

//remove header
app.disable('x-powered-by');
//create express connection and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('dest'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json


app.get('/', (req, res) => {
	res.render('index')
})

app.post('/code', (req, res) => {
	var code = req.body.code
	var sql = 'SELECT * FROM tokens WHERE id=?'
	con.query(sql, [code], (err, result) => {
		if(err){
			console.log('Error selecting token! ' + err)
			res.status(500)
		}
		else{
			if(result.length != 0){
				res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ valid: true, code: code }));
			}
			else{
				res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ valid: false, code: code }));
			}
		}
	})
})

app.post('/createAccount', (req, res) => {
	var code = req.body.code
	var name = req.body.name
	var key = req.body.key

	var sql = 'SELECT * FROM tokens WHERE id=?'
	con.query(sql, [code], (err, result) => {
		if(err){
			console.log('Error selecting token! ' + err)
			res.status(500)
		}
		else{
			if(result.length != 0){
				const jsonMetadata = JSON.stringify(['account_creation_service', {
				  creator: config.account
				}]);
				var wif = config.key
				var fee = '0.000 STEEM'
				var creator = config.account
				var publicKeys = JSON.stringify(hive.auth.generateKeys(name, key, ['owner', 'active', 'posting', 'memo']));
				var owner = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.owner, 1]] };
				var active = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.active, 1]] };
				var posting = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.posting, 1]] };
				hive.broadcast.accountCreate(wif, fee, creator, name, owner, active, posting, publicKeys.memo, jsonMetadata, function(err, result) {
				  console.log(err, result);
				});
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ created: true, name: name, key: key }));
			}
			else{
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ created: false, name: name, key: key }));
			}
		}
	})
})

app.listen(5000)
