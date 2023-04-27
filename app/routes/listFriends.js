const express = require("express");
const listFriends = require(__path_schemas + "listFriends");
const router = express.Router();
const asyncHandler = require('express-async-handler');
router.get('/',asyncHandler(
    async (req, res) => {
        const list = await listFriends.find({});
        res.status(200).send({
            data: list
        });
    }
));
router.post('/add',asyncHandler(
    async (req, res) => {
        try {
            const {id1, id2} = req.body;
            if(id1 === id2) {
                res.status(400).json({
                    success: false,
                    message: "Dữ liệu trùng, vui lòng thực hiện lại"
                });
            }
            const arraysID = [];
            arraysID.push(id1);
            arraysID.push(id2);
            const object = await listFriends.findOne({listID: arraysID});
            if(object) {
                res.status(409).json({
                    success: false,
                    message: "Dữ liệu đã tồn tại, không thể tạo thêm"
                });
            }
            const list = await listFriends.create({listID: arraysID});
            res.status(200).send({
                success: true,
                success: list
            });
        }catch(error) {
            res.status(400).json({
                success: false,
                message: "Đã xảy ra lỗi, vui lòng thực hiện lại"
            })
        }
    }
));
//khi người dùng chấp nhận kết bạn thì chỉnh sửa lại thông tin
router.put('/edit/:id',asyncHandler(
    async (req, res) => {
        const updateFriend = await listFriends.findOne({_id: req.params.id});
        console.log(updateFriend)
        updateFriend.status = "friend";
        await updateFriend.save();
        res.status(200).send({
            success: true,
            data: updateFriend
        });
    }
));
router.delete('/delete/:id', asyncHandler (
    async (req, res) => {
        const id = req.params.id;
        const list = await listFriends.findOneAndDelete({_id: id});
        
        res.status(200).send({
            data: list
        });
    }
));
module.exports = router;