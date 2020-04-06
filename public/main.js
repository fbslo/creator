steem.api.setOptions({ url: 'https://api.hive.blog' });

var price_per_account;
var currency;
var owner_account;
var memo;

$.ajax({
  url: '/api',
  contentType: "application/json",
  dataType: 'json',
  success: function(result){
    console.log("API result: " + JSON.stringify(result))
    price_per_account = result.price_per_account
    currency = result.currency
    owner_account = result.owner_account
    memo = result.memo
  }
});

function start(){
  var html = `<input type="text" class="form-control" placeholder="code" aria-label="code" aria-describedby="basic-addon1" id="code">
    <div class='input-group-append'>
    <button type="button" class="btn btn-success" onclick="isCodeValid()">Continue</button>
  </div>`
  document.getElementById('content').innerHTML = html
}

function buy(){
  var text = `<div class="input-group mb-3">
  <div class='input-group-prepend'>
    <span class="input-group-text" id="basic-addon1">@</span>
  </div>
    <input type="text" class="form-control" placeholder="Your HIVE username" aria-label="name" aria-describedby="basic-addon1" id="username">
    <div class='input-group-append'>
      <button type="button" class="btn btn-success" onclick="numberOfTokens()">Continue</button>
    </div>
  </div>`
  document.getElementById('content').innerHTML = text
}

function decryptUsername(){
  var text = `<div class="input-group mb-3">
  <div class='input-group-prepend'>
    <span class="input-group-text" id="basic-addon1">@</span>
  </div>
    <input type="text" class="form-control" placeholder="Your HIVE username" aria-label="name" aria-describedby="basic-addon1" id="username">
    <div class='input-group-append'>
      <button type="button" class="btn btn-success" onclick="decrypt()">Continue</button>
    </div>
  </div>`
  document.getElementById('content').innerHTML = text
}

function decrypt(){
  var username = document.getElementById('username').value
  var html = `<textarea type="text" class="form-control" placeholder="Encrypted Memo" aria-label="code" aria-describedby="basic-addon1" id="memo"></textarea>
    <div class='input-group-append'>
    <button type="button" class="btn btn-success" onclick="decryptMemo('${username}')">Continue</button>
  </div>`
  document.getElementById('content').innerHTML = html
}

function decryptMemo(username){
  var memo = document.getElementById('memo').value
  if(window.hive_keychain) {
    hive_keychain.requestHandshake(function() {
      decryptWithKeychain(username, memo)
    })
  } else{
    var html = `<div class="input-group mb-3">
    <input type="text" class="form-control" placeholder="Private memo key" aria-label="code" aria-describedby="basic-addon1" id="memo_key" required>
      <div class='input-group-append'>
      <button type="button" class="btn btn-success" onclick="decryptWithKey('${memo}', '${username}')">Continue</button>
    </div></div>`
    document.getElementById('content').innerHTML = html
  }
}

function decryptWithKey(memo, username){
  var memo_key = document.getElementById('memo_key').value
  var decrypted = steem.memo.decode(memo_key, memo)
  showDecryptedMemo(decrypted)
}

function decryptWithKeychain(username, memo){
  var rpc = 'https://api.hive.blog'
  hive_keychain.requestVerifyKey(username, memo, 'Memo', function(response) {
    console.log(response);
    showDecryptedMemo(response.result)
  }, rpc);
}

function showDecryptedMemo(memo){
  var html = `Name<div class="input-group mb-3"><textarea class="form-control" rows='10' placeholder="${memo}" value="${memo}" type="text" id='decrypted' readonly></textarea></div>`
  document.getElementById('content').innerHTML = html
}

function numberOfTokens(){
  var username = document.getElementById('username').value
  var html = `<div class="input-group mb-3">
  <input type="number" class="form-control" placeholder="Number of codes" aria-label="code" aria-describedby="basic-addon1" id="amount" required>
    <div class='input-group-append'>
    <button type="button" class="btn btn-success" onclick="buyTokens('${username}')">Continue</button>
  </div></div>`
  document.getElementById('content').innerHTML = html
}


function buyTokens(username){
  var amount = document.getElementById('amount').value
  if(window.hive_keychain) {
    hive_keychain.requestHandshake(function() {
      console.log('Handshake received!');
      keychain(username, amount)
    });
  } else {
    hivesigner(amount)
  }
}

function keychain(username, amount){
  var rpc = 'https://api.hive.blog'
  var amount_full = parseFloat(amount * price_per_account).toFixed(3)
  var payment_info = `<small class="text-muted">You can also send <code>${amount_full} ${currency}</code> to <code>@${owner_account}</code> with memo <code>${memo}</code></a>.</small>`
  document.getElementById('payment_info').innerHTML = payment_info
  hive_keychain.requestTransfer(username, owner_account, amount_full, memo, currency, function(response) {
  	console.log(response);
  }, true, rpc);
}

function hivesigner(amount){
  var price = amount * price_per_account
  var html = `<button type="button" class="btn btn-outline-success btn-block" onclick="window.location.href='https://hivesigner.com/sign/transfer?to=fbslo&amount=${price}%20HIVE&memo=account_creation'">Buy codes via HiveSigner!</button>`
  var payment_info = `<small class="text-muted">You can also send <code>${price} ${currency}</code> to <code>@${owner_account}</code> with memo <code>${memo}</code></a>.</small>`
  document.getElementById('content').innerHTML = ''
  document.getElementById('payment_button').innerHTML = html
  document.getElementById('payment_info').innerHTML = payment_info
}

