const express = require("express");
const router = express.Router();
const matchesModel = require(__path_schemas + "matches");
router.get('/',async (req, res) => {
    
});
router.post('/add',async (req, res) => {
    //khi bắt đầu tạo phòng thì chỉ có 1 người chơi
    const arrays = [];
    const object = {user: id};
    arrays.push(object);
    const user = await matchesModel.create({players: arrays});
});
module.exports = router;