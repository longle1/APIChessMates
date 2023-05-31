const mongoose = require("mongoose");

const matchesSchema = new mongoose.Schema({
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
        type: Number,
        default: 1
    },
    roomName: {
        type: String
    },
    ownerRoom: {
        type: String
    },
    ipRoom: {
        type: String
    }
});


const matches = mongoose.model("matches", matchesSchema);
module.exports = matches;