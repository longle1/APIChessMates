const mongoose = require("mongoose");
const listFriendsOfUsersSchema = new mongoose.Schema({
    listID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    ],
    status: {
        type: String,
        default: "Waiting"
    }, //null/waiting/friend
});
module.exports = mongoose.model('listFriends', listFriendsOfUsersSchema);