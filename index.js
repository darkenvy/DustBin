require('dotenv').config();
let express    = require('express'),
    bodyParser = require('body-parser'),
    fs         = require('fs'),
    https      = require('https'),
    db         = require('./models'),
    Hashids    = require('hashids'),
    hashids    = new Hashids(process.env.TABLE_ID_HASH),
    app        = express(),
    pastePath  = __dirname + '/raw_pastes/';

app.use(express.static('views/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));

app.get('/', (req, res) => {
  res.render('partials/create-paste');
});

app.get('/:pasteID', function(req, res) {
  res.render('partials/load-paste');
});

app.get('/:pasteID/:key', function(req, res) {
  res.render('partials/load-paste');
});

app.unlock('/verify', function(req, res) {
  let pasteID = hashids.decode(req.body.pasteID)[0];
  db.paste.find({
    where: {id: pasteID}
  })
  .catch(error => res.status(500).send('error: ' + error))
  .then(paste => {
    console.log('here ', req.body);
    if (paste.hash === req.body.hash) {
      let path = pastePath + paste.id + '.txt';
      let readFileCB = function(err, data) {
        if (err) console.log(err);
        res.status(200).send(data);
      }
      fs.readFile(path, readFileCB);
    } else {
      res.status(401).send('Public Key does not match');
    }
  });
});

app.post('/upload', (req, res) => {
  db.paste.create({
    hash: req.body.publicKey,
    expire: parseInt(new Date().valueOf() / 1000 + 30*24*60*60) // 1 month later
  })
  .catch(error => res.status(500).send('A Database Error Has Occured: ' + error))
  .then(paste => {
    let path = pastePath + paste.id + '.txt';
    let writeFileCB = err => {
      if (err) console.log(err);
      res.status(200).send('https://encrypto.us/' + hashids.encode(paste.id));
    }
    fs.writeFile(path, req.body.encPaste, writeFileCB);
  });
});

// Development Hosting
// console.log('Listening on port 3000');
// app.listen(3000)

// SSL Hosting
let privateKey  = fs.readFileSync('../certs/privkey.pem', 'utf8');
let certificate = fs.readFileSync('../certs/cert.pem', 'utf8');
let credentials = {key: privateKey, cert: certificate};

let httpsServer = https.createServer(credentials, app);
let http = express.createServer();
http.get('*',function(req,res){  
  res.redirect('https://encrypto.us/')
})

httpsServer.listen(8443);
httpServer.listen(8080);