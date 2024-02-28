const express = require("express");
const router = express.Router();

const {
    getMyShare,
    buyShare,
    sellShare,
    buyShareJoiValidation
} = require("../../controllers/buyShare");
const validate = require('../../middleware/validate');

router.get('/myShare', getMyShare);
router.post('/buy', validate("body", buyShareJoiValidation), buyShare);
router.post('/sell', validate("body", buyShareJoiValidation), sellShare);

module.exports = router;