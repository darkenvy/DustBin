/* globals requirejs */

require.config({
  baseUrl: window.location.protocol + "//" + window.location.host
  + window.location.pathname.split("/").slice(0, -1).join("/"),

  paths: {
    ace: "js/components/ace-builds/src"
  }
});


require(["ace/ace"], function (ace) {
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
});

// requirejs(['../bower_components/ace-builds/src/ace'], function() {
//   console.log('done');
//   // var editor = ace.edit("editor");
//   //     editor.setTheme("ace/theme/monokai");
//   //     editor.getSession().setMode("ace/mode/javascript");
// })