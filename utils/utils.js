const { hash, compare } = require('bcryptjs');
const jwt = require("jsonwebtoken");
const model = require('../models');
const config = require('../config')

module.exports = {
    /* check if user info alredy exist or not exist */
    checkIfItemExistsById: async (key, modelName) => {
        const item = await model[modelName].findOne({ where: key });
        if (!item || item == null) return false;
        return true;
    },

    /* check if Item is empty or not empty */
    checkEmailRegex: async (email) => {
        const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!email.match(emailFormat)) return true;
        return false;
    },

    /* encode String */
    encodeString: async (string) => {
        return await hash(string, 10);
    },

    /* decode String */
    decodeString: async (string, hash) => {
        return await compare(string, hash);
    },

    /* check if Item is empty or not empty */
    checkIfItemEmpty: async (body, item) => {
        let data4Message = "Missing fields: ";
        let array4Fields = Object.keys(body);
        let invalidFields = new Set();

        item.forEach(async (field) => {
            if (!array4Fields.includes(field)) invalidFields.add(field);
        });

        for (const key in body) {
            if (item.includes(key) && body[key] === "") invalidFields.add(key);
        }

        if (invalidFields.size) {
            const array = Array.from(invalidFields);
            return data4Message + array.join(", ") + " ";
        } else {
            return null
        }
    },

    /* JWT Generate Token */
    generateToken: async (payload) => {
        return await jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: "3h",
        });
    },

    /* Verify the token using jwt.verify method */
    verifyToken: async (token) => {
        await jwt.verify(token, config.JWT_SECRET, async (error, decode) => {
            if (error) return await error;
            return await decode;
        });
    },

    /* Generate OTP */
    generateOTP: async (userOtp) => {
        // Generate a random 6-digit number
        const otp = userOtp ? userOtp : Math.floor(100000 + Math.random() * 900000);
        return otp.toString(); // Convert the number to a string
    },
}