const util = require('node:util');
const notify = require("./notify");
var colors = require('colors');
const options = {
    name: { min: 6, max: 30 } //dùng cho cả name và password
};
let characters = "!@#$%^&*()_-+=}{[]\'\";:<>.,?/";

module.exports = {
    validator: (req) => {
        //name 
        req.checkBody("userName", util.format(notify.ERROR_NAME_EMPTY, "UserName")).not().isEmpty();
        req.checkBody("userName", util.format(notify.ERROR_NAME_LENGTH, "UserName", options.name.min, options.name.max))
            .isLength({ min: options.name.min, max: options.name.max });
        req.checkBody("userName", util.format(notify.ERROR_NAME_CONTAINS_SPECIALCHARS, "UserName"))
            .custom(value => {
                var checkSpecialChars = true;
                for (let index = 0; index < value.length; index++)
                    if (characters.includes(value[index])) checkSpecialChars = false;
                return checkSpecialChars;
            });
        //password
        req.checkBody("password", util.format(notify.ERROR_NAME_EMPTY, "Password")).not().isEmpty();
        req.checkBody("password", util.format(notify.ERROR_NAME_LENGTH, "password", options.name.min, options.name.max))
            .isLength({ min: options.name.min, max: options.name.max });
        req.checkBody("password", util.format(notify.ERROR_PASSWORD_NO_SPACES, "password"))
            .custom(value => {
                for (let index = 0; index < value.length; index++)
                    if (value[index].includes(" ")) return false;
                return true;
            });
        req.checkBody("password", util.format(notify.ERROR_PASSWORD_CONTAINTS_DIGIT_UPPERCASE_LOWERCASE, "password"))
            .custom(value => {
                let checkDigit = false, checkUpper = false, checkLower = false;
                for (let index = 0; index < value.length; index++) {
                    if(value[index] >= 'A' && value[index] <= 'Z') checkUpper = true;
                    if(value[index] >= 0 && value[index] <= 9) checkDigit = true;
                    if(value[index] >= 'a' && value[index] <= 'z') checkLower = true;
                }
                if(checkDigit && checkLower && checkUpper) return true;
                return false;
            });
        //gmail
        req.checkBody("gmail", util.format(notify.ERROR_NAME_EMPTY, "Email")).not().isEmpty();
        req.checkBody("gmail", util.format(notify.ERROR_GMAIL_ILLEGAL))
            .matches(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        const errors = req.validationErrors() !== false ? req.validationErrors() : [];
        return errors;
    }
}