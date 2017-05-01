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

require(["jquery", "ace/ace", "crypto-js", "select2"], function ($, ace, CryptoJS, select2) { // jshint ignore:line
  console.log(select2);
  // ----------- Editor Setup ----------- //
  var editor = ace.edit("editor");
  editor.setValue("", -1);
  editor.setReadOnly(true);
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");

  var privateKey,
      publicKey,
      pasteID = document.location.pathname.slice(1);

  var requestPaste = function() {
    console.log(publicKey);
    $.ajax({
      type: 'UNLOCK',
      url: '/verify',
      data: {
        hash: publicKey, 
        pasteID: pasteID
      },
      success: function(data, statusCode){ // jshint ignore:line
        var decText = CryptoJS.AES.decrypt(data, privateKey);
        decText = decText.toString(CryptoJS.enc.Utf8);
        editor.setValue(decText, 1);
      },
      error: function(xhr, statusCode, error) { // jshint ignore:line
        console.log('error')
        editor.setValue('Error: ' + error, 1)
      } 
    });
  }

  // ----------- Quick Load if private key in url ----------- //
  var quickSecret = document.location.pathname.slice(1).split('/');
  if (quickSecret.length > 1) {
    $('#unlock-hash').hide();
    $('#unlock-paste-button').hide();
    privateKey = quickSecret[1];
    publicKey  = CryptoJS.SHA1(privateKey).toString();
    pasteID    = quickSecret[0];
    requestPaste();
  }

  // ----------- Regular Load if no private key in url ----------- //
  $('#unlock-paste-button').click(function() {
    privateKey = $('#unlock-hash').val();
    publicKey  = CryptoJS.SHA1(privateKey).toString();
    requestPaste();
  });

});
