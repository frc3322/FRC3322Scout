let mongoose = require('mongoose')


let QualModel = new mongoose.Schema({
    matchNumber: Number,
    teams: [],
    finishCondition: String,
    redScore: Number,
    blueScore: Number
});

module.exports = mongoose.model(QualModel);