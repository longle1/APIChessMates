const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();
const matches = require(__path_models + "matches");
const notifyConfig = require( __path_configs + 'notify');
router.get('/', asyncHandler(
    async (req, res) => {
        try {
            const data = await matches.getListRooms();
            if (data) {
                res.status(200).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_GET,
                    data
                });
            }
        }catch(error) {
            res.status(400).json({
                success: false,
                notify: notifyConfig.ERROR_EXCUTE_FAIL
            });
        }
    }
));

//thực hiện thêm user vào trận đấu
router.post('/add', asyncHandler(
    async (req, res) => {
        try {
            //khi bắt đầu tạo phòng thì chỉ có 1 người chơi
            const data = await matches.createRoom(req.body);
            if (data) {
                res.status(201).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_CREATE,
                    data
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                notify: notifyConfig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
//khi có user tham gia vào phòng chat thì tiến hành thêm user đó vào phòng chơi
router.put('/edit/addOrSubUser/:id', asyncHandler(
    async (req, res) => {
        try {
            const data = await matches.join_Exit_Room(req)
            if (data) {
                res.status(200).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_UPDATE_MATCHES,
                    data
                });
            }else {
                if(req.body.option === "adduser") {
                    res.status(400).json({
                        success: true,
                        notify: notifyConfig.NOTIFY_FULLROOM
                    });
                }
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                notify: notifyConfig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
//chỉnh sửa lại thông tin về kết quả của trận đấu
router.put('/edit/resultMatch/:id', asyncHandler(
    async (req, res) => {
        try {
            const data = await matches.finished_Room(req)
            if (data) {
                res.status(200).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_UPDATE_MATCHES_RESULT,
                    data
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                notify: notifyConfig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
router.delete('/delete/:id', asyncHandler(
    async (req, res) => {
        try {
            const data = await matches.deleteRoom(req.params.id);
            if (data) {
                res.status(200).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_DELETE_MATCHES,
                    data
                });
            }else {
                res.status(400).json({
                    success: true,
                    notify: notifyConfig.NOTIFY_LIST_EMPTY
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                notify: notifyConfig.ERROR_EXCUTE_FAIL
            });
        }
    }
));

router.delete('/delete', asyncHandler(
    async (req, res) => {
        try {
            const data = await matches.deleteAllRoom();
            if (data) {
                res.status(200).json({
                    success: true,
                    notify: "Xóa danh sách thành công",
                    data
                });
            }else {
                res.status(400).json({
                    success: true,
                    notify: "Xóa danh sách thất bại"
                });
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                notify: "Không thể thực hiện"
            });
        }
    }
))
module.exports = router;