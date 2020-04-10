const express = require('express')
var router = express.Router()

var config = require('./../config');
var con = require('./../database.js')

//GET /api
router.get('/', (req, res) => {
	var api_response = {
		price_per_account: config.price.split(" ")[0],
		currency: config.price.split(" ")[1],
		owner_account: config.account,
		memo: 'account_creation'
	}
	res.json(api_response)
})

module.exports = router;
