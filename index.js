let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let app = express();
let pastePath = __dirname + '/pastes/';

app.use(express.static('views/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');



// app.get('/:pasteID', function(req, res) {
//   res.render('requestKey');
// });

// app.unlock('/verify', function(req, res) {
//   res.send(req.body)
// });

// app.get('/:pasteID/:key', function(req, res) {
//   res.send(JSON.stringify(req.params))
// });

app.post('/upload', function(req, res) {
  console.log(req.body.paste);
  fs.writeFile(pastePath + '1.txt', req.body.paste, err => {
    if (err) console.log(err);
    res.status(200).send('payload recieved')
  });
});

app.listen(3000);