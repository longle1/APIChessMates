const validateReq = (req, res, notify, validates) => {
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
module.exports = validateReq;