const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();
const matches = require(__path_models + "matches");
router.get('/', asyncHandler(
    async (req, res) => {
        try {
            const listRooms = await matches.getListRooms();
            if (listRooms) {
                res.status(200).json({
                    success: true,
                    messag: listRooms
                });
            }
        }catch(error) {
            res.status(400).json({
                success: false,
                message: "Lấy danh sách phòng thất bại, vui lòng thực hiện lại"
            });
        }
    }
));

//thực hiện thêm user vào trận đấu
router.post('/add', asyncHandler(
    async (req, res) => {
        try {
            //khi bắt đầu tạo phòng thì chỉ có 1 người chơi
            const room = await matches.createRoom(req.body);
            if (room) {
                res.status(200).json({
                    success: true,
                    message: room
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Tạo phòng thất bại, vui lòng thực hiện lai"
            });
        }
    }
));
//khi có user tham gia vào phòng chat thì tiến hành thêm user đó vào phòng chơi
//chỉnh sửa lại thông tin về kết quả của trận đấu
router.put('/edit/:id', asyncHandler(
    async (req, res) => {
        try {
            const room = await matches.join_Exit_Finish_Room(req)
            if (room) {
                res.status(200).json({
                    success: true,
                    messag: room
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                success: false,
                message: "Đã xảy ra lỗi trong quá trình chỉnh sửa, vui lòng thực hiện lại"
            });
        }
    }
));

router.delete('/delete/:id', asyncHandler(
    async (req, res) => {
        const id = req.params.id;
        try {
            const room = await matches.deleteRoom(req.params.id);
            if (room) {
                res.status(200).json({
                    success: true,
                    messag: room
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Xóa phòng thất bại, vui lòng thực hiện lại"
            });
        }
    }
));

module.exports = router;