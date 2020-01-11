let mongoose = require('mongoose');

let RobotMatchModel = new mongoose.Schema({
    matchNumber: Number,
    robot: {
        teamNumber: Number,
        allianceNumber: Number,
        allianceColor: String
    },
    stats: {
        auto: {},
        teleop: {},
        endgame: {}
    }
});

RobotMatchModel.index({'matchNumber': 1, 'robot.teamNumber': 1}, { unique: true });


module.exports = mongoose.model('RobotMatch', RobotMatchModel);