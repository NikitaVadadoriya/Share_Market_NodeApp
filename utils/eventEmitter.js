const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter();
const { where } = require('sequelize');
const model = require('../models');

/* Delete OTP After 10 Min */
eventEmitter.on("deleteOTP", (data) => {
    setTimeout(async () => {
        await model[data.model].update({ otp: null }, { where: { id: data.id } });
    }, 600000)
});

/* End Boost Amount Incriment After 30 Sec */
eventEmitter.on("End_Boost_Amount_Incriment", (data) => {
    setTimeout(async () => {
        /* 30 After Sec Call*/
        await model[data.model].update({ boost_status: 0, increment_amount: 1 }, { where: { user_id: data.id, isDeleted: 0 } });
    }, 30000);
});

/* Start Boost Amount Incriment */
eventEmitter.on("Start_Boost_Amount_Incriment", (data) => {
    setInterval(async () => {
        /* per 3 Sec Call*/
        await model[data.model].update({ boost_status: data.boost_status }, { where: { id: data.id } });
    }, 3000);
});

exports.myEmitter = eventEmitter;