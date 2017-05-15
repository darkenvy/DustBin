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
  // ----------- Editor Setup ----------- //
  
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/tomorrow_night");
  editor.getSession().setMode("ace/mode/plain_text");


  // ----------- Init ----------- //

  $(".text-type-select").select2(); // Init the dropdown plugin

  var randomNonce = function(len) {
    var text = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < len; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  // Don't trust the JS-Random for encryption. So we create a hash. The hash is our secret.
  var privateKey = randomNonce(12); // 12 'base62' is long enough to generate 40 'base16'
  privateKey     = CryptoJS.SHA1(privateKey).toString(); // returns 40 length 'base16'
  var publicKey  = CryptoJS.SHA1(privateKey).toString();
  console.log('private: ', privateKey);
  console.log('public: ', publicKey);
  
  // ----------- Event Listeners ----------- //
  $(".text-type-select").on("select2:select", function (e) { 
    var selectedTextType = this.options[this.selectedIndex].value;
    console.log(selectedTextType);
    editor.getSession().setMode("ace/mode/" + selectedTextType);
  });

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
      success: function(data, statusCode) {
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