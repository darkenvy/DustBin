$('#submit').click(function() {
  $.ajax({
    type: 'UNLOCK',
    url: '/verify',
    data: {
      hash: $('#key').val(), 
      pasteID: document.location.pathname.slice(1)
    },
    success: function(data, statusCode){ // jshint ignore:line
      console.log(data);
    },
    error: function(xhr, statusCode, error) {console.log('error')} // jshint ignore:line
  });
});