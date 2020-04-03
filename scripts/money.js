var hive = require('steem');

var wif = 'null'
var from = 'fbslo'

module.exports = {
  refund: function refund(amount, to){
    memo = 'Invalid amount or currency! Please send more than 0.5 HIVE'
    hive.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
     console.log(err, result);
    });
  },
  resteem: function resteem(){
    const json = JSON.stringify(['test', {
      account: from,
      author: 'timsaid',
      permlink: 'myth-or-fact-25-bats-are-blind'
    }]);
    hive.broadcast.customJson(wif, [], [from], 'test', json, (err, result) => {
      console.log(err, result);
    });
  },
  key: function key(){
    console.log(hive.auth.wifIsValid(wif, 'STM7X4ZNGveN4frLdfmhCkr3ivLPYKmzScCEgDsD2mXb8rHisKE7w'))
  }
}
