let Statistic = require('./Statistic');
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

server.listen(8080);