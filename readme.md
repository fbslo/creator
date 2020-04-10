<center><h2>HIVE Creator</h2><em>Make Money Creating Accounts</em><br><h2>Visit website: https://www.fbslo.net/creator</h2></center>


***What is HIVE Creator?*** It's an open source app that allows anyone to host account creation service (like [Blocktrades.us](https://blocktrades.us/en/create-hive-account))

***How does it work?***

Anyone can set up the web app, users can send HIVE/HBD to owner's account and they will get account creation codes/tokens (sent back in encrypted memo). Users can than use this codes to create new accounts.

If users don't use memo `account_creation`, payment will not be detected. If amount is less than price or currency is not correct (eg. HIVE instead of HBD), transfer will be refunded. You can always see current price per account at `website.com/api` API.


***Features:***
* Account creation
* Claiming accounts (optional)
* Receiving payments & handling all cupon codes (optional)
* Memo decryption
* API for creating accounts

***For-profit system is not required, you can disable payments and create/distribute codes manually.***

Because some HIVE frontends don't support memo decryption, you can use tool on the website to decrypt memo (Keychain & private memo key supported) and get your account creation tokens!

You can also use tool on the site to buy account creation tokens (HiveSigner & Keychain supported)!

All transfers are divided by price and than rounded down. If you send 10.3 HIVE and price is 0.500 HIVE, you will get 20 codes and remaining will NOT be refunded (in v1.0, it might change in future).

---

<center><h2>How to set up the app</h2></center>

- NodeJS & NPM
- MySQL database

(Detailed instructions: https://gist.github.com/fbslo/b63bab4c9e7cfc09e5b613fbe4715937)

Service was tested on Windows 10 and Ubuntu 16.04. This instructions are for Ubuntu 16.04.

1 - Clone Github repository: https://github.com/fbslo/creator

`git clone https://github.com/fbslo/creator.git`

`cd creator`

`npm install`

2 - Create MySQL database:

`mysql  -p`

`create database creator;`

`use creator;`

`create table tokens(id TEXT, status INTEGER);`

`id` is used to store account creation token, `status` is NULL before token is used and 1 after it is used.

If you want to enable API, create two more tables:

`create table logs(status TEXT, name TEXT, user TEXT, time TEXT);`

`status` is true or false, `name` is username of created account, `user` is name of API user (e.g dApp) (user from `apitokens` table).

`create table apitokens(token TEXT, user TEXT);`

`token` is random string used as authorization secret, `user` is name of API user (e.g dApp).


3 - Rename and edit config.json

Rename config.demo.json to config.json

```
{
  "account": "youraccount",
  "key": "thisisyouractivekey",
  "create_account_frontend": "true", //enable or disable frontend website
  "create_account_api": "true", //enable or disable API for creating accounts
  "accept_payment": "true", //set to false if you don't want to accept payments
  "price": "0.5 HIVE",
  "claim": "false",  //set to true if you want to claim account every 12 hours
  "tip": "0.1", //send 10% tip to @fbslo, you can set it to 0 to disable
  "rpc": "https://api.hive.blog",
  "database_ip": "localhost",
  "database_user": "root", //your database user
  "database_password": "database_password", //your database password
  "database_port": "3306",
  "database": "creator",
  "env": "dev" //set to production for production mode (https), any other mode starts server on port 5000
}
```

Note: If you enable account claiming, it will claim accounts every 12 hours and it will run until you ***run out of RCs*** (or any other error). Than it will pause for 12h and try again. ***Use with caution!***

<br>

4 - Run the service:

`node app.js`

Or use pm2: `pm2 start app.js`

***YOU SHOULDN'T RUN THIS APP AS ROOT! Use nginx as reverse proxy, run app in dev mode and forward all requests to port 5000. See [THIS tutorial](https://coderrocketfuel.com/article/deploy-a-nodejs-application-to-digital-ocean-with-https), you will also get automatic SSL keys generated***

***You should use SSL! Private keys are sent from front-end to server and than back to client!***

In production mode, SSL is required!
Create key.pem and cert.pem and store them to /ssl directory. You can get free SSL certificates on https://www.sslforfree.com/. ***(Not recommended, see nginx setup above)***

API is available at website.com/api

---

Please report any bugs.
If you have any questions, need help installing or using this service, please contact me.
Feel free to fork this project and add more features :)

---

<center><b>@fbslo</b><br>Discord: fbslo#8470</center>

---

***This SOFTWARE PRODUCT is provided by THE PROVIDER "as is" and "with all faults." THE PROVIDER makes no representations or warranties of any kind concerning the safety, suitability, lack of viruses, inaccuracies, typographical errors, or other harmful components of this SOFTWARE PRODUCT. There are inherent dangers in the use of any software, and you are solely responsible for determining whether this SOFTWARE PRODUCT is compatible with your equipment and other software installed on your equipment. You are also solely responsible for the protection of your equipment and backup of your data, and THE PROVIDER will not be liable for any damages you may suffer in connection with using, modifying, or distributing this SOFTWARE PRODUCT.***
