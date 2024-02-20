const axios = require('axios');
const config = require('../config');
const apiRes = require('../utils/apiResponse');
const { RES_MESSAGE, SOCKET_MESSAGE } = require('../json/message.json');
const { format } = require('date-fns');

// @route   GET /api/stock/chart/intradayChart
// @desc    Get Intraday chart data
// @access  Public
exports.getIntradayChart = async (req, res) => {
    let { symbol } = req.query;

    //IntraDay Chart Data
    intradayChartSocketIO(res, symbol);

    // Company stock info Api
    companyShareInfo(symbol);
    marketCapitalization(symbol);

    setInterval(async () => {
        //IntraDay Chart Data
        intradayChartSocketIO(symbol);

    }, 900000);// 5 min

    setInterval(async () => {
        // Company stock info Api
        companyShareInfo(res, symbol);
        marketCapitalization(res, symbol);

    }, 60000); // 1 min
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


/* IntraDay Chart Data fetch */
const intradayChartSocketIO = async (res, symbol) => {
    const intraDayList = [];
    let apiUrl = `https://financialmodelingprep.com/api/v3/historical-chart/5min/${symbol}?apikey=${config.API_KEY}`

    axios.get(apiUrl)
        .then(response => {
            if (response.data !== null) {
                let yesterDay = format(response.data[0].date, 'yyyy-MM-dd');
                const currentTime = new Date();
                const hours = currentTime.getHours();
                const minutes = currentTime.getMinutes();
                const seconds = currentTime.getSeconds();

                let intraDayChartDate = response.data.reverse();
                intraDayChartDate.map(item => {
                    let itemDateFormat = format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss');
                    let startDateFormat = format(new Date(`${yesterDay} ${hours}:${minutes}:${seconds}`), 'yyyy-MM-dd HH:mm:ss');
                    let startDate = format(new Date(`${yesterDay} 09:30:00`), 'yyyy-MM-dd HH:mm:ss');
                    let endDateFormat = format(new Date(yesterDay + " 15:55:00"), 'yyyy-MM-dd HH:mm:ss');

                    if (itemDateFormat >= startDate && itemDateFormat <= endDateFormat) {
                        if (startDateFormat >= itemDateFormat) {
                            intraDayList.push(item);
                        }
                    }
                    io.emit(SOCKET_MESSAGE.INTRADAY_CHART_DATA, intraDayList.map(item => item.date));
                });
            }
            return intraDayList;
        })
        .catch(error => {
            console.log(RES_MESSAGE.INTRADAY_CHART_DATA_FETCH_ERROR, error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        });
}

/* Company Stock Information data fetch */
const companyShareInfo = async (res, symbol) => {
    let apiUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${config.API_KEY}`

    axios.get(apiUrl)
        .then(response => {
            io.emit(SOCKET_MESSAGE.COMPANY_INFO_CHART_DATA, response.data);
        })
        .catch(error => {
            console.log(RES_MESSAGE.COMPANY_INFO_FETCH_ERROR, error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        })
}

/* market-capitalization data fetch */
const marketCapitalization = (res, symbol) => {
    let apiUrl = `https://financialmodelingprep.com/api/v3/market-capitalization/${symbol}?apikey=${config.API_KEY}`

    axios.get(apiUrl)
        .then(response => {
            io.emit(SOCKET_MESSAGE.MARKET_CAPITALIZATION, response.data);
        })
        .catch(err => {
            console.log(RES_MESSAGE.MARKET_CAPITALIZATION_FETCH_ERROR, err.message);
            return apiRes.CATCH_ERROR(res, err.message);
        })
}