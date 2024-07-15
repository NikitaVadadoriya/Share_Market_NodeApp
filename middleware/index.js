const express = require('express');
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const coreConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}

const configurteMiddleware = async (app) => {
    // view engine setup
    app.options("", cors(coreConfig))
    app.use(cors(coreConfig));
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    // global.__basedir = __dirname;
}

module.exports = { configurteMiddleware };