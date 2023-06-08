const usersModel = require(__path_schemas + "users");
const notifyConfig = require(__path_configs + "notify");
module.exports = {
    listUsers: async (params, options) => {
        if (options.task === "all") {
            let userName = {};
            //tạo regex cho phép tìm kiếm tên với từ khóa đơn giản 
            if (params.userName) userName = { userName: { $regex: params.userName, $options: 'i' } };
            return await usersModel
                .find(userName)
                .populate({ path: 'lists', select: '-__v' })
                .populate({ path: 'matches', select: '-_id -count -betPoints -__v -roomName -ownerRoom -ipRoom' })
                .select('-__v');
        } else if (options.task === "one") {
            return await usersModel.findById(params.id)
                .populate({ path: 'lists', select: '-__v' })
                .populate({ path: 'matches', select: '-_id -count -betPoints -__v -roomName -ownerRoom -ipRoom' })
                .select('-__v');
        }
    },
    deleteUser: async (params) => {
        return await usersModel.findByIdAndDelete({ _id: params.id });
    },

    updateUser: async (params, res) => {
        const user = await usersModel.findOne({ userName: params.body.userName });
        if (user) {
            if (params.id === user.id) {
                return await usersModel.findByIdAndUpdate({ _id: params.id }, params.body);
            } else {
                res.status(401).json({
                    success: true,
                    notify: notifyConfig.ERROR_EXISTS
                });
            }

            return;
        } else {
            return await usersModel.findByIdAndUpdate({ _id: params.id }, params.body);
        }
    },
    updatePoint: async (params) => {
        const user = await usersModel.findByIdAndUpdate({ _id: params.id }, { point: params.body });
        if (user) {
            return user;
        } else {
            return false;
        }
    }
}