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
        //gmail
        req.checkBody("gmail", util.format(notify.ERROR_NAME_EMPTY, "Email")).not().isEmpty();
        req.checkBody("gmail", util.format(notify.ERROR_GMAIL_ILLEGAL))
            .matches(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        const errors = req.validationErrors() !== false ? req.validationErrors() : [];
        return errors;
    }
}