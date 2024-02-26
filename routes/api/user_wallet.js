const express = require('express');
const router = express.Router();
const validate = require('../../middleware/validate');

const {
    createWallet
} = require('../../controllers/user_wallet');

router.post('/', createWallet);


module.exports = router;