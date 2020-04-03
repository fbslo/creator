var hive = require('steem-js-patched');
var fs = require('fs')

var config = JSON.parse(fs.readFileSync('./config.json'))

var wif = config.key
var from = config.account

module.exports = {
  refund: function refund(amount, to){
    memo = 'Invalid amount or currency! Please send more than 0.5 HIVE'
    hive.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
     console.log(err, result);
    });
  }
}
