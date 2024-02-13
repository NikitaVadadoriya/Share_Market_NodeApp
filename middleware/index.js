const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const config = require('../config');

const configurteMiddleware = async (app) => {
    // view engine setup
    app.use(express.static(path.resolve('./public')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
}

module.exports = {configurteMiddleware};