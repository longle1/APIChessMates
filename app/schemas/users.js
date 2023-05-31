const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const colors = require('colors');
const util = require("util");
const configs = require(__path_configs + "config");
const notifyConfig = require(__path_configs + "notify");
const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    gmail: String,
    linkAvatar: {
        type: String,
        default: "defaultAvatar.jpg"
    },
    statusActive: {
        type: String,
        default: "offline"
    },
    point: {
        type: Number,
        default: 10
    },
    resetPasswordToken: String,
    resetPasswordTokenExp: String
});
userSchema.virtual('lists', {
    ref: 'listFriends',
    localField: '_id',
    foreignField: 'listID'
});
userSchema.virtual('matches', {
    ref: 'matches',
    localField: '_id',
    foreignField: 'players.user',
});
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
//dùng để mã hóa mật khẩu
userSchema.pre("save", function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    }
    next();
})
//kiểm tra xem user login có hợp lệ hay không
//liên quan trực tiếp đến model và có thể gọi trựxc tiếp các phương thức của model
userSchema.statics.checkLoginUser = async function (userName, password) {
    let error = "";
    if (!userName.trim() || !password.trim()) return { error: notifyConfig.ERROR_PASSWORD_USERNAME_EMPTY };
    const user = await this.findOne({ userName });
    if (!user) {
        return { error: notifyConfig.ERROR_USERNAME_UNCORRECT };
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return { error: notifyConfig.ERROR_PASSWORD_UNCORRECT };
    return user;
}

//tạo ra 1 document liên quan đến model
userSchema.methods.resetPassword = function () {
    const resetToken = crypto.randomBytes(configs.lengthByteRandom).toString('hex');
    //Không thể lưu token này vào db được mà phải mã hóa sang 1 chuỗi khác
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest('hex');
    //xác thực thời gian là 5p
    this.resetPasswordTokenExp = Date.now() + configs.resetTokenExp * 60 * 1000;
    return resetToken;
}
module.exports = mongoose.model('users', userSchema);
