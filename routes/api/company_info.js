const express = require('express');
const router = express.Router();

const {
    getCompanyInfo
} = require('../../controllers/company_info');

router.get("/info", getCompanyInfo);
//router.get("/list", getStockList);

module.exports = router;