const axios = require('axios');
const config = require('../config');
const apiRes = require('../utils/apiResponse');
const { RES_MESSAGE } = require('../json/message.json');

// @route   GET /api/stock/list
// @desc    Get stock list
// @access  Public
exports.getStockList = async (req, res) => {
   
    const apiUrl = `https://financialmodelingprep.com/api/v3/stock/list?apikey=${config.API_KEY}`;
    // const apiUrl = `https://jsonplaceholder.typicode.com/todos/1`;
    let symbol_list = [];
    axios.get(apiUrl)
        .then(response => {
            response.data.map(item => {
                item.logo = config.COMPANY_LOGO_URL + item.symbol + '.png';
                symbol_list.push(item);
            });
            return apiRes.OK(res, RES_MESSAGE.STOCK_LIST_FETCH, symbol_list);
        })
        .catch(error => {
            console.log(RES_MESSAGE.STOCK_LIST_FETCH_ERROR, error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        })
}