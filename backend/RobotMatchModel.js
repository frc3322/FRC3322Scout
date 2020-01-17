let mongoose = require('mongoose');

let RobotMatchModel = new mongoose.Schema({
    matchNumber: Number,
    won: Boolean,
    robot: {
        teamNumber: Number,
        allianceNumber: Number,
        allianceColor: String
    },
    stats: {
        auto: {
            moved: Boolean,
            scoredBottom: Number,
            scoredOuter: Number,
            scoredInner: Number
        },
        teleop: {
            scoredBottom: Number,
            scoredOuter: Number,
            scoredInner: Number,
            rotationControl: Boolean,
            positionControl: Boolean
        },
        endgame: {
            didClimb: Boolean,
            didPark: Boolean
        }
    }
});

RobotMatchModel.index({'matchNumber': 1, 'robot.teamNumber': 1}, { unique: true });


module.exports = mongoose.model('RobotMatch', RobotMatchModel);