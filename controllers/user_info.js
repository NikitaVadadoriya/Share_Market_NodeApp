const Joi = require("joi");
const { RES_MESSAGE } = require('../json/message.json');
const apiRes = require('../utils/apiResponse');
const { checkIfItemExistsById, checkEmailRegex, encodeString, decodeString, checkIfItemEmpty, generateToken, generateOTP } = require('../utils/utils');
const { sendEmail } = require('../service/mail.service');
const eventEmitter = require('../utils/eventEmitter').myEmitter;
const { User_info } = global.models;

/*joi validation*/
module.exports = {
    createUserInfoJoiValidation: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        userEmail: Joi.string().required(),
        userPhone: Joi.string().required(),
        dial_code: Joi.string().required(),
        password: Joi.string().required(),
    }),

    updateUserInfoJoiValidation: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        userEmail: Joi.string(),
        userPhone: Joi.string(),
        dial_code: Joi.string(),
        password: Joi.string(),
    }),

    // @route   GET /api/user
    // @desc    Get User Info
    // @access  Public
    getUserInfo: async (req, res) => {
        try {
            let { page, limit, sortBy, sortOrder, isAll, ...query } = req.query;
            query = isAll === "true" ? { ...query } : { isDeleted: 0, ...query };

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 1000;
            sortBy = sortBy || "createdAt";
            sortOrder = sortOrder || "DESC"
            let skip = (page - 1) * limit;

            const { count, rows } = await User_info.findAndCountAll({
                where: { ...query },
                order: [[sortBy, sortOrder]],
                limit: limit,
                offset: skip,
                raw: true,
            });

            return apiRes.OK(res, RES_MESSAGE.USERINFO_FETCH,
                {
                    count: count,
                    userInfo: rows
                });
        } catch (error) {
            console.log(RES_MESSAGE.USERINFO_ERROR_FETCH, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route  POST /api/user/signup
    // @desc   signup User 
    // @access Public
    createUserInfo: async (req, res) => {
        try {
            let { userEmail, userPhone } = req.body;

            /* check if user info alredy exist or not exist */
            if (await checkIfItemExistsById({ userEmail: userEmail, isDeleted: 0 }, "user_info")) return apiRes.DUPLICATE_VALUE(res, RES_MESSAGE.USEREMAIL_ALREADY_EXIST);
            if (await checkIfItemExistsById({ userPhone: userPhone, isDeleted: 0 }, "user_info")) return apiRes.DUPLICATE_VALUE(res, RES_MESSAGE.USERPHONE_NUMBER_ALREADY_EXIST);

            /* check if user email valid or not */
            if (await checkEmailRegex(userEmail)) return apiRes.NOT_ACCEPTABLE(res, RES_MESSAGE.USEREMAIL_NOT_VALID);

            /* user profile */
            await req.files.forEach((file) => {
                console.log("~~ User Profile ~~", file);
                if (file.fieldname === "userProfile") {
                    req.body.userProfile = file.location
                }
            })

            /* encode Passrord */
            if (req.body.password) req.body.password = await encodeString(req.body.password);

            const signupUser = await User_info.create(req.body);
            req.body.isSignup = true;
            return apiRes.OK(res, RES_MESSAGE.USERINFO_CREATE, signupUser);
        } catch (error) {
            console.log(RES_MESSAGE.USERINFO_ERROR_CREATE, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route  POST /api/user/login
    // @desc   User login 
    // @access Public
    loginUserInfo: async (req, res) => {
        try {
            const { userEmail, password } = req.body;

            /* check if Item is empty or not empty */
            const emptyItem = await checkIfItemEmpty(req.body, ["userEmail", "password"]);
            if (emptyItem) return apiRes.BAD_REQUEST(res, emptyItem);

            /* check if user exist or not exist */
            const userInfo = await User_info.findOne({ where: { userEmail: userEmail, isDeleted: 0 } });
            if (!userInfo) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);

            if (!req.body.isSignup) {
                if (await !decodeString(password, userInfo.password)) return apiRes.BAD_REQUEST(res, RES_MESSAGE.PASSWORD_NOT_MATCH);
            }
            const token = await generateToken({ user_id: userInfo.id });
            return apiRes.OK(res, RES_MESSAGE.USERINFO_LOGIN_SUCCESS, { Token: token });

        } catch (error) {
            console.log(RES_MESSAGE.USERINFO_ERROR_CREATE, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route  PUT /api/user/update
    // @desc   User Info Update 
    // @access Public
    updateUserInfo: async (req, res) => {
        try {
            const { user_id } = req.query;
            const { userEmail, userPhone } = req.body;

            /* check if user info alredy exist or not exist */
            if (!userEmail ? userEmail : await checkIfItemExistsById({ userEmail: userEmail, isDeleted: 0 }, "user_info")) return apiRes.DUPLICATE_VALUE(res, RES_MESSAGE.USEREMAIL_ALREADY_EXIST);
            if (!userPhone ? userPhone : await checkIfItemExistsById({ userPhone: userPhone, isDeleted: 0 }, "user_info")) return apiRes.DUPLICATE_VALUE(res, RES_MESSAGE.USERPHONE_NUMBER_ALREADY_EXIST);

            /* check if user email valid or not */
            if (userEmail) if (await checkEmailRegex(userEmail)) return apiRes.NOT_ACCEPTABLE(res, RES_MESSAGE.USEREMAIL_NOT_VALID);

            /* user profile */
            await req.files.forEach((file) => {
                if (file.fieldname === "userProfile") {
                    req.body.userProfile = file.location
                }
            })

            const userInfoUpdate = await User_info.update({ ...req.body }, { where: { id: user_id } });
            return apiRes.OK(res, RES_MESSAGE.USERINFO_UPDATE, userInfoUpdate);
        } catch (error) {
            console.log(RES_MESSAGE.USERINFO_ERROR_CREATE, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route  DELETE /api/user/delete
    // @desc   User Info Delete
    // @access Public
    deleteUserInfo: async (req, res) => {
        try {
            const { user_id } = req.query;

            /* check if user info alredy exist or not exist */
            if (!user_id || !(await checkIfItemExistsById({ id: user_id }, "user_info"))) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);
            await User_info.update({ isDeleted: 1 }, { where: { id: user_id } });

            return apiRes.OK(res, RES_MESSAGE.USERINFO_DELETE)
        } catch (error) {
            console.log(RES_MESSAGE.USERINFO_ERROR_DELETE, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    //@route   POST /api/user/changePassword
    //@desc    Change login password
    //@access  Public
    changePassword: async (req, res) => {
        try {
            const { user_id, current_password, new_password } = req.body;

            const userInfo = await User_info.findOne({ where: { id: user_id } });
            if (!userInfo) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);

            if (!await decodeString(current_password, userInfo.password)) return apiRes.BAD_REQUEST(res, RES_MESSAGE.PASSWORD_INCORRECT);
            const password = await encodeString(new_password);
            await User_info.update({ password: password }, { where: { id: user_id } });

            return apiRes.OK(res, RES_MESSAGE.CHANGE_LOGIN_PASSWORD);
        } catch (error) {
            console.log(RES_MESSAGE.CHANGE_LOGIN_PASSWORD_ERROR);
            return apiRes.CATCH_ERROR(res, error.message)
        }
    },

    // @route  POST /api/user/forgotPassword
    // @desc   User forgot Password
    // @access Public
    forgotPassword: async (req, res) => {
        try {
            const { userEmail } = req.body;

            const userInfo = await User_info.findOne({ where: { userEmail: userEmail } });
            if (!userInfo) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);

            const otp = await generateOTP(userInfo.otp);
            if (!userInfo.otp) await User_info.update({ otp }, { where: { id: userInfo.id } });
            console.log("~~ $$ ~~", otp);
            /*send email*/
            sendEmail(userInfo.userEmail, userInfo.firstName, otp);

            /* Delete OTP After 10 Min */
            eventEmitter.emit("deleteOTP", { model: 'user_info', id: userInfo.id });

            return apiRes.OK(res, RES_MESSAGE.OTP_SEND);

        } catch (error) {
            console.log(RES_MESSAGE.USERINFO_ERROR_CREATE, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route  POST /api/user/verifyOtp
    // @desc   User Verify Otp 
    // @access Public
    verifyOtp: async (req, res) => {
        try {
            const { userEmail, otp } = req.body;

            const userInfo = await User_info.findOne({ where: { userEmail: userEmail } });
            if (!userInfo) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);

            console.log(typeof userInfo.otp, "<~~>", typeof otp);
            if (userInfo.otp == null) return apiRes.UNAUTHORIZED(res, RES_MESSAGE.OTP_EXPIRED);
            if (userInfo.otp !== otp.toString() || otp.toString() == null) return apiRes.UNAUTHORIZED(res, RES_MESSAGE.OTP_NOT_VERIFYED);

            return apiRes.OK(res, RES_MESSAGE.VERIFY_OTP);
        } catch (error) {
            console.log(RES_MESSAGE.OTP_VERIFIED_ERROR);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    }
}