var http = require('http'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    queryString = require('query-string'),
    google = require('googleapis'),
    val = require('express-validator'),
    port = process.env.PORT || 3000;

const admin = require('firebase-admin');

let serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/login', function(req, res) {
 	  console.log(req.body.email)
  	return res.redirect('team.html'); 
})

app.post('/signup', function(req, res) {
 	console.log(req.body.email)

 	return res.redirect('team.html');
})

var server = http.createServer(app);

server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');
