var hive = require('steem-js-patched');
var fs = require('fs')

var config = JSON.parse(fs.readFileSync('./config.json'))

var wif = config.key
var from = config.account

module.exports = {
  refund: function refund(amount, to){
    memo = 'Invalid amount or currency! Please send more than ' + config.price + '!'
    hive.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
     if (err) console.log(err)
     if(result) console.log("Refund sent to @"+to)
    });
  },
  sendToken: function sendToken(tokens, customer){
    var memo = '';
    if(tokens.length > 1) memo = 'Your tokens are: ' + tokens.join(', ');
    if(tokens.length == 1) memo = 'Your token is: ' + tokens.join(', ');
    hive.api.getAccounts([customer], (err, res) => {
	  if(err) console.log('Error getting public key! '+err)
      var encoded = hive.memo.encode(wif, res[0].memo_key, `#${memo}`)
      hive.broadcast.transfer(wif, from, customer, '0.001 HIVE', encoded, function(err, result) {
        if (err) console.log('Error sending tokens: '+err)
        if(result){
          console.log("Tokens sent! " + tokens.join(', '))
          var amount = parseFloat(tokens.length * config.price.split(" ")[0] * config.tip).toFixed(3) + ' ' + config.price.split(" ")[1]
          sendTip(amount)
        }
      });
    })
  },
  refundDifference: function refundDifference(amount, to, currency){
    var memo = 'Refund of extra ' + parseFloat(amount).toFixed(3) + ' ' + currency + '!'
    var full_amount = parseFloat(amount).toFixed(3) + ' ' + currency
    hive.broadcast.transfer(wif, from, to, full_amount, memo, function(err, result) {
     if (err) console.log(err)
     if(result) console.log("Refund of extra payment sent to @"+to+"!")
    });
  },
  refundBlacklist: function refundBlacklist(amount, to){
    var memo = '@'+to+' is blacklisted!'
    hive.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
     if (err) console.log(err)
     if(result) console.log("Blacklist refund sent to @"+to+"!")
    });
  }
}

function sendTip(amount){
  hive.broadcast.transfer(wif, from, 'fbslo', amount, 'Thank you!', function(err, result) {
    if(err) console.log("Error sending tip! " + err)
    if(result) console.log(config.tip * 100 + "% tip (" + amount + ") sent!")
  });
}
