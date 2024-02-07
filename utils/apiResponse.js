const { HTTP_CODES } = require('../json/message.json');

/* Api Response status and Message */

module.exports = {
    BAD_REQUEST: (res, msg, data) => {
        res.status(HTTP_CODES.BAD_REQUEST).json(!data ? { success: false, message: msg || "" } : { success: false, message: msg || "", data });
    },

    DUPLICATE_VALUE: (res, msg) => {
        res.status(HTTP_CODES.DUPLICATE_VALUE).json({ success: false, message: msg || "" });
    },
    FORBIDDEN: (res, msg) => {
        res.status(HTTP_CODES.FORBIDDEN).json({ success: false, message: msg || "" });
    },

    CATCH_ERROR: (res, msg) => {
        let responseCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
        if ((msg && msg.includes("validation failed")) || (msg && msg.includes("duplicate key error collection"))) responseCode = HTTP_CODES.BAD_REQUEST;
        res.status(responseCode).json({ success: false, error: msg || "" });
    },

    METHOD_NOT_ALLOWED: (res, msg) => {
        res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json({ success: false, message: msg || "" });
    },

    MOVED_PERMANENTLY: (res, msg) => {
        res.status(HTTP_CODES.MOVED_PERMANENTLY).json({ success: false, message: msg || "" });
    },

    NOT_ACCEPTABLE: (res, msg) => {
        res.status(HTTP_CODES.NOT_ACCEPTABLE).json({ success: false, message: msg || "" });
    },

    NOT_FOUND: (res, msg) => {
        res.status(HTTP_CODES.NOT_FOUND).json({ success: false, message: msg || "" });
    },

    NO_CONTENT_FOUND: (res, msg) => {
        res.status(HTTP_CODES.NO_CONTENT_FOUND).json({ success: false, message: msg || "" });
    },

    OK: (res, msg, payload) => {
        res.status(HTTP_CODES.OK).json({
            success: true,
            messages: msg || "",
            payload: payload || {},
        });
    },

    PERMANENT_REDIRECT: (res, msg) => {
        res.status(HTTP_CODES.PERMANENT_REDIRECT).json({ success: false, message: msg || "" });
    },

    UNAUTHORIZED: (res, msg) => {
        res.status(HTTP_CODES.UNAUTHORIZED).json({ success: false, message: msg || "" });
    },

    UPGRADE_REQUIRED: (res, msg) => {
        res.status(HTTP_CODES.UPGRADE_REQUIRED).json({ success: false, message: msg || "" });
    },

    VALIDATION_ERROR: (res, msg) => {
        res.status(HTTP_CODES.VALIDATION_ERROR).json({ success: false, message: msg || "" });
    },
}