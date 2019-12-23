var http = require('http'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    queryString = require('query-string'),
    google = require('googleapis'),
    val = require('express-validator'),
    crypto = require('crypto'),
    port = process.env.PORT || 3000;

let team_times = {}
let team_scores = {}
let nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
let answers = {
  '1': process.env.PUZZLE_ANS_1, 
  '2': process.env.PUZZLE_ANS_2, 
  '3': process.env.PUZZLE_ANS_3, 
  '4': process.env.PUZZLE_ANS_4, 
  '5': process.env.PUZZLE_ANS_5, 
  '6': process.env.PUZZLE_ANS_6, 
  '7': process.env.PUZZLE_ANS_7, 
  '8': process.env.PUZZLE_ANS_8, 
  '9': process.env.PUZZLE_ANS_9, 
  '10': process.env.PUZZLE_ANS_10, 
  '11': process.env.PUZZLE_ANS_11, 
  '12': process.env.PUZZLE_ANS_12, 
  '13': process.env.PUZZLE_ANS_13, 
  '14': process.env.PUZZLE_ANS_14, 
  '15': process.env.PUZZLE_ANS_15, 
}
const admin = require('firebase-admin');

let serviceAccount = require('./credentials.json');

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp();
}

let db = admin.firestore();

var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/assets", express.static(__dirname+"/assets"));
app.use("/images", express.static(__dirname+"/images"));


app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/team', function(req, res){
  res.sendFile(path.join(__dirname, 'team.html'));
})

app.get('/puzzle', function(req, res){
  let num = req.query.num;
  switch(num) {
    case '1':
      res.sendFile(path.join(__dirname, 'puzzle1.html'));
      break;
    case '2':
      res.sendFile(path.join(__dirname, 'puzzle2.html'));
      break;
    case '3':
      res.sendFile(path.join(__dirname, 'puzzle3.html'));
      break;
    case '4':
      res.sendFile(path.join(__dirname, 'puzzle4.html'));
      break;
    case '5':
      res.sendFile(path.join(__dirname, 'puzzle5.html'));
      break;
    case '6':
      res.sendFile(path.join(__dirname, 'puzzle6.html'));
      break;
    case '7':
      res.sendFile(path.join(__dirname, 'puzzle7.html'));
      break;
    case '8':
      res.sendFile(path.join(__dirname, 'puzzle8.html'));
      break;
    case '9':
      res.sendFile(path.join(__dirname, 'puzzle9.html'));
      break;
    case '10':
      res.sendFile(path.join(__dirname, 'puzzle10.html'));
      break;
    case '11':
      res.sendFile(path.join(__dirname, 'puzzle11.html'));
      break;
    case '12':
      res.sendFile(path.join(__dirname, 'puzzle12.html'));
      break;
    case '13':
      res.sendFile(path.join(__dirname, 'puzzle13.html'));
      break;
    case '14':
      res.sendFile(path.join(__dirname, 'puzzle14.html'));
      break;
    case '15':
      res.sendFile(path.join(__dirname, 'puzzle15.html'));
      break;
    default:
      res.sendFile(path.join(__dirname, 'puzzle.html'));
  }
})

app.get('/404', function(req, res){
  res.sendFile(path.join(__dirname, '404.html'));
})

app.post('/signup', function(req, res) {
  let userref = db.collection('users').doc(req.body.uid);
  userref.get().then(doc => {
    if (!doc.exists) {
      var data = {
        uid: req.body.uid,
        email: req.body.email,
        team: "",
        team_leader: false
      }
      db.collection('users').doc(req.body.uid).set(data).then(ref => {
        console.log('Added document with ID: ', req.body.uid);
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(500);
    }
  }).catch(function(error) {
    // Handle Errors here.
    console.log(error)
  });
})

app.post('/login', function(req, res) {
  let userref = db.collection('users').doc(req.body.uid);
  userref.get().then(doc => {
    if (!doc.exists) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  }).catch(function(error) {
    // Handle Errors here.
    console.log(error)
  });
})

app.post('/createTeam', function(req, res) {
  var secretkey = crypto.randomBytes(16).toString('hex');
  req.body.teamname = req.body.teamname.toLowerCase().trim();
  console.log(req.body.teamname)
  let teamref = db.collection('teams').doc(req.body.teamname);
  teamref.get().then(doc => {
    if (!doc.exists) {
      var data = {
        name: req.body.teamname,
        members: [req.body.uid],
        secretkey: secretkey
      }
      console.log(data)
      db.collection('teams').doc(req.body.teamname).set(
        data
      ).then(ref1 => {
        db.collection('users').doc(req.body.uid).get().then(userdoc => {
          var userdata = userdoc.data()
          userdata["team"] = req.body.teamname;
          userdata["team_leader"]= true;
          console.log(userdata)
          db.collection('users').doc(req.body.uid).set(
            userdata
          ).then(ref2 => {
            //console.log('Added document with ID: ', req.body.teamname);
            res.send({
              team: req.body.teamname,
              team_leader: true,
              secretkey: secretkey
            });
            team_times[req.body.teamname] = 0;
            team_scores[req.body.teamname] = new Set();
          })
        }).catch(function(error) {
          // Handle Errors here.
          console.log(error)
        });
      });
    } else {
      res.sendStatus(500);
      return;
    }
  }).catch(function(error) {
    // Handle Errors here.
    console.log(error)
  });
})

app.post('/getTeam', function(req, res) {
  db.collection('users').doc(req.body.uid).get().then(userdoc => {
    if (userdoc.exists) {
      let teamname = userdoc.data().team;
      if (teamname == "") {
        res.sendStatus(500);
        return;
      }
      let teamref = db.collection('teams').doc(teamname);
      teamref.get().then(doc => {
        if (doc.exists) {
          var members = doc.data().members;
          db.collection('users').where('uid', 'in', members).get().then(function(querySnapshot) {
            var emails = [];
            querySnapshot.forEach(function(memberdoc) {
              //console.log(memberdoc.data().uid, ' => ', doc.data());
              emails.push(memberdoc.data().email);
            });
            let userdata = userdoc.data();
            userdata['emails'] = emails;
            userdata['secretkey'] = doc.data().secretkey;
            res.send(userdata);
          })
        } else {
          res.sendStatus(500);
          return;
        }
      }).catch(function(error) {
        // Handle Errors here.
        console.log(error)
        res.sendStatus(500);
        return;
      });
    } else {
      res.sendStatus(500);
      return;
    }
  }).catch(function(error) {
    // Handle Errors here.
    console.log(error)
  })
})

app.post('/joinTeam', function(req, res) {
  req.body.teamname = req.body.teamname.toLowerCase().trim();
  req.body.secretkey = req.body.secretkey.trim();
  let teamref = db.collection('teams').doc(req.body.teamname);
  db.collection('users').doc(req.body.uid).get().then(udoc => {
    if (udoc.data().team != '') {
      res.send(500);
    } else {
      teamref.get().then(doc => {
        if (doc.exists && doc.data().secretkey === req.body.secretkey && doc.data().members.length < 4) {
          let teamdata = doc.data();
          teamdata['members'].push(req.body.uid);
          db.collection('teams').doc(req.body.teamname).set(teamdata).then(ref => {
            db.collection('users').doc(req.body.uid).get().then(userdoc => {
              let userdata = userdoc.data();
              userdata['team'] = doc.data().name;
              db.collection('users').doc(req.body.uid).set(userdata).then(userdoc => {
                res.send(userdata);
              })
            })
          }).catch(function(error) {
            // Handle Errors here.
            console.log(error)
          });    
        } else {
          res.sendStatus(500);
        }
      }).catch(function(error) {
        // Handle Errors here.
        console.log(error)
      });
    }
  })
})

app.post('/quitTeam', function(req, res) {
  db.collection('users').doc(req.body.uid).get().then(userdoc => {
    let userdata = userdoc.data();
    if (userdata.team_leader) {
      db.collection('teams').doc(req.body.teamname).get().then(teamdoc => {
        let members = teamdoc.data().members;
        db.collection('users').where('uid', 'in', members).get().then(function(querySnapshot) {
          querySnapshot.forEach(function(memberdoc) {
            let uid = memberdoc.data().uid;
            db.collection('users').doc(uid).get().then(userdoc2 => {
              let userdata = userdoc2.data();
              userdata['team'] = ""
              userdata['team_leader'] = false
              db.collection('users').doc(uid).set(userdata);
            });
          });
          db.collection('teams').doc(req.body.teamname).delete();
          delete team_scores[req.body.teamname];
          delete team_times[req.body.teamname];
          res.sendStatus(200);
        });
      })
    } else {
      db.collection('teams').doc(req.body.teamname).get().then(teamdoc => {
        let teamdata = teamdoc.data();
        let members = teamdata.members;
        members.splice( members.indexOf(req.body.uid), 1 );
        teamdata['members'] = members;
        db.collection('teams').doc(req.body.teamname).set(teamdata).then(ref => {
          db.collection('users').doc(req.body.uid).get().then(userdoc => {
            let userdata = userdoc.data();
            userdata['team'] = ""
            userdata['team_leader'] = false
            db.collection('users').doc(req.body.uid).set(userdata).then(userdoc => {
              res.sendStatus(200);
            })
          })
        })
      })
    }
  })
})

app.post('/verifyDone', function(req,res) {
  if (!(req.body.team in team_scores)) {
    team_scores[req.body.team] = new Set();
    res.sendStatus(500);
  } else {
    if (team_scores[req.body.team].has(req.body.num)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  }
});

app.post('/verifyAllDone', function(req,res) {
  if (!(req.body.team in team_scores)) {
    team_scores[req.body.team] = new Set();
    res.sendStatus(500);
  } else {
    res.send({done:Array.from(team_scores[req.body.team])})
  }
});


app.post('/verify', function(req,res) {
  req.body.ans = req.body.ans.toLowerCase().trim();
  if (!(req.body.team in team_scores)) {
    team_scores[req.body.team] = new Set();
  }

  if (req.body.num in nums){
    let now = Date.now();
    if (req.body.team in team_times) {
      if (team_times[req.body.team] + 2000 < now) {
        if (req.body.ans == answers[req.body.num]) {
          team_scores[req.body.team].add(req.body.num)
          res.sendStatus(200);
        } else {
          res.status(400).send({
             message: 'wrong'
          });
          team_times[req.body.team] = now;
        }
      } else {
        res.status(400).send({
          message: 'fast'
        });
      }
    } else {
      res.status(400).send({
         message: 'wrong'
      });
      team_times[req.body.team] = now;
    }
  } else {
    res.status(400).send({
      message: 'server error'
    });
    team_times[req.body.team] = now;
  }
})

var server = http.createServer(app);

server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');
