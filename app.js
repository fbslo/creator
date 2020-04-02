var express =  require("express");
var app = express();
var bodyParser = require("body-parser");
var hive = require('steem');

//remove header
app.disable('x-powered-by');
//create express connection and serve static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('dest'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // for parsing application/json

hive.api.setOptions({ url: 'https://api.hive.blog' });

var hiveBalance = 0

async function start(){
	console.log("Starting...")
	getHiveTransactions()
}

async function getHiveTransactions(){
	hive.api.streamTransactions('head', function(err, result) {
		//if (err) start()
		try {
			let type = result.operations[0][0]
			let data = result.operations[0][1]
			if(type == 'transfer' && data.to == 'fbslo'){
			  console.log(data)
			  console.log(data.amount)
				hiveBalance += Number(data.amount.split(" ")[0])
			}
		} catch (err) {
			//start()
		}
	});
}


start()


app.get('/', (req, res) => {
	res.render('index')
})

app.post('/code', (req, res) => {
	var code = req.body.code
	if(code == 'fbslo'){
		res.send(true)
	} else {
		res.send(false)
	}
})

app.listen(5000)
