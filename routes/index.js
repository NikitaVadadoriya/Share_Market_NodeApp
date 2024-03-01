const express = require('express');
const userInfoRoute = require('./api/user_info');
const walletRoute = require('./api/user_wallet');
const stockListRoute = require('./api/stock_list');
const buyShareRoute = require('./api/buyShare');
const companyInfoRoute = require('./api/company_info');
const chartInfoRoute = require('./api/ShareUpDownChartInfo');

const configureRoutes = async (app) => {
  // app.use(upload.array());
  app.get('/', (req, res) => {
    return res.sendFile("./public/index.html")
  })
  app.use("/api/upload", express.static("upload"));
  app.use('/api/user', userInfoRoute);
  app.use('/api/user/wallet', walletRoute);
  app.use('/api/stock', stockListRoute);
  app.use('/api/stock/', buyShareRoute);
  app.use('/api/stock/company', companyInfoRoute);
  app.use('/api/stock/chart', chartInfoRoute);
}

module.exports = configureRoutes;
