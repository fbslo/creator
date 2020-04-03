var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var hive = require('steem-js-patched');
var fs = require('fs')

var config = JSON.parse(fs.readFileSync('config.json'))

var payment = require("./scripts/payment.js")

payment.getPayment()

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
	if(code == 'fbslo'){
		//res.send(true)
		res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ valid: true, code: code }));
	} else {
		res.send(false)
	}
})

app.post('/createAccount', (req, res) => {
	var code = req.body.code
	var name = req.body.name
	var key = req.body.key
	console.log(code + key+ name)
	if(code == 'fbslo'){
		//res.send(true)
		res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ created: true, name: name, key: key }));
	} else {
		res.send(false)
	}
})

app.listen(5000)
