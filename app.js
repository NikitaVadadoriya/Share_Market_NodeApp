const createError = require('http-errors');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const { configurteMiddleware } = require('./middleware/index');
const configureRoutes = require('./routes/index');
const config = require('./config');

require("./models/index");
var app = express();

/* Config Express-Middleware */
configurteMiddleware(app);

/* Set-up static asset path */
app.use(express.static(path.join(__dirname, 'public')));

/* Set-up Routes */
configureRoutes(app);

/* Start server and listen for connections */
const server = app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}...`);
});

/*  Handle real-time chart data with socket.io */
global.io = socketio(server);

io.on('connection', (socket) => {
  console.log("User Connectiopn...");
  // shareSocket.init(io)
  socket.on('disconnect', () => {
    console.log('User disconnected ....');
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
