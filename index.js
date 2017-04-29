let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
// app.get('/', function(req, res) {
//   res.send('success')
// });

app.post('/upload', function(req, res) {
  console.log(req.body.paste);
  res.status(200).send('payload recieved')
});

app.listen(3000);