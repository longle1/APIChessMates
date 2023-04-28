const listFriendsModel = require(__path_schemas + "listFriends");
module.exports = {
    getListFriends: async () => {
        return await listFriendsModel.find({}).select('-__v');
    },
    createFriend: async (body) => {
        const { id_user1, id_user2 } = body;
        if (id_user1 === id_user2) {
            return "errorID"
        }
        const arraysID = [];
        arraysID.push(id_user1);
        arraysID.push(id_user2);
        const object = await listFriendsModel.findOne({ listID: arraysID });
        if (object) {
            return "duplicateData";
        }
        return await listFriendsModel.create({ listID: arraysID });
    },
    updateStatusFriend: async(params) => {
        const updateFriend = await listFriendsModel.findOne({_id: params.id});
        updateFriend.status = "friend";
        await updateFriend.save();
        return updateFriend;
    },
    deleteFriend: async(params) => {
        return await listFriendsModel.findOneAndDelete({_id: params.id});
    }
}