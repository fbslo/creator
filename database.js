var mysql = require("mysql");
const fs = require('fs');

//Get credentials  from configuration file
var config = JSON.parse(fs.readFileSync('config.json'))
var { database_ip, database_user, database_password, database_port, database } = config

//create connection to MySQL database
var con = mysql.createConnection({
  host: database_ip,
  database: database,
  user: database_user,
  password: database_password,
  port: database_port,
  multipleStatements: true
});

function connect(){
  //connect to MySQL database
  con.connect(function(err) {
      if (err) {
          console.error('Error connecting: ' + err.stack);
          connect()
      }
      console.log('Connected as ID: ' + con.threadId);
  });
}

connect()


//keep the connection running
setInterval(() => {
    con.query('SELECT 1', (err, results) => {})
},5000)

module.exports = con;
