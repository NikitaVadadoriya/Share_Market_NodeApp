const axios = require('axios');
const config = require('../config');
const apiRes = require('../utils/apiResponse');
const { RES_MESSAGE } = require('../json/message.json');
const { intraDayChartData } = require('../socket/index');


// @route   GET /api/stock/chart/intradayChart
// @desc    Get Intraday chart data
// @access  Public
exports.getIntradayChart = async (req, res) => {
    let { minute, symbol } = req.query;
    //======= Socket.io ========\\
    intraDayChartData(symbol);
}


// @route   GET /api/stock/chart/dailyChartEndOfDay
// @desc    Get Daily share End Of Day
// @access  Public
exports.getDailyChartEndOfDay = async (req, res) => {
    let { symbol } = req.query;
    let apiUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${config.API_KEY}`

    axios.get(apiUrl)
        .then(response => {
            return apiRes.OK(res, RES_MESSAGE.DAILY_CHART_END_OF_DAY_FETCH, response.data);
        })
        .catch(error => {
            console.log(RES_MESSAGE.DAILY_CHART_END_OF_DAY_FETCH_ERROR, error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        });
}