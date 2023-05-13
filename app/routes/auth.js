const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler');
const authModel = require(__path_models + "auth");
const validatesPassword = require(__path_validates + "password");
const validatesUser = require(__path_validates + "registerUser");
const validateReq = require(__path_middlewares + "checkErrorCondition");
const notifyConfig = require( __path_configs + "notify");
const config = require( __path_configs + "config");
var userId = null;


router.post('/register', asyncHandler(
    async (req, res) => {
        try {
            let error = validateReq(req, res, notifyConfig.NOTIFY_CHECK_INFO, validatesUser);
            if (!error) {
                const data = await authModel.createUser(req.body);
                if (!data) {
                    res.status(401).json({
                        succes: true,
                        notify: notifyConfig.ERROR_EXISTS_USER
                    });
                }
                res.status(201).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_REGISTER,
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
router.post('/login', asyncHandler(
    async (req, res, next) => {
        try {
            const data = await authModel.login(req.body);
            if (!data) {
                res.status(401).json({
                    success: false,
                    notify: notifyConfig.NOTITY_LOGIN
                });
            } else {
                res.status(200).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_LOGIN,
                    data
                });
            }
        }catch(error) {
            res.status(400).json({
                succes: false,
                notify: notifyConfig.ERROR_EXCUTE_FAIL
            });
        }
    }
));
//forgotPassword
router.post('/forgotPassword', asyncHandler(
    async (req, res) => {
        try {
            const data = await authModel.forgotPassword(req.body);
            if (!data) {
                res.status(401).json({
                    success: true,
                    notify: notifyConfig.ERROR_EMAIL_USERNAME_UNCORRECT
                });
            }
            res.status(200).json({
                succes: true,
                notify: notifyConfig.SUCCESS_CHECKEMAIL,
                data
            });
        } catch (error) {
            res.status(400).json({
                succes: false,
                notify: notifyConfig.ERROR_EXCUTE_FAIL
            });
        }
    }
));

router.post('/getToken/:token', asyncHandler(
    async (req, res) => {
        try {
            const data = await authModel.checkToken(req.params.token);

            if (!data) {
                res.status(400).json({
                    success: true,
                    notify: notifyConfig.NOTIFY_TOKEN_EXP
                });
            } else {
                userId = data;
                res.status(200).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_CONFIRM
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
router.post('/resetPassword', asyncHandler(
    async (req, res) => {
        try {
            const error = validateReq(req, res, notifyConfig.ERROR_PASSWORD, validatesPassword);
            if (!error) {
                //thực hiện việc đổi mật khẩu
                const data = await authModel.resetPassword({ id: userId, password: req.body.password });
                if (!data) {
                    res.status(400).json({
                        success: true,
                        notify: notifyConfig.ERROR_FIND_USER
                    });
                }
                res.status(200).json({
                    success: true,
                    notify: notifyConfig.SUCCESS_RESETPASSWORD,
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
module.exports = router;