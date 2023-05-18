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
                .populate({ path: 'lists', select: '-__v'})
                .populate({path: 'matches', select: '-_id -status -count -betPoints -__v -name'})
                .select('-__v');
        } else if (options.task === "one") {
            return await usersModel.findById(params.id).select({});
        }
    },
    deleteUser: async (params) => {
        return await usersModel.findByIdAndDelete({ _id: params.id });
    },

    updateUser: async (params, req) => {
        const userName = params.body.userName;
        const user = await usersModel.find({userName});
        if(user) {
            res.status(401).json({
                success: true,
                notify: notifyConfig.ERROR_EXISTS
            });
        }
        return await usersModel.findByIdAndUpdate({ _id: params.id }, params.body);
    }
}