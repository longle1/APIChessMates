const listFriendsModel = require(__path_schemas + "listFriends");
module.exports = {
    getListFriends: async () => {
        return await listFriendsModel.find({});;
    },
    createFriend: async (body) => {
        const { id1, id2 } = body;
        if (id1 === id2) {
            res.status(400).json({
                success: false,
                message: "Dữ liệu trùng, vui lòng thực hiện lại"
            });
        }
        const arraysID = [];
        arraysID.push(id1);
        arraysID.push(id2);
        const object = await listFriendsModel.findOne({ listID: arraysID });
        if (object) {
            res.status(409).json({
                success: false,
                message: "Dữ liệu đã tồn tại, không thể tạo thêm"
            });
        }
        return await listFriendsModel.create({ listID: arraysID });
    },
    updateStatusFriend: async(params) => {
        const updateFriend = await listFriendsModel.findOne({_id: params.id});
        updateFriend.status = "friend";
        await updateFriend.save();
        return updateFriend;
    }
}