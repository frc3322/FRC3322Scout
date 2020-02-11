let Statistic = require('./Statistic');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http');
let server = http.createServer(app);
let axios = require('axios');
let admin = require("firebase-admin");

app.use(bodyParser.json());



// Fetch the service account key JSON file contents
var serviceAccount = require("./scout-93855-firebase-adminsdk-nnjjl-9d3e23cd5a.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const scoutMatches = db.collection('scoutmatches');

/*
{
        matchNumber: `i`ncJson.matchNumber,
        won: incJson.won,
        robot: {
            teamNumber: incJson.teamNumber,
            allianceColor: incJson.allianceColor,
            allianceNumber: incJson.allianceNumber
        },
        stats: {
            auto: {},
            teleop: {testStat: Math.floor(Math.random() * 10)},
            endgame: {testStat: Math.floor(Math.random() * 10)}
        }
    }
*/


function createRecord(incJson) {
    scoutMatches.doc("t"+incJson.teamNumber+"m"+incJson.matchNumber).set(JSON.parse(JSON.stringify(incJson)));
}

app.get('/create-match/:matchNumber', (req, res) => {
    createRecord(
        {
            matchNumber: req.params.matchNumber,
            won: true,
            teamNumber: 6429,
            allianceColor: "red",
            allianceNumber: 1,
            stats: {
                auto: [
                    new Statistic("Moved", Math.random() > .5, 'O'),
                    new Statistic("Scored Bottom", Math.floor(Math.random() * 10), "L"),
                    new Statistic("Scored Outer", Math.floor(Math.random() * 10), "L"),
                    new Statistic("Scored Inner", Math.floor(Math.random() * 10), "L")
                ],
                teleop: [
                    new Statistic("Scored Bottom", Math.floor(Math.random() * 10), "L"),
                    new Statistic("Scored Outer", Math.floor(Math.random() * 10), "L"),
                    new Statistic("Scored Inner", Math.floor(Math.random() * 10), "L"),
                    new Statistic("Rotation Control", Math.random() > .5, "O"),
                    new Statistic("Position Control", Math.random() > .5, "O")
                ],
                endgame: [
                    new Statistic("Did Climb", Math.random() > .5, "O"),
                    new Statistic("Did Park", Math.random() > .5, "O")
                ]
            }
        }
    )
    console.log("I did stuff!");
    res.send("I did the function!");
});

app.get('/getallscoutentries/:skip', (req, res) => {
    //TODO Implement Search By Last ID instead. The .skip method won't scale.
    let search = scoutMatches;
    if (Number.isInteger(req.query.teamNumber)) {
        search = search.where('teamNumber', '==', req.query.teamNumber);
    }
    if (Number.isInteger(req.query.matchNumber)) {
        search = search.where('matchNumber', '==', req.query.matchNumber);
    }
    search.get().then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
    
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    
        });

function populateMatches(eventKey) {
    axios.get("https://www.thebluealliance.com/api/v3/event//matches/simple", {"X-TBA-Auth-Key": "84zuY6dS8oOnAyKc09C59oxVfuOwscn6Ak6EXrChraCjY6DNmdFgJOSXX0lLBfMd"})
}

app.post('/updateteam', (req, res) => {
    let { matchNumber, teamNumber, stats } = req.body;
    let query = {matchNumber, "teamNumber": teamNumber};
    updateTeam(query, stats).then(()=>res.sendStatus(200)).catch(()=>res.send(400));
});

server.listen(8080);