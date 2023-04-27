const usersModel = require(__path_schemas + "users");
module.exports = {
    listUsers: async (params, options) => {
        if (options.task === "all") {
            let userName = {};
            //tạo regex cho phép tìm kiếm tên với từ khóa đơn giản 
            if (params.userName) userName = { userName: { $regex: params.userName, $options: 'i' } };
            return await usersModel
                .find(userName)
                .populate({ path: 'lists'})
                .populate({path: 'matches'})
                .select({});
        } else if (options.task === "one") {
            return await usersModel.findById(params.id).select({});
        }
    },
    deleteUser: async (params) => {
        return await usersModel.findByIdAndDelete({ _id: params.id });
    },

    updateUser: async (params) => {
        return await usersModel.findByIdAndUpdate({ _id: params.id }, params.body);
    }
}