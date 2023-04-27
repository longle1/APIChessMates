const express = require("express");
const asyncHandler = require('express-async-handler');
const usersModel = require(__path_models + "users");
const validates = require(__path_validates + "users");
const notifyConfig = require(__path_configs + "notify");
const util = require("util");
var colors = require('colors');
const router = express.Router();
const validateReq = (req, res, notify) => {
    const errors = validates.validator(req);
    if (Object.keys(errors).length > 0) {
        //duyệt qua mảng errors để lấy ra lỗi
        var messageErrors = {};
        errors.forEach((value, index) => {
            //nêu trong objetc đã tồn tại key này thì tiến hành đẩy vào mảng
            if (Object.keys(messageErrors).includes(value.param)) messageErrors[value.param].push(value.msg);
            else {
                const arrayErrors = [];
                arrayErrors.push(value.msg)
                messageErrors[value.param] = arrayErrors;
            }
        });
        res.status(400).send({
            success: false,
            notify,
            messageErrors
        });
        
        return true;
    }
    return false;
}
router.get("/", asyncHandler(
    async (req, res) => {
        try {
            const data = await usersModel.listUsers({userName: req.query.userName}, { task: "all" });
            res.status(200).json({
                success: true,
                notice: notifyConfig.SUCCESS_GET_USER_LIST,
                data
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                notice: notifyConfig.ERROR_GET_LIST_USER,
                data: null,
                error: err
            });
        }
    }
));
router.get("/:id", asyncHandler(
    async (req, res) => {
        const id = req.params.id;
        try {
            const data = await usersModel.listUsers({ id }, { task: "one" });
            res.status(200).json({
                success: true,
                notice: util.format(notifyConfig.SUCCESS_GET_USER, id),
                data
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                notice: util.format(notifyConfig.ERROR_FIND_USER, id),
                data: null,
            });
        }
    }
));
router.put("/edit/:id", asyncHandler(
    async (req, res) => {
        try {
            let error = validateReq(req, res, notifyConfig.ERROR_EDIT_USER);
            if (!error) {
                const data = await usersModel.updateUser({ id: req.params.id, body: req.body });
                console.log(data);
                res.status(201).send({
                    success: true,
                    notify: util.format(notifyConfig.SUCCESS_EDIT_USER, req.params.id),
                    data
                });
            }
        } catch (error) {
            res.status(400).send({
                success: false,
                notify: util.format(notifyConfig.ERROR_FIND_USER, req.params.id),
            });
        }
    }
));
router.delete('/delete/:id', asyncHandler(
    async (req, res) => {
        try {
            const id = req.params.id;
            const data = await usersModel.deleteUser({ id });
            res.status(200).json({
                success: true,
                notice: util.format(notifyConfig.SUCCESS_DELETE_USER, id),
                data
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                notice: util.format(notifyConfig.ERROR_FIND_USER, id),
                data: null,
            });
        }
    }
));
module.exports = router;