const express = require("express");
const router = express.Router();
const asyncHandler = require('express-async-handler');
const authModel = require(__path_models + "auth");
const validatesPassword = require(__path_validates + "password");
const validatesUser = require(__path_validates + "registerUser");
const validateReq = require("../middlewares/checkErrorCondition");
const notifyConfig = require("../configs/notify");
const util = require('util');
var userId = null;
//thư viện express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 3
});
router.post('/register',asyncHandler(
    async (req, res) => {
        try {
            let error = validateReq(req,res , notifyConfig.NOTIFY_CHECK_INFO, validatesUser);
            if (!error) {
                const data = await authModel.createUser(req.body);
                if(!data) {
                    res.status(401).json({
                        succes: true,
                        notify: "User này đã tồn tại, vui lòng thực hiện lại"
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
                notify: notifyConfig.ERROR_REGISTER_FAIL,
                error
            });
        }
    }
));

router.post('/login', asyncHandler(
    async (req, res, next) => {
        const data = await authModel.login(req.body);
        if (!data) {
            next();
        } else {
            res.status(200).json({
                success: true,
                message: data
            });
        }
    }
), limiter, (req, res) => {
    res.status(429).json({
        success: false,
        message: notifyConfig.NOTITY_LOGIN
    });
});
//forgotPassword
router.post('/forgotPassword', asyncHandler(
    async (req, res) => {
        const data = await authModel.forgotPassword(req.body);
        if (!data) {
            res.status(401).json({
                success: true,
                message: notifyConfig.ERROR_EMAIL_USERNAME_UNCORRECT
            });
        }
        res.status(200).json({
            succes: true,
            message: data
        });
    }
));

router.post('/getToken/:token', asyncHandler(
    async (req, res) => {
        const data = await authModel.checkToken(req.params.token);
    
        if (!data) {
            res.status(400).json({
                success: true,
                message: notifyConfig.NOTIFY_TOKEN_EXP
            });
        } else {
            userId = data;
            res.status(200).json({
                success: true,
                message: notifyConfig.SUCCESS_CONFIRM
            });
        }
    }
));
router.post('/resetPassword',asyncHandler(
    async (req, res) => {
        try {
            const error = validateReq(req, res, notifyConfig.ERROR_PASSWORD, validatesPassword);
            if (!error) {
                //thực hiện việc đổi mật khẩu
                const data = await authModel.resetPassword({ id: userId, password: req.body.password });
                if (!data) {
                    res.status(400).json({
                        success: true,
                        message: util.format(notifyConfig.ERROR_FIND_USER, "")
                    });
                }
                res.status(200).json({
                    success: true,
                    message: data
                });
            }
        }catch(error) {
            res.status(200).json({
                success: false,
                message: notifyConfig.ERROR_RESET_PASSWORD
            });
        }
    }
));
module.exports = router;