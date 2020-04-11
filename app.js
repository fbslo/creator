var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var hive = require('steem-js-patched');
var fs = require('fs')
const https = require('https');

const dsteem = require('dsteem');
let opts = {};


var con = require('./database.js')

var config = require('./config')

hive.api.setOptions({ url: config.rpc });
const client = new dsteem.Client(config.rpc);

var payment = require("./scripts/payment.js")
var create = require('./scripts/createToken.js')
var claim = require('./scripts/claim.js')


if(config.accept_payment == 'true'){
	payment.getPayment()
}

if(config.claim == 'true'){
	claim.claimAccount()
}

//remove header
app.disable('x-powered-by');
//allow requests from other domains
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
//create express connection and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('dest'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json

app.use('/', require('./routes/index.js'));
app.use('/code', require('./routes/code.js'));
app.use('/createAccount', require('./routes/createAccount.js'));
app.use('/api', require('./routes/api.js'));


//you should use 'dev' mode and than NGINX as reverse proxy to forward requests to port 5000. Read README.md
if(config.env.toLowerCase() == 'production'){
  // Variables for https and http
  var port_http = 80 //port for http
  var port_https = 443 //port for https
  // we will pass our 'app' to 'https' server
  https.createServer({
      key: fs.readFileSync('./ssl/key.pem'),
      cert: fs.readFileSync('./ssl/cert.pem')
      //passphrase: 'password'
  }, app)
  .listen(port_https);

  // Redirect from http port 80 to https
  var http = require('http');
  http.createServer(function (req, res) {
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end();
  }).listen(port_http);
} else {
	app.listen(5000)
}
