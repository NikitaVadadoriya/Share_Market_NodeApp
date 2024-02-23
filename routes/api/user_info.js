const express = require("express");
const router = express.Router();
const { authToken } = require('../../middleware/auth');
const validate = require('../../middleware/validate');

const {
    getUserInfo,
    createUserInfo,
    updateUserInfo,
    deleteUserInfo,
    loginUserInfo,
    changePassword,
    forgotPassword,
    verifyOtp,
    createUserInfoJoiValidation,
    updateUserInfoJoiValidation,
} = require('../../controllers/user_info');

router.get("/", authToken, getUserInfo);
router.put("/update", authToken, validate("body", updateUserInfoJoiValidation), updateUserInfo);
router.post("/signup", validate("body", createUserInfoJoiValidation), createUserInfo);
router.post("/login", loginUserInfo);
router.post("/changePassword", authToken, changePassword);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtp", verifyOtp);
router.delete("/delete", authToken, deleteUserInfo);

module.exports = router;
