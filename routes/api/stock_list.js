const express = require('express');
const router = express.Router();

const {
    getStockList
} = require('../../controllers/stock_list');

router.get("/list", getStockList);
//router.get("/list", getStockList);

module.exports = router;