let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(express.static('views/public'));
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/:pasteID', function(req, res) {
  res.send(req.params)
});

app.get('/:pasteID/:key', function(req, res) {
  res.send(req.params)
});

app.post('/upload', function(req, res) {
  console.log(req.body.paste);
  res.status(200).send('payload recieved')
});

app.listen(3000);