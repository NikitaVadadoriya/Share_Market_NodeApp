const express = require('express');
const router = express.Router();

const {
    getUserInfo
}= require('../../controllers/user_info.js');

router.get("", getUserInfo);

module.exports = router;
