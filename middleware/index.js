const express = require('express');
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const configurteMiddleware = async (app) => {
    // view engine setup
    app.use(cors({ origin: "*" }));
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    global.__basedir = __dirname;
}

module.exports = { configurteMiddleware };