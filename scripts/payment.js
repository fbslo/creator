var hive = require('steem');

var money = require('./money.js')
var create = require('./createToken.js')

var price = '0.5'

hive.api.setOptions({ url: 'https://api.hive.blog' });

module.exports = {
  getPayment: function getPayment(){
    money.key()
  	hive.api.streamTransactions('head', function(err, result) {
  		if (err) getPayment()
  		try {
  			let type = result.operations[0][0]
  			let data = result.operations[0][1]
  			if(type == 'transfer' && data.to == 'fbslo'){
  			  var amount = data.amount.split(" ")[0]
          var currency = data.amount.split(" ")[1]
          if(amount < price || currency != 'HIVE'){
            money.refund(data.amount, data.from) // TODO:  does not exisit yet
          } else {
            create.createToken() // TODO:  does not exist yet
          }
  			}
  		} catch (err) {
  			getPayment()
  		}
  	});
  },
  //secret generator function
  generateHexString: function generateHexString(length) {
    var ret = "";
    while (ret.length < length) {
      ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0,length);
  },
  getQrCode: function getQrCode(address, amount){
    QRCode.toDataURL('bitcoin:' + address + '?amount='+amount, { errorCorrectionLevel: 'H' }, function (err, url) {
      base64Img.img(url, 'dest', address, function(err, filepath) {
        var qr = filepath.substring(4)
        return qr;
      })
    })
  }
}