function isCodeValid(){
  $.post("/code", {
    code: document.getElementById("code").value
  },
  function(data, status){
    if(status != 'success') alert("Something went wrong, please try again!")
    if(data.valid != true) document.getElementById("warning").innerHTML = 'Code is not correct!'
    if(data.valid == true) accountName(data.code)
  });
}

function accountName(code){
  var newText = `<div class="input-group mb-3">
  <div class='input-group-prepend'>
    <span class="input-group-text" id="basic-addon1">@</span>
  </div>
    <input type="text" class="form-control" placeholder="Account Name" aria-label="name" aria-describedby="basic-addon1" id="name">
    <div class='input-group-append'>
      <button type="button" class="btn btn-success" onclick="validateAccount('${code}')">Create Account</button>
    </div>
  </div>`
  document.getElementById('content').innerHTML = newText
  document.getElementById('warning').innerHTML = ''
  document.getElementById('check').innerHTML = ''
}

function validateAccount(code){
  var name = document.getElementById('name').value
  if(steem.utils.validateAccountName(name) == null){
     isAccountFree(name, code)
     document.getElementById('warning').innerHTML = ''
  } else {
    document.getElementById('warning').innerHTML = steem.utils.validateAccountName(name)
    document.getElementById('key').innerHTML = ''
    document.getElementById('check').innerHTML = ''
  }
}

function isAccountFree(name, code){
  steem.api.getAccounts([name], function(err, result) {
    if (result.length == 0){
      displayKey(name, code)
    } else {
      document.getElementById('warning').innerHTML = 'This account already exisits!'
      document.getElementById('key').innerHTML = ''
      document.getElementById('check').innerHTML = ''
    }
  });
}

function displayKey(name, code){
  var key = generateKey()
  generatePublicKeys(name, key, code)
}

function generatePublicKeys(name, key, code){
  var keys = `Password<div class="input-group mb-3"><input class="form-control" placeholder="${key}" value="${key}" type="text" id='key-copy' readonly>
  <div class='input-group-append'>
    <button type="button" class="btn btn-outline-primary" onclick="copy()">Copy</button>
    <button type="button" class="btn btn-outline-info" onclick="download()">Download</button>
  </div></div>`
  document.getElementById('key').innerHTML = keys
  document.getElementById('check').innerHTML = `<div class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" id="checkbox" name='checkbox'>
    <label class="custom-control-label" for="checkbox">I saved my password!</label>
    </div><button type="button" class="btn btn-success" onclick="createAccountWarning('${name}', '${key}', '${code}')" disabled name='create' id='create'>Create Account</button>`
    isChecked()
}

function isChecked(){
  var checkboxes = document.querySelectorAll('input[type=checkbox]'),
      checkboxArray = Array.from( checkboxes );
  function confirmCheck() {
    if (this.checked) {
      document.getElementById('create').disabled = false;
    }
  }
  checkboxArray.forEach(function(checkbox) {
    checkbox.addEventListener('change', confirmCheck);
  });
}

function createAccountWarning(name, key, code){
  Swal.fire({
  title: 'Did you save the password?',
  text: "You won't be able to recover this acccount if you lose your password!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, create account!'
  }).then((result) => {
    if (result.value) {
      createAccount(name, key, code)
    }
  })
}

function createAccount(name, key, code){
  $.post("/createAccount", {
    code: code,
    name: name,
    key: key
  },
  function(data, status){
    if(status != 'success') alert("Something went wrong, please try again!")
    if(data.created != true) document.getElementById("warning").innerHTML = 'Something went wrong, account was not created!'
    if(data.created == true) displayCreatedAccount(data.created, data.name, data.key)
  });
}

function displayCreatedAccount(created, name, key){
  document.getElementById("warning").innerHTML = ''
  document.getElementById("check").innerHTML = ''
  document.getElementById('key').innerHTML = ''
  document.getElementById('title').innerHTML = '<h3>HIVE Account Creator</h3><br><h1>Account Created</h1>'
  var createdText = `Name<div class="input-group mb-3"><input class="form-control" placeholder="${name}" value="${name}" type="text" id='name' readonly></div>
  Password<div class="input-group mb-3"><input class="form-control" placeholder="${key}" value="${key}" type="text" id='key-copy' readonly>  <div class='input-group-append'>
  <button type="button" class="btn btn-outline-primary" onclick="copy()">Copy</button>
  <button type="button" class="btn btn-outline-info" onclick="download()">Download</button>
  </div></div>`
  document.getElementById("content").innerHTML = createdText
}

function generateKey() {
  var key = '';
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (i=1;i<32;i++) {
    var c = Math.floor(Math.random()*chars.length + 1);
    key += chars.charAt(c)
  }
  return key;
}

function copy() {
  var textCopy = document.getElementById('key-copy').value
  navigator.clipboard.writeText(textCopy);
  alert("Copied to clipboard: " + textCopy);
}

function download() {
  var text = 'Account Name: ' + document.getElementById('name').value + '\nPassword: ' +document.getElementById('key-copy').value
  var filename = 'HIVE-' + document.getElementById('name').value + '.txt'
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  console.log(element)
  document.body.removeChild(element);
}

window.onbeforeunload = function() {
    return "Did you save the password?"
}
