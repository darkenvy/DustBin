require.config({
  packages: [
    {
      name: 'crypto-js',
      location: '/js/components/crypto-js/',
      main: 'index'
    }
  ],
  baseUrl: window.location.protocol + "//" + window.location.host
         + window.location.pathname.split("/").slice(0, -1).join("/"),
  paths: {
    ace: "/js/components/ace-builds/src",
    jquery: "/js/components/jquery/dist/jquery",
    select2: "/js/components/select2/dist/js/select2"
  }
});

require(["jquery", "ace/ace", "crypto-js", "select2"], function ($, ace, CryptoJS, select2) {
  // console.log(select2);
  $(".text-type-select").select2();
  // ----------- Editor Setup ----------- //
  var editor = ace.edit("editor");
  // editor.setTheme("ace/theme/monokai");
  editor.setTheme("ace/theme/tomorrow_night");
  editor.getSession().setMode("ace/mode/javascript");


  // ----------- Init ----------- //
  // Random Nonce Generator
  var randomNonce = function(len) {
    var text = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // Don't trust the JS-Random for encryption. So we create a hash. The hash is our secret.
  var privateKey = randomNonce(12); // 12 'base62' is long enough to generate 40 'base16'
  privateKey     = CryptoJS.SHA1(privateKey).toString(); // returns 40 length 'base16'
  console.log('private: ', privateKey);
  var publicKey  = CryptoJS.SHA1(privateKey).toString();
  console.log('public: ', publicKey);
  
  // ----------- Event Listeners ----------- //
  $('#upload-button').click(function() {
    //  Encryption
    var encText = CryptoJS.AES.encrypt(editor.getValue(), privateKey);
    
    $.ajax({
      method: 'POST',
      url: '/upload',
      data: {
        publicKey: publicKey,
        encPaste: encText.toString()
      },
      timeout: 30000,
      success: function(data, statusCode) { // jshint ignore:line
        console.log('data: ', data);
      },
      error: function(xhr, statusCode, error) {
        console.log('error: ', error);
      }
    });
  });

  // ----------- Decryption ----------- //
  // var undo = CryptoJS.AES.decrypt(encText.toString(), privateKey);
  // console.log(undo.toString(CryptoJS.enc.Utf8));

});