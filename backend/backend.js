let Statistic = require('./Statistic');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http');
let server = http.createServer(app);
let axios = require('axios');
let admin = require("firebase-admin");
let cors = require('cors');

app.use(bodyParser.json());
app.use(cors());


// Fetch the service account key JSON file contents
var serviceAccount = require("./firebasekey.json");

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
            teleop: {testStat: 0},
            endgame: {testStat: 0}
        }
    }
*/


function createRecord(incJson) {
    scoutMatches.doc("t"+incJson.teamNumber+"m"+incJson.matchNumber).set(JSON.parse(JSON.stringify(incJson)));
}

app.post('/create-match/', (req, res) => {
    if (req.body.teamNumber != undefined &&  parseInt(req.body.teamNumber) != NaN && req.body.teamNumber != undefined && parseInt(req.body.matchNumber) != NaN) {
    createRecord(
        {
            matchNumber: parseInt(req.body.matchNumber),
            won: false,
            teamNumber: parseInt(req.body.teamNumber),
            allianceColor: req.body.allianceColor,
            allianceNumber: req.body.allianceNumber,
            stats: {
                auto: [
                    new Statistic("Moved", false, 'O'),
                    new Statistic("Scored Bottom", 0, "L"),
                    new Statistic("Scored Outer", 0, "L"),
                    new Statistic("Scored Inner", 0, "L"),
                    new Statistic("Balls Missed", 0, "L")

                ],
                teleop: [
                    new Statistic("Scored Bottom", 0, "L"),
                    new Statistic("Scored Outer", 0, "L"),
                    new Statistic("Scored Inner", 0, "L"),
                    new Statistic("Balls Missed", 0, "L"),
                    new Statistic("Attempted Rotation Control", false, "O"),
                    new Statistic("Got Rotation Point", false, "O"),
                    new Statistic("Attempted Position Control", false, "O"),
                    new Statistic("Got Position Point", false, "O")

                ],
                endgame: [
                    new Statistic("Did Climb", false, "O"),
                    new Statistic("Did Park", false, "O"),
                    new Statistic("Broke Down", false, "O"),
                    new Statistic("Defense", false, "O"),
                    new Statistic("Foul", false, "O"),
                    new Statistic("Comment", "", "C")
                ]
            }
        }
    )
    console.log("I did stuff!");
    res.send("I did the function!");
    }
});

app.get('/getallscoutentries/:skip', (req, res) => {
    let search = scoutMatches;
    if (parseInt(req.query.teamNumber) != NaN && req.query.teamNumber != 0 && req.query.teamNumber != undefined) {
        search = search.where('teamNumber', '==', parseInt(req.query.teamNumber));
    }
    if (parseInt(req.query.matchNumber) != NaN && req.query.matchNumber != 0 && req.query.matchNumber != undefined) {
        search = search.where('matchNumber', '==', parseInt(req.query.matchNumber));
    }
    search.get().then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
        let results = [];
        snapshot.forEach(doc => {
            results.push(doc.data());
        });
        res.send(results);
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
    scoutMatches.doc('t'+teamNumber+'m'+matchNumber).update({stats}).then(()=>res.sendStatus(200));
});

server.listen(8080);