const createError = require('http-errors');
const express = require('express');
const socketio = require('socket.io');
require("./models/index");
const { configurteMiddleware } = require('./middleware/index');
const configureRoutes = require('./routes/index');
const config = require('./config');
const shareMarketSocket = require('./socket/index');

var app = express();

/* Config Express-Middleware */
configurteMiddleware(app);

/* Set-up static asset path */
app.use(express.static(__dirname + '/public')); 

/* Set-up Routes */
configureRoutes(app);

/* Start server and listen for connections */
const server = app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}...`);
});

/*  Handle real-time chart data with socket.io */
global.io = socketio(server);

io.on('connection', (socket) => {
  shareMarketSocket.init(socket, io)
});
// console.log("~~~  ~~~");
// io.on('connection', (socket) => {
//   console.log("User Connectiopn...");
//   // shareSocket.init(io)
//   socket.on('disconnect', () => {
//     console.log('User disconnected ....');
//   });
// });

// Error handling - close server
process.on('unhandledRejection', (err) => {
  // db.disconnect();

  console.error(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
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
