const express = require("express");
const router = express.Router();
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/listFriends', require('./listFriends'));
router.use('/matches', require('./matches'));
module.exports = router;