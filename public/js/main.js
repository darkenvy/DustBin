require.config({
  baseUrl: window.location.protocol + "//" + window.location.host
         + window.location.pathname.split("/").slice(0, -1).join("/"),
  paths: {
    ace: "js/components/ace-builds/src",
    jquery: "js/components/jquery/dist/jquery"
  }
});

require(["jquery", "ace/ace"], function ($, ace) {
  // Editor Setup
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");

  $('#upload-button').click(function() {
    console.log(editor.getValue());
    $.ajax({
      method: 'POST',
      url: '/upload',
      data: {paste: editor.getValue()},
      timeout: 30000,
      success: function(data, statusCode) { // jshint ignore:line
        console.log('data: ', data);
      },
      error: function(xhr, statusCode, error) {
        console.log('error: ', error);
      }
    })
  });

});