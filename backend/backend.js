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

scoutMatches.doc({thing: }).set({
    hi: "jonathan"
});



/*
{
        matchNumber: `i`ncJson.matchNumber,
        won: incJson.won,
        robot: {
            teamNumber: incJson.robot.teamNumber,
            allianceColor: incJson.robot.allianceColor,
            allianceNumber: incJson.robot.allianceNumber
        },
        stats: {
            auto: {},
            teleop: {testStat: Math.floor(Math.random() * 10)},
            endgame: {testStat: Math.floor(Math.random() * 10)}
        }
    }
*/


function createRecord(incJson) {
    new RobotMatchModel(incJson).save().catch(() => {
        console.log("Something went wrong while saving. Possible duplicate?")
    });
}

function updateTeam(query, stats) {
    return new Promise ((resolve, reject) => {
        RobotMatchModel.findOneAndUpdate(query, {"$set": {stats}}, (err, doc) => {(err) ? reject(err) : resolve(doc)});
    });
}

app.get('/create-match/:matchNumber', (req, res) => {
    createRecord(
        {
            matchNumber: req.params.matchNumber,
            won: true,
            robot: {
                teamNumber: 6429,
                allianceColor: "red",
                allianceNumber: 1
            },
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
    let searchParams = {}
    if (req.query.teamNumber !== '' && req.query.teamNumber !== undefined) {
        searchParams['robot.teamNumber'] = req.query.teamNumber;
    }
    if (req.query.matchNumber !== '' && req.query.matchNumber !== undefined) {
        searchParams['matchNumber'] = req.query.matchNumber;
    }
    
    let query = (!req.params.skip.isNaN) ? RobotMatchModel.find(searchParams).limit(10).skip(parseInt(req.params.skip)) : RobotMatchModel.find(searchParams).limit(10);
    
    return query.then(doc => res.send(doc)).catch(err=>console.log(err));
});

function populateMatches(eventKey) {
    axios.get("https://www.thebluealliance.com/api/v3/event//matches/simple", {"X-TBA-Auth-Key": "84zuY6dS8oOnAyKc09C59oxVfuOwscn6Ak6EXrChraCjY6DNmdFgJOSXX0lLBfMd"})
}

app.post('/updateteam', (req, res) => {
    let { matchNumber, teamNumber, stats } = req.body;
    let query = {matchNumber, "robot.teamNumber": teamNumber};
    updateTeam(query, stats).then(()=>res.sendStatus(200)).catch(()=>res.send(400));
});

server.listen(8080);