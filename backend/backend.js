let mongoose = require('mongoose');
let RobotMatchModel = require("./RobotMatchModel");
mongoose.connect("mongodb+srv://rouser:nbBvbtUDROLXc6ib@cluster0-1kgz4.mongodb.net/test?retryWrites=true&w=majority").then(()=>{
    console.log("Connected")
    })
    .catch((error)=>{
        console.log("Not connected. Error: " + error);
    });




function createRecord(incJson) {
    new RobotMatchModel({
        matchNumber: incJson.matchNumber,
        robot: {
            teamNumber: incJson.robot.teamNumber,
            allianceColor: incJson.robot.allianceColor,
            allianceNumber: incJson.robot.allianceNumber
        }
    }).save().catch(() => {
        console.log("Something went wrong while saving. Possible duplicate?")
    });
}

function findTeamByMatchNumber(teamNumber, matchNumber) {
    RobotMatchModel.find({'robot.teamNumber': teamNumber, matchNumber: matchNumber}).then(found=>{console.log(found)});
}

function findTeamsInMatch(matchNumber) {
    RobotMatchModel.find({matchNumber: matchNumber}).then(found=>{console.log(found)});
}

function updateTeam(jsonFile) {
    RobotMatchModel.findOneAndUpdate({matchNumber: jsonFile.matchNumber, 'robot.teamNumber': jsonFile.robot.teamNumber}, jsonFile, {upsert: true}, (err) => {
        if (err) console.log("Error updating record." + err);
    });
}