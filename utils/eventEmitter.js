const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter();
const model = require('../models');

/* Delete OTP After 10 Min */
eventEmitter.on("deleteOTP", (data) => {
    setTimeout(async () => {
        await model[data.model].update({ otp: null }, { where: { id: data.id } });
    }, 600000)
})

exports.myEmitter = eventEmitter;