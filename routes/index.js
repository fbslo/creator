const express = require('express')
var router = express.Router()

var config = require('./../config');

router.get('/', (req, res) => {
	if(config.create_account_frontend == 'true'){
		res.render('index')
	} else {
		res.send('Frontend is disabled!')
	}
})

module.exports = router;
