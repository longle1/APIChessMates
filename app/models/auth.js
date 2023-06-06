const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const usersModel = require(__path_schemas + "users");

module.exports = {
    login: async (params) => {
        let { userName, password } = params;
        const result = await usersModel.checkLoginUser(userName, password);
        const user = await usersModel.findById(result.id)
            .populate({ path: 'lists', select: '-__v' })
            .populate({ path: 'matches', select: '-_id  -count -betPoints -__v -roomName -ownerRoom -ipRoom' })
            .select('-__v');
        if (result.error)
            return false;
        return user;
    },
    forgotPassword: async (params) => {
        let { userName, gmail } = params;
        const user = await usersModel.findOne({ userName, gmail });
        if (!user) {
            return false;
        }

        const resetToken = await user.resetPassword();

        //tiến hành lưu dữ liệu của user này lại
        // mỗi lần tiến hành phương thức save thì userSchema.pre("save", function(next) sẽ được thực hiện vậy nên ta cần kiểm tra trước
        await user.save();


        //cung cấp mã cho người dùng
        const token = resetToken;
        //cung cấp nội dung
        const message = `Nhập mã để đổi mật khẩu: ${token}`;

        try {
            await sendEmail({
                email: user.gmail,
                subject: "Mã token",
                notify: message
            });
            return "Vui lòng kiểm tra gmail của bạn";
        } catch (error) {
            user.resetPasswordToken = null;
            user.resetPasswordTokenExp = null;
            await user.save();
            return "Gửi thất bại, vui lòng thực hiện lại";
        }
    },
    checkToken: async (params) => {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(params)
            .digest('hex');
        const user = await usersModel.findOne({
            resetPasswordToken,
            resetPasswordTokenExp: { $gt: Date.now() }
        });

        if (!user) {
            return false;
        }
        user.resetPasswordToken = null;
        user.resetPasswordTokenExp = null;
        await user.save();
        return user._id;
    },
    resetPassword: async (params) => {
        if (!params.id) {
            return false;
        }
        const user = await usersModel.findOne({ _id: params.id });

        user.password = params.password;
        await user.save();
        //return "Đổi mật khẩu thành công";
        return user;
    },
    createUser: async (body) => {
        let user = await usersModel.findOne({ userName: body.userName });
        if (user) {
            return false;
        }
        return await usersModel.create({ ...body });
    }
}