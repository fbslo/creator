steem.api.setOptions({ url: 'https://api.hive.blog' });

var code = document.getElementById('code').value

function isCodeValid(){
  $.post("/code", {
    code: document.getElementById("code").value
  },
  function(data, status){
    if(status != 'success') alert("Something went wrong, please try again!")
    if(data != true) document.getElementById("warning").innerHTML = 'Code is not correct!'
    if(data == true) accountName()
  });
}

function accountName(){
  var newText = `<div class="input-group mb-3">
  <div class='input-group-prepend'>
    <span class="input-group-text" id="basic-addon1">@</span>
  </div>
    <input type="text" class="form-control" placeholder="Account Name" aria-label="name" aria-describedby="basic-addon1" id="name">
    <div class='input-group-append'>
      <button type="button" class="btn btn-success" onclick="validateAccount()">Create Account</button>
    </div>
  </div>`
  document.getElementById('content').innerHTML = newText
  document.getElementById('warning').innerHTML = ''
}

function validateAccount(){
  var name = document.getElementById('name').value
  if(steem.utils.validateAccountName(name) == null){
     isAccountFree(name)
     document.getElementById('warning').innerHTML = ''
  } else {
    document.getElementById('warning').innerHTML = steem.utils.validateAccountName(name)
    document.getElementById('key').innerHTML = ''
  }
}

function isAccountFree(name){
  steem.api.getAccounts([name], function(err, result) {
    if (result.length == 0){
      displayKey(name)
    } else {
      document.getElementById('warning').innerHTML = 'This account already exisits!'
      document.getElementById('key').innerHTML = ''
    }
  });
}

function displayKey(name){
  var key = generateKey()
  generatePublicKeys(name, key)
}

function generatePublicKeys(name, key){
  var publicKeys = JSON.stringify(steem.auth.generateKeys(name, key, ['owner', 'active', 'posting', 'memo']));
  var owner = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.owner, 1]] };
  var active = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.active, 1]] };
  var posting = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.posting, 1]] };
  var keys = `Password<div class="input-group mb-3"><input class="form-control" placeholder="${key}" value="${key}" type="text" id='key-copy' readonly>
  <div class='input-group-append'>
    <button type="button" class="btn btn-outline-primary" onclick="copy()">Copy</button>
    <button type="button" class="btn btn-outline-info" onclick="download()">Download</button>
  </div></div>`
  document.getElementById('key').innerHTML = keys
  document.getElementById('check').innerHTML = `<div class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" id="checkbox" name='checkbox'>
    <label class="custom-control-label" for="checkbox">I saved my password!</label>
    </div><button type="button" class="btn btn-success" onclick="createAccount()" disabled name='create' id='create'>Create Account</button>`
}

function enableDisableButton() {
  console.log('8sasas')
  var isChecked = ($('input[name=checkbox]').is(':checked'));
  if (isChecked == true) {
    $("button[name='createAccount']").removeAttr("disabled").button('refresh');
  }
  else {
    $("button[name='create']").attr("disabled", "disabled").button('refresh');
  }
}

$("#checkbox").click(function(){
  enableDisableButton();
  console.log('aas')
});

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
  var filename = document.getElementById('name').value + '.txt'
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  console.log(element)
  document.body.removeChild(element);
}
