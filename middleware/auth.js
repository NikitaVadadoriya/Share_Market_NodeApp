const jwt = require('jsonwebtoken');
const config = require('../config');
const { RES_MESSAGE } = require('../json/message.json');
const apiRes = require('../utils/apiResponse');

module.exports = {
    authToken: async (req, res, next) => {
        const token = req.header('x-auth-token');
        if (!token) return apiRes.UNAUTHORIZED(res, RES_MESSAGE.UNAUTHORIZED_REQUEST);

        try {
            jwt.verify(token, config.JWT_SECRET, (err, decode) => {
                if (err) {
                    return apiRes.UNAUTHORIZED(res, RES_MESSAGE.UNAUTHORIZED_REQUEST);
                } else {
                    req.user = decode
                    next();
                }
            });
        } catch (error) {
            console.log(RES_MESSAGE.AUTHENTICATION_ERROR, error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    }
}
