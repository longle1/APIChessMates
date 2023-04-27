const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();
const matchesModel = require(__path_schemas + "matches");
router.get('/', async (req, res) => {
    try {
        const listRooms = await matchesModel.find({});
        if (listRooms) {
            res.status(200).json({
                success: true,
                messag: listRooms
            });
        }
    }catch(error) {

    }
});
router.post('/add', asyncHandler(
    async (req, res) => {
        try {
            //khi bắt đầu tạo phòng thì chỉ có 1 người chơi
            const arrays = [];
            const object = { user: req.body.id };
            arrays.push(object);
            const room = await matchesModel.create({ players: arrays });
            if (room) {
                res.status(200).json({
                    success: true,
                    messag: room
                });
            }
        } catch (error) {

        }
    }
));
//khi có user tham gia vào phòng chat thì tiến hành thêm user đó vào phòng chat
//chỉnh sửa lại thông tin về kết quả của trận đấu
router.put('/edit/:id', asyncHandler(
    async (req, res) => {
        try {
            const object = { user: req.body.id };
            const room = await matchesModel.findOne({ _id: req.params.id });
            console.log(room);
            room.players.push(object);
            await room.save();
            if (room) {
                res.status(200).json({
                    success: true,
                    messag: room
                });
            }
        } catch (error) {

        }
    }
));
router.delete('/delete/:id', asyncHandler(
    async (req, res) => {
        try {
            const id = req.params.id;
            const room = await matchesModel.findOneAndDelete({ _id: id });
            if (room) {
                res.status(200).json({
                    success: true,
                    messag: room
                });
            }
        } catch (error) {

        }
    }
));

module.exports = router;