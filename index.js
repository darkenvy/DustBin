require('dotenv').config();
let express    = require('express'),
    bodyParser = require('body-parser'),
    fs         = require('fs'),
    db         = require('./models'),
    Hashids    = require('hashids'),
    hashids    = new Hashids(process.env.TABLE_ID_HASH),
    app        = express(),
    pastePath  = __dirname + '/raw_pastes/';

app.use(express.static('views/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));

// Test Paste:
// #5 /pw
// pub: f0982c109e6aef0ca15c27043de58d149e2506a7
// priv: f5acf870a48467a5ed6228c6b52c14167ec13c80

// #10 /rv
// private:  f28d759399c13cee0852517bc146fd9108408d01
// public:  71a746a232fd5d672c2d9586d1715b784e61b763

app.get('/', (req, res) => {
  res.render('partials/create-paste');
});

app.get('/:pasteID', function(req, res) {
  res.render('partials/load-paste');
});

app.get('/:pasteID/:key', function(req, res) {
  res.render('partials/load-paste');
  // res.send(JSON.stringify(req.params))
});

app.unlock('/verify', function(req, res) {
  // monkey-patch for testing. Since Postman doesnt support body in UNLOCK
  // req.body = {
  //   hash: 'f0982c109e6aef0ca15c27043de58d149e2506a7', 
  //   pasteID: 'pw'
  // }
  // console.log(req.body);
  let pasteID = hashids.decode(req.body.pasteID)[0];
  console.log(pasteID);

  db.paste.find({
    where: {id: pasteID}
  })
  .catch(error => res.status(500).send('error: ' + error))
  .then(paste => {
    console.log('here ', req.body);
    if (paste.hash === req.body.hash) {
      let path = pastePath + paste.id + '.txt';
      let readFileCB = (err, data) => {
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
      res.status(200).send('localhost:3000/' + hashids.encode(paste.id));
    }
    fs.writeFile(path, req.body.encPaste, writeFileCB);
  });
});

app.listen(3000);