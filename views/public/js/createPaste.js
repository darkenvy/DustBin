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
    select2: "/js/components/select2/dist/js/select2",
    modal: "/js/components/modal/javascripts/jquery.modal"
  }
});
require(["jquery"], function($) {
  require(["modal", "ace/ace", "crypto-js", "select2"], function(modal, ace, CryptoJS, select2) {
    // ----------- Editor Setup ----------- //
    
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night");
    editor.getSession().setMode("ace/mode/plain_text");


    // ----------- Init ----------- //
    // $('.modal').modal() // Init the modal
    $(".text-type-select").select2(); // Init the dropdown plugin
    $('.copy-box').each(function(idx, item) {item.readOnly = true})
    $('.copy-box').click(function() {this.select()})

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

    $('#review-button').click(function() {
      $('.modal').modal();
    });

    $('#upload-button').click(function() {
      if (editor.getValue().length < 4) return;
      $(this).hide();
      $('.modal').modal();
      $('#review-button').toggleClass('hide', false);
      editor.setReadOnly(true);
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
          $('#site-box').val(data)
          $('#priv-box').val(privateKey)
          $('#site-priv-box').val(data + '/' + privateKey)
        },
        error: function(xhr, statusCode, error) {
          console.log('error: ', error);
          if (xhr.status === 429) {
            alert("Too Many Requests");
            $('#upload-button').show();
            $('#review-button').hide();
          } else if (xhr.status === 500) {
            alert("500 Internal Server Error");
            $('#upload-button').show();
            $('#review-button').hide();
          }
        }
      });
    });

    // ----------- Decryption ----------- //
    // var undo = CryptoJS.AES.decrypt(encText.toString(), privateKey);
    // console.log(undo.toString(CryptoJS.enc.Utf8));

  });

});