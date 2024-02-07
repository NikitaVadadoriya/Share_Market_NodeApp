const express = require('express');
const router = express.Router();

const {
    getIntradayChart,
    getDailyChartEndOfDay
} = require('../../controllers/ShareUpDownChartInfo');

router.get("/intradayChart", getIntradayChart);
router.get("/dailyChartEndOfDay", getDailyChartEndOfDay);

module.exports = router;