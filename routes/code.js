const express = require('express')
var router = express.Router()

var config = require('./../config');
var con = require('./../database.js')

//POST request to /code
router.post('/', (req, res) => {
	var code = req.body.code
	var sql = 'SELECT * FROM tokens WHERE id=?;'
	con.query(sql, [code], (err, result) => {
		if(err){
			console.log('Error selecting token! ' + err)
			res.status(500)
		}
		else{
			if(result.length != 0){
				if(result[0].status != '1'){
					res.setHeader('Content-Type', 'application/json');
			    res.end(JSON.stringify({ valid: true, code: code }));
				}
				else{
					res.setHeader('Content-Type', 'application/json');
			    res.end(JSON.stringify({ valid: false, code: code }));
				}
			}
			else{
				res.setHeader('Content-Type', 'application/json');
		    res.end(JSON.stringify({ valid: false, code: code }));
			}
		}
	})
})

module.exports = router;
