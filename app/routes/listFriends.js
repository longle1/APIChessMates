const express = require("express");
const listFriends = require(__path_models + "listFriends");
const router = express.Router();
const asyncHandler = require('express-async-handler');
router.get('/',asyncHandler(
    async (req, res) => {
        try{
            const list = await listFriends.getListFriends();
            res.status(200).json({
                success: true,
                message: list
            });
        }catch(error) {
            res.status(200).json({
                success: true,
                message: "Lấy danh sách thất bại, vui lòng thực hiện lại"
            });
        }
    }
));
router.post('/add',asyncHandler(
    async (req, res) => {
        try {
            const list = await listFriends.createFriend(req.body);
            if(list) {
                res.status(200).json({
                    success: true,
                    success: list
                });
            }
        }catch(error) {
            res.status(400).json({
                success: false,
                message: "Đã xảy ra lỗi, vui lòng thực hiện lại"
            });
        }
    }
));
//khi người dùng chấp nhận kết bạn thì chỉnh sửa lại thông tin
router.put('/edit/:id',asyncHandler(
    async (req, res) => {
        try {
            const updateFriend = await listFriends.updateStatusFriend(req. params);
            if(updateFriend) {
                res.status(200).json({
                    success: true,
                    message: updateFriend
                });
            }
        }catch (error) {
            res.status(200).json({
                success: false,
                message: "Cập nhật trạng thái bạn bè thất bại, vui lòng thực hiện lại"
            });
        }
    }
));
router.delete('/delete/:id', asyncHandler (
    async (req, res) => {
        try {
            const list = await listFriends.deleteFriend(req.params);
            if(list) {
                res.status(200).json({
                    success: true,
                    message: list
                });
            }
        }catch (error) {
            res.status(400).json({
                success: true,
                message: "Thực hiện xóa thất bại, vui lòng thử lại"
            });
        }
    }
));
module.exports = router;