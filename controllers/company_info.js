const axios = require('axios');
const config = require('../config');
const apiRes = require('../utils/apiResponse');
const { RES_MESSAGE } = require('../json/message.json');

// @route   GET /api/stock/companyInfo
// @desc    Get company Info & share price
// @access  Public
exports.getCompanyInfo = async (req, res) => {

    let { symbol } = req.query;
    const apiUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${config.API_KEY}`
    axios.get(apiUrl)
        .then(response => {
            return apiRes.OK(res, RES_MESSAGE.COMPANY_INFO_FETCH, response.data);
        })
        .catch(error => {
            console.log(RES_MESSAGE.COMPANY_INFO_FETCH_ERROR, error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        })
}