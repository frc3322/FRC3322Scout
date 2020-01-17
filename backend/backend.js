let mongoose = require('mongoose');
let express = require('express');
let RobotMatchModel = require("./RobotMatchModel");
let app = express();
let bodyParser = require('body-parser');
let http = require('http');
let cors = require('cors');
let server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());

// Connect to database.
mongoose.connect("mongodb://localhost:27017/scout").then(()=>{
    console.log("Connected")
    })
    .catch((error)=>{
        console.log("Not connected. Error: " + error);
    });


/*
{
        matchNumber: incJson.matchNumber,
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

function findTeamByMatchNumber(teamNumber, matchNumber) {
    return RobotMatchModel.find({'robot.teamNumber': teamNumber, matchNumber: matchNumber});
}

function findTeamsInMatch(matchNumber) {
    return RobotMatchModel.find({matchNumber: matchNumber});
}

function findTeamMatches(teamNumber) {
    return RobotMatchModel.find({'robot.teamNumber': teamNumber});
}


function updateTeam(matchJson, callback) {
    RobotMatchModel.findOneAndUpdate({
        matchNumber: matchJson.matchNumber,
        'robot.teamNumber': matchJson.robot.teamNumber
    }, matchJson, {upsert: true}, err => {
        callback(err)
    });
}


app.get('/', (req, res) => {
    createRecord(
        {
            matchNumber: 1,
            won: true,
            robot: {
                teamNumber: 6429,
                allianceColor: "red",
                allianceNumber: 1
            },
            stats: {
                auto: {
                    moved: Math.random() > 0.5,
                    scoredBottom: Math.floor(Math.random() * 10),
                    scoredOuter: Math.floor(Math.random() * 10),
                    scoredInner: Math.floor(Math.random() * 10)
                },
                teleop: {
                    scoredBottom: Math.floor(Math.random() * 10),
                    scoredOuter: Math.floor(Math.random() * 10),
                    scoredInner: Math.floor(Math.random() * 10),
                    rotationControl: Math.random() > .5,
                    positionControl: Math.random() > .5
                },
                endgame: {
                    didClimb: Math.random() > .5,
                    didPark: Math.random() > .5
                }
            }
        }
    )
    console.log("I did stuff!");
    res.send("I did the function!");
});

app.get('/getteaminmatch/:teamNumber/:matchNumber', (req, res)=>{
        findTeamByMatchNumber(req.params.teamNumber, req.params.matchNumber).then(doc => res.send(doc));
});

app.get('/getallteamsinmatch/:matchNumber', (req, res)=>{
    findTeamsInMatch(req.params.matchNumber).then(doc => res.send(doc));
});

app.get('/getteamstats/:teamNumber', (req, res)=>{
    findTeamMatches(req.params.teamNumber).then(doc => res.send(doc));
});

app.get('/getallscoutentries/:skip', (req, res) => {
    //TODO Implement Search By Last ID instead. The .skip method won't scale.
    let searchParams = {}
    if (req.query.teamNumber !== '') {
        searchParams['robot.teamNumber'] = req.query.teamNumber;
    }
    if (req.query.matchNumber !== '') {
        searchParams['matchNumber'] = req.query.matchNumber;
    }
    console.log(searchParams);
    
    let query = (!req.params.skip.isNaN) ? RobotMatchModel.find(searchParams).limit(10).skip(parseInt(req.params.skip)) : RobotMatchModel.find(searchParams).limit(10);
    
    return query.then(doc => res.send(doc)).catch(err=>console.log(err));
});

server.listen(8080);