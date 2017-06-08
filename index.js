require('dotenv').config();
let express    = require('express'),
    bodyParser = require('body-parser'),
    fs         = require('fs'),
    https      = require('https'),
    db         = require('./models'),
    Hashids    = require('hashids'),
    hashids    = new Hashids(process.env.TABLE_ID_HASH),
    app        = express(),
    RateLimit  = require('express-rate-limit'),
    pastePath  = __dirname + '/raw_pastes/';

let apiLimiter = new RateLimit({
  windowMs: 10*60*1000, // 1 minute(s) 
  max: 5,
  // delayAfter: 2,
  delayMs: 0 // 3000
});

// app.use('/test', apiLimiter, ()=>console.log('middleware hit'));
app.use(express.static('views/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');

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
  })
  .catch(error => res.status(500).send('error: ' + error))
});

app.post('/upload', apiLimiter, (req, res) => {
  db.paste.create({
    hash: req.body.publicKey,
    expire: parseInt(new Date().valueOf() / 1000 + 30*24*60*60) // 1 month later
  })
  .then(paste => {
    let path = pastePath + paste.id + '.txt';
    let writeFileCB = err => {
      if (err) console.log(err);
      res.status(200).send('https://encrypto.us/' + hashids.encode(paste.id));
    }
    fs.writeFile(path, req.body.encPaste, writeFileCB);
  })
  .catch(error => res.status(500).send('A Database Error Has Occured: ' + error))
});

// Launch Environment
if (process.env.ENVIRONMENT === "DEV") {
  // Development Hosting
  console.log('Listening on port 3000 in Dev Environement');
  app.listen(3000)
} else {
  // SSL Hosting
  let privateKey  = fs.readFileSync('../certs/privkey.pem', 'utf8');
  let certificate = fs.readFileSync('../certs/cert.pem', 'utf8');
  let credentials = {key: privateKey, cert: certificate};

  let httpsServer = https.createServer(credentials, app);
  let http = express();
  http.get('*', (req,res) => res.redirect('https://encrypto.us/'));

  console.log('Hosting on port 80 & 443 on Production Environment');
  httpsServer.listen(8443);
  http.listen(8080);
}

