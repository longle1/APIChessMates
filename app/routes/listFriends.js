const express = require("express");
const listFriends = require(__path_models + "listFriends");
const router = express.Router();
const asyncHandler = require('express-async-handler');
const notifyCofig = require("../configs/notify");
router.get('/',asyncHandler(
    async (req, res) => {
        try{
            const data = await listFriends.getListFriends();
            res.status(200).json({
                success: true,
                data
            });
        }catch(error) {
            res.status(200).json({
                success: true,
                notify: notifyCofig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
router.post('/add',asyncHandler(
    async (req, res) => {
        try {
            const data = await listFriends.createFriend(req.body);
            if(data === "errorID") {
                res.status(400).json({
                    success: true,
                    notify: notifyCofig.ERROR_DUPLICATE_DATA
                });
            }else if(data === "duplicateData") {
                res.status(409).json({
                    success: false,
                    notify: notifyCofig.ERROR_EXISTS_LISTFRIEND
                });
            }else {
                res.status(201).json({
                    success: true,
                    notifyCofig: notifyCofig.SUCCESS_CREATE,
                    data
                });
            }
        }catch(error) {
            res.status(400).json({
                success: false,
                notify: notifyCofig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
//khi người dùng chấp nhận kết bạn thì chỉnh sửa lại thông tin
router.put('/edit/:id',asyncHandler(
    async (req, res) => {
        try {
            const data = await listFriends.updateStatusFriend(req. params);
            if(data) {
                res.status(200).json({
                    success: true,
                    notify: notifyCofig.SUCCESS_UPDATE_LISTFRIENDS,
                    data
                });
            }
        }catch (error) {
            res.status(400).json({
                success: false,
                notify: notifyCofig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
router.delete('/delete/:id', asyncHandler (
    async (req, res) => {
        try {
            const data = await listFriends.deleteFriend(req.params);
            if(data) {
                res.status(200).json({
                    success: true,
                    notify: notifyCofig.SUCCESS_DELETE_LISTFRIENDS,
                    data
                });
            }
        }catch (error) {
            res.status(400).json({
                success: false,
                notify: notifyCofig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
module.exports = router;