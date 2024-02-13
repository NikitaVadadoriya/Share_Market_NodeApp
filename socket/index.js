const config = require('../config');
const { SOCKET_MESSAGE, RES_MESSAGE } = require('../json/message.json');
const axios = require('axios');
const { format } = require('date-fns');

const intraDayChartData = async (symbol) => {
  setInterval(async () => {
    //IntraDay Chart Data
    intradayChartSocketIO(symbol);
  }, 300000);
}

/* IntraDay Chart Api Data */
const intradayChartSocketIO = (symbol) => {
  const intraDayList = [];
  let apiUrl = `https://financialmodelingprep.com/api/v3/historical-chart/5min/${symbol}?apikey=${config.API_KEY}`

  axios.get(apiUrl)
    .then(response => {
      if (response.data !== null) {
        let yesterDay = format(response.data[0].date, 'yyyy-MM-dd');
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();

        let intraDayChartDate = response.data.reverse();
        intraDayChartDate.map(item => {

          let itemDateFormat = format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss');
          let startDateFormat = format(new Date(`${yesterDay} ${hours}:${minutes}:${seconds}`), 'yyyy-MM-dd HH:mm:ss');
          let startDate = format(new Date(`${yesterDay} 09:30:00`), 'yyyy-MM-dd HH:mm:ss');
          let endDateFormat = format(new Date(yesterDay + " 15:55:00"), 'yyyy-MM-dd HH:mm:ss');

          if (itemDateFormat >= startDate && itemDateFormat <= endDateFormat) {
            if (startDateFormat >= itemDateFormat) {
              intraDayList.push(item);
            }
          }
          io.emit(SOCKET_MESSAGE.INTRADAY_CHART_DATA, intraDayList.map(item => item.date));
        });
      }
      return intraDayList;
    })
    .catch(error => {
      console.log(RES_MESSAGE.INTRADAY_CHART_DATA_FETCH_ERROR, error.message);
      return error.message;
    });
}

module.exports = { intraDayChartData };