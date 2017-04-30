require.config({
  packages: [
    {
      name: 'crypto-js',
      location: 'js/components/crypto-js/',
      main: 'index'
    }
  ],
  baseUrl: window.location.protocol + "//" + window.location.host
         + window.location.pathname.split("/").slice(0, -1).join("/"),
  paths: {
    ace: "js/components/ace-builds/src",
    jquery: "js/components/jquery/dist/jquery"
    // cryptojs: "js/components/crypto-js/"
  }
});

require(["jquery", "ace/ace", "crypto-js"], function ($, ace, CryptoJS) {
  // Editor Setup
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");

  // console.log(CryptoJS);
  $('#upload-button').click(function() {
    //  Encryption
    console.log(editor.getValue().length);
    var encText = CryptoJS.AES.encrypt(editor.getValue(), 'mykey123');
    console.log(encText.toString());
    // var undo = CryptoJS.AES.decrypt(text.toString(), 'mykey123');
    // console.log(undo.toString(CryptoJS.enc.Utf8));

    $.ajax({
      method: 'POST',
      url: '/upload',
      data: {paste: encText.toString()},
      timeout: 30000,
      success: function(data, statusCode) { // jshint ignore:line
        console.log('data: ', data);
      },
      error: function(xhr, statusCode, error) {
        console.log('error: ', error);
      }
    });
  });

});