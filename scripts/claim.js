var hive = require('steem-js-patched');
var fs = require('fs')

var config = JSON.parse(fs.readFileSync('config.json'))

var wif = config.key
var from = config.account

module.exports = {
  claimAccount: function claimAccount(){
    // TODO: claim discounted account token
  }
}
