const request = require('request');
const con = require("../scripts/config.js")

var fs = require('fs')

//Get data from configuration file
let rawdata = fs.readFileSync('./config/config.json');
let config_json = JSON.parse(rawdata);

module.exports = {
  getOldHiveBalance: function getOldHiveBalance(){
    var sl
  }
}
