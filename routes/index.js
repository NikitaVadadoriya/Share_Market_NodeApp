// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
const staticListRoute = require('./api/stock_list'); 
const companyInfoRoute = require('./api/company_info'); 
const chartInfoRoute = require('./api/ShareUpDownChartInfo'); 

const configureRoutes = async (app) => {

  /* app.use('/', (req, res) => {
    res.status(200).send('Welcome to Vintage Poker!');
  }); */
  app.use('/api/stock', staticListRoute);
  app.use('/api/stock/company', companyInfoRoute);
  app.use('/api/stock/chart', chartInfoRoute);
}

module.exports = configureRoutes;
