const config = require('../config');
const { SOCKET_MESSAGE, RES_MESSAGE } = require('../json/message.json');
const axios = require('axios');
const { format } = require('date-fns');

/* socketIO Chart Data */
// const socketIOChartData = async (symbol) => {
//   setInterval(async () => {
//     //IntraDay Chart Data
//     intradayChartSocketIO(symbol);

//   }, 300000);// 5 min

//   setInterval(async () => {
//     // Company stock info Api
//     companyShareInfo(symbol);
//     marketCapitalization(symbol);
    
//   }, 60000); // 1 min
// }

/* IntraDay Chart Api Data */
// const intradayChartSocketIO = async (symbol) => {
//   const intraDayList = [];
//   let apiUrl = `https://financialmodelingprep.com/api/v3/historical-chart/5min/${symbol}?apikey=${config.API_KEY}`

//   axios.get(apiUrl)
//     .then(response => {
//       if (response.data !== null) {
//         let yesterDay = format(response.data[0].date, 'yyyy-MM-dd');
//         const currentTime = new Date();
//         const hours = currentTime.getHours();
//         const minutes = currentTime.getMinutes();
//         const seconds = currentTime.getSeconds();

//         let intraDayChartDate = response.data.reverse();
//         intraDayChartDate.map(item => {

//           let itemDateFormat = format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss');
//           let startDateFormat = format(new Date(`${yesterDay} ${hours}:${minutes}:${seconds}`), 'yyyy-MM-dd HH:mm:ss');
//           let startDate = format(new Date(`${yesterDay} 09:30:00`), 'yyyy-MM-dd HH:mm:ss');
//           let endDateFormat = format(new Date(yesterDay + " 15:55:00"), 'yyyy-MM-dd HH:mm:ss');

//           if (itemDateFormat >= startDate && itemDateFormat <= endDateFormat) {
//             if (startDateFormat >= itemDateFormat) {
//               intraDayList.push(item);
//             }
//           }
//           io.emit(SOCKET_MESSAGE.INTRADAY_CHART_DATA, intraDayList.map(item => item.date));
//         });
//       }
//       return intraDayList;
//     })
//     .catch(error => {
//       console.log(RES_MESSAGE.INTRADAY_CHART_DATA_FETCH_ERROR, error.message);
//       return error.message;
//     });
// }

/* Company Stock Information */
const companyShareInfo = async (symbol) => {
  let apiUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${config.API_KEY}`

  axios.get(apiUrl)
    .then(res => {
      io.emit(SOCKET_MESSAGE.COMPANY_INFO_CHART_DATA, res.data);
    })
    .catch(err => {
      console.log(RES_MESSAGE.COMPANY_INFO_FETCH_ERROR, err.message);
      return err.message;
    })
}

/* symbol list */
const marketCapitalization = (symbol) => {
  let apiUrl = `https://financialmodelingprep.com/api/v3/market-capitalization/${symbol}?apikey=${config.API_KEY}`

  axios.get(apiUrl)
    .then(res => {
      io.emit(SOCKET_MESSAGE.MARKET_CAPITALIZATION, res.data);
    })
    .catch(err => {
      console.log(RES_MESSAGE.MARKET_CAPITALIZATION_FETCH_ERROR, err.message);
      return err.message;
    })
}

module.exports = { socketIOChartData };