const axios = require('axios');
const config = require('../config');
const apiRes = require('../utils/apiResponse');
const { RES_MESSAGE, SOCKET_MESSAGE } = require('../json/message.json');


// @route   GET /api/stock/list
// @desc    Get stock list
// @access  Public
exports.getStockList = async (req, res) => {
    stockListDataSocketIO(res);
    console.log('Timer expired after 2 seconds.');
    setInterval(async () => {
        console.log('Timer expired after 1 min.');
        stockListDataSocketIO(res);
    }, 60000);// 2 min
}

const stockListDataSocketIO = async (res) => {
    let symbol_list = [];
    let symbolName = [];
    const apiUrl = `https://financialmodelingprep.com/api/v3/stock/list?apikey=${config.API_KEY}`;

    axios.get(apiUrl)
        .then(async response => {
            response.data.map(async item => {
                item.logo = config.COMPANY_LOGO_URL + item.symbol + '.png';
                symbol_list.push(item);
                symbolName.push(item.symbol);
            });
            setInterval(async () => {
                await priceUpDown(symbolName, res);
            }, 60000);// 2 min

            io.emit(SOCKET_MESSAGE.SYMBOL_LIST, symbol_list.map(item => item));
            // return apiRes.OK(res, RES_MESSAGE.STOCK_LIST_FETCH, symbol_list);
        })
        .catch(error => {
            console.log(RES_MESSAGE.STOCK_LIST_FETCH_ERROR, error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        })
}

const priceUpDown = async (symbol, res) => {
    let count = 100;
    const symbolArray = [];

    symbol.map(async (item, i) => {
        if (i <= count) {
            symbolArray.push(item);
        }

        if (i == count) {
            let resultString = symbolArray.join(',');
            console.log("~~ Array ~~", resultString);

            const apiUrl = `https://financialmodelingprep.com/api/v3/quote/${resultString}?apikey=${config.API_KEY}`;
            await axios.get(apiUrl)
                .then(response => {
                    console.log("~~ Res ~~", response.data);
                    count = count + 100;
                    symbolArray.length = 0;
                    io.emit(SOCKET_MESSAGE.SYMBOL_UP_DOWN, response.data.map(item => item));
                    // return apiRes.OK(res, RES_MESSAGE.STOCK_LIST_FETCH, symbol_list);
                })
                .catch(error => {
                    count = count + 100;
                    symbolArray.length = 0;
                    console.log(RES_MESSAGE.STOCK_LIST_FETCH_ERROR, "=>", error.message);
                    return apiRes.CATCH_ERROR(res, error.message);
                })
        }
    })
}