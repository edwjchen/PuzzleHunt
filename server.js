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
let team_pass = {}
let team_ans_time = {}
let team_data = {}
let leaderboard = []
let lastLeaderboard = Date.now()
let nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
let passcode = "beta"

let answers = {
  '1': 'respawn', 
  '2': 'barrel', 
  '3': 'dialga', 
  '4': 'answer', 
  '5': 'answer', 
  '6': 'answer', 
  '7': 'answer', 
  '8': 'answer', 
  '9': 'answer', 
  '10': 'answer', 
  '11': 'konami', 
  '12': 'answer', 
  '13': 'answer', 
  '14': 'answer', 
  '15': 'answer', 
}

//konami in morse
let konami = [
  "\t \t",
  "\t\t\t",
  "\t ",
  " \t",
  "\t\t",
  "  "
]

//space invaders
let waves = [
  [[3,4], [4,4], [5,4], [6,4], [7,4], [5,3], [5,2], [5,1], [5,0]],
  [[3,4], [4,4], [5,4], [6,4], [7,4], [5,3], [5,2], [5,1], [3,0], [4,0], [5,0], [6,0], [7,0]],
  [[3,4], [3,3], [3,2], [3,1], [3,0], [4,0], [5,0], [6,0], [7,0]],
  [[3,4], [4,4], [5,4], [6,4], [7,4], [5,3], [5,2], [5,1], [5,0]],
]

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

async function updateTeams() {
  const snapshot = await db.collection('teams').get().catch(function(error) {
    // Handle Errors here.
    console.log(error)
  });
  snapshot.forEach(function(doc) {
    let teamname = doc.data().name;
    if (!(teamname in team_times)) {
      team_times[teamname] = 0;
    }
    if (!(teamname in team_scores)) {
      team_scores[teamname] = new Set();
    }
    if (!(teamname in team_ans_time)) {
      team_ans_time[teamname] = 0;
    }
  });
}

function updateLeaderboard() {
  teams = []
  for (let [key, value] of Object.entries(team_scores)) {
    if (!team_ans_time[key]) team_ans_time[key] = 0;
    teams.push([key, value.size, team_ans_time[key], Array.from(team_scores[key])])
  }

  teams.sort( function( a, b )
  {
    if ( a[2] == b[2] ) return 0;
    return a[2] < b[2] ? -1 : 1;
  });
  
  teams.sort( function( a, b )
  {
    if ( a[1] == b[1] ) return 0;
    return a[1] > b[1] ? -1 : 1;
  });

  leaderboard = teams;
}

updateTeams().then(() => {
  updateLeaderboard();
});


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

app.get('/leaderboard', function(req, res){
  res.sendFile(path.join(__dirname, 'leaderboard.html'));
})

app.get('/getLeaderboard', function(req, res){
  if (lastLeaderboard + 60*1000 < Date.now()) {
    updateLeaderboard();
  }
  res.send({lb:leaderboard})
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
          //console.log(userdata)
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
            team_ans_time[req.body.teamname] = 0;
            team_data[req.body.team] = [0]
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

      if (!(teamname in team_times) || !(teamname in team_scores)) {
        team_times[teamname] = 0;
        team_scores[teamname] = new Set();
        team_ans_time[req.body.teamname] = 0;
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

app.post('/passcode', function(req, res) {
  if (req.body.teamname) {
    req.body.teamname = req.body.teamname.toLowerCase().trim();
  }
  if (req.body.pc) {
    req.body.pc = req.body.pc.toLowerCase().trim();
  }

  if (req.body.teamname in team_pass) {
    res.status(200).send({
      message: 'good'
    });
    return;
  }

  if (req.body.pc === passcode) {
    res.status(200).send({
      message: 'good'
    });
    team_pass[req.body.teamname] = true;
  } else if (!req.body.pc) {
    res.status(200).send({
      message: 'no passcode'
    });
  } else {
    res.status(200).send({
      message: 'bad passcode'
    });
  }
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
          delete team_ans_time[req.body.teamname];
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
    res.status(200).send({
      message: 'team'
    });
  } else {
    if (team_scores[req.body.team].has(req.body.num)) {
      res.status(200).send({
        message: 'good'
      });
    } else {
      res.status(200).send({
        message: 'unfinished'
      });
    }
  }
});

app.post('/verifyAllDone', function(req,res) {
  if (!(req.body.team in team_scores)) {
    team_scores[req.body.team] = new Set();
    res.status(200).send({
      message: 'team'
    });
  } else {
    res.status(200).send({done:Array.from(team_scores[req.body.team])})
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
          team_times[req.body.team] = now;
          team_ans_time[req.body.team] = now;
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

app.post('/runcode', function(req,res) {
  if (!(req.body.team in team_data)) {
    team_data[req.body.team] = [0,0]
  }

  if (!(req.body.team in team_scores)) {
    team_scores[req.body.team] = new Set();
  }

  if (req.body.num in nums){
    let now = Date.now();
    if (req.body.team in team_times) {
      if (team_times[req.body.team] + 2000 < now) {
        let content = req.body.ans.split("\n");
        for (var i = 3; i < content.length; i++) {
          if (i-3 < konami.length) {
            for (var j = 0; j < konami[i-3].length; j++) {
              if (konami[i-3].charAt(j) != content[i].charAt(j)) {
                team_data[req.body.team][0]++
                if (konami[i-3].charAt(j) === '\t') {
                  res.status(200).send({
                    message: team_data[req.body.team][0] + '. MissingTabError: inconsistent use of tabs and spaces in indentation on line '+(i+1)
                  });
                  team_times[req.body.team] = now;
                  return;
                } else {
                  res.status(200).send({
                    message: team_data[req.body.team][0] + '. MissingSpaceError: inconsistent use of tabs and spaces in indentation on line '+(i+1)
                  });
                  team_times[req.body.team] = now;
                  return;
                }
              }
            }
          } else {
            break;
          }
        }
        if (content.length - 3 < konami.length) {
          let i = content.length - 3
          if (konami[i].charAt(0) === '\t') {
            res.status(200).send({
              message: 'TabError: inconsistent use of tabs and spaces in indentation on line '+(i+4)
            });
            team_times[req.body.team] = now;
            return;
          } else {
            res.status(200).send({
              message: 'SpaceError: inconsistent use of tabs and spaces in indentation on line '+(i+4)
            });
            team_times[req.body.team] = now;
            return;
          }
        }
        res.status(200).send({
          message: ':thinking:'
        });
        team_times[req.body.team] = now;
        return;
      } else {
        res.status(200).send({
          message: 'fast'
        });
      }
    }
  } else {
    res.status(400).send({
      message: 'server error'
    });
    team_times[req.body.team] = now;
  }
})

app.post('/setupFormation', function(req,res) {
  if (!(req.body.team in team_data)) {
    team_data[req.body.team] = [0,0]
  }

  if (!(req.body.team in team_scores)) {
    team_scores[req.body.team] = new Set();
  }

  res.status(200).send({
    message: waves[parseInt(req.body.wave)-1]
  });
})

app.use('*', function(req, res) {
  return res.status(404).sendFile(path.join(__dirname, '404.html'));
});

var server = http.createServer(app);

server.listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');
