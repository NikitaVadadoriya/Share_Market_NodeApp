const { RES_MESSAGE } = require("../json/message.json");
const apiRes = require('../utils/apiResponse');
const model = require("../models");

module.exports = exports = (path, schema) => async (req, res, next) => {
    const dataForValidation = req[path];
    const { value, error } = schema.validate(dataForValidation, {
        allowUnknown: false,
        stripUnknown: true,
    });

    if (error) {
        const context = error.details[0].context.message;
        console.log(`#validation - Error encountered at path: "${req.path}", data: ${JSON.stringify(dataForValidation)}, context: ${context}\n${error}`);

        return apiRes.BAD_REQUEST(res, String(error), context ? { context } : {});
    } else {
        // Overriding sanitized object
        req[path] = value;
        next();
    }
}