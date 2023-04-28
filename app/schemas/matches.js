const mongoose = require("mongoose");

const matchesSchema = new mongoose.Schema({
    name: String,
    players: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            resultMatch: {
                type: String,
                default: ""
            }
        }
    ],
    status: {
        type: String,
        default: "Waiting"
    },
    count: {
        type: Number,
        default: 1
    },
    betPoints: {
        type: String,
        default: 1
    },
});


const matches = mongoose.model("matches", matchesSchema);
module.exports = matches;