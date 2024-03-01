const jwt = require("jsonwebtoken");
const axios = require('axios');
const config = require('../config');
const { User_wallet, Buy_share } = global.models;
const { SOCKET_MESSAGE, RES_MESSAGE } = require('../json/message.json');
const { checkIfItemExistsById } = require('../utils/utils');
const { format } = require('date-fns');
const eventEmitter = require('../utils/eventEmitter').myEmitter;

function createWallet(user) {
  return {
    user_id: user,
    current_balance: 0,
    increment_amount: 1,
    current_level: 1,
    next_level_amount: 1800,
  };
}

async function updateNewLevel(walletInfo) {
  let currentLevel = parseInt(walletInfo.current_level) + parseInt(1);
  let nextLevelAmount = parseFloat(walletInfo.next_level_amount) + parseFloat(1000);
  let currentBalance = parseFloat(walletInfo.current_balance) - parseFloat(walletInfo.next_level_amount);
  await User_wallet.update({ current_level: currentLevel, current_balance: currentBalance, next_level_amount: nextLevelAmount }, { where: { id: walletInfo.id } });
}

/* Stock Price Up Down */
async function priceUpDown(symbol) {
  let count = 100;
  const symbolArray = [];
  symbol.map(async (item, i) => {
    if (i <= count) {
      symbolArray.push(item);
    }
    if (i == count) {
      let resultString = symbolArray.join(',');

      const apiUrl = `https://financialmodelingprep.com/api/v3/quote/${resultString}?apikey=${config.API_KEY}`;
      let { res, err } = await loadApi(apiUrl);
      if (res) {
        count = count + 100;
        symbolArray.length = 0;
        io.emit(SOCKET_MESSAGE.SYMBOL_UP_DOWN, res);
      } else {
        count = count + 100;
        symbolArray.length = 0;
        console.log(RES_MESSAGE.STOCK_LIST_FETCH_ERROR, "=>", err.message);
      }
      /* await axios.get(apiUrl)
        .then(response => {
          console.log("~~ Res ~~", response.data);
          count = count + 100;
          symbolArray.length = 0;
          io.emit(SOCKET_MESSAGE.SYMBOL_UP_DOWN, response.data.map(item => item));
          // return apiRes.OK(res, RES_MESSAGE.STOCK_LIST_FETCH, symbol_list);
        })
        .catch(error => {
          count = count + 100;
          symbolArray.length = 0;
          console.log(RES_MESSAGE.STOCK_LIST_FETCH_ERROR, "=>", error.message);
          // return apiRes.CATCH_ERROR(res, error.message);
        }) */
    }
  })
}

async function fetchStockPrice(myShare) {
  let count = 100;
  let symbolArray = [];
  let resultString;
  let totalPrice = 0;
  let change = 0;
  let todayUpDown = 0;

  setInterval(async () => {
    myShare.map(async (item, i) => {
      item.symbol_name
      if (i <= count) {
        symbolArray.push(item.symbol_name);
        resultString = symbolArray.join(',');
      }
    });
    const apiUrl = `https://financialmodelingprep.com/api/v3/quote/${resultString}?apikey=${config.API_KEY}`;
    let { res, err } = await loadApi(apiUrl);

    if (res) {
      res.map(stock => {
        totalPrice += parseFloat(stock.price);
        change += parseFloat(stock.change);
        todayUpDown += parseFloat(stock.changesPercentage)
      });
      io.emit(SOCKET_MESSAGE.FETCH_MY_STOCK_PORTFOLIO, { valueOfStock: totalPrice, changes: change, todayUpDown: todayUpDown });
    } else {
      console.log("~~>", err.message);
    }
  }, 10000);
}

async function loadApi(url) {
  return await axios.get(url)
    .then(async (response) => {
      return await { res: response.data };
    })
    .catch(async (error) => {
      return await { err: error };
    });
}

const init = (socket, io) => {
  try {
    /* Wallet Amount Increment */
    socket.on(SOCKET_MESSAGE.ADD_AMOUNT_IN_WALLET, async (item) => {
      let user;

      /* Verify the token using jwt.verify method */
      await jwt.verify(item.token, config.JWT_SECRET, (error, decode) => {
        if (error) console.log("~~ ERROR IN VERIFY TOKEN ~~", error);
        user = decode.user_id;
      });

      if (user) {
        setInterval(async () => {
          /* check if wallet created or not created */
          if (!await checkIfItemExistsById({ user_id: user, isDeleted: 0 }, "user_wallet")) {
            await User_wallet.create(createWallet(user));
          }
          const walletInfo = await User_wallet.findOne({ where: { user_id: user, isDeleted: 0 } });

          /* Not Boost Data */
          if (item.boostStatus == 0) {
            /* check New Level */
            if (parseFloat(walletInfo.next_level_amount) <= parseFloat(walletInfo.current_balance)) {
              console.log(":~> Next Level Update <~:");
              updateNewLevel(walletInfo);
            } else {
              console.log(":~> Add Wallet Balance <~:");
              await User_wallet.update({ current_balance: parseFloat(walletInfo.current_balance) + parseFloat(walletInfo.increment_amount) }, { where: { id: walletInfo.id } });
            }
          } else {
            /* Boost Data */
            if (parseFloat(walletInfo.next_level_amount) <= parseFloat(walletInfo.current_balance)) {
              console.log(":~> Next Level Update <~:");
              updateNewLevel(walletInfo);
            } else {
              const boostAmount = Math.random() * (1 - 15) + 15;
              await User_wallet.update({ boost_status: 1, increment_amount: boostAmount }, { where: { user_id: user, isDeleted: 0 } });
            }
            /* End Boost Amount Incriment After 30 Sec */
            eventEmitter.emit("End_Boost_Amount_Incriment", { model: 'user_wallet', id: user });
          }

          const walletData = await User_wallet.findOne({ where: { user_id: user, isDeleted: 0 } });
          if (walletData) {
            await socket.emit(SOCKET_MESSAGE.FETCH_WALLET_DATA, {
              wallet: walletData
            });
          }
        }, 2000);
      }
    });

    /* Get Stock List */
    socket.on(SOCKET_MESSAGE.SYMBOL_LIST, async (item) => {
      try {
        let symbol_list = [];
        let symbolName = [];
        setInterval(async () => {
          const apiUrl = `https://financialmodelingprep.com/api/v3/stock/list?apikey=${config.API_KEY}`;
          let { res, err } = await loadApi(apiUrl);

          if (res) {
            res.map(async item => {
              item.logo = config.COMPANY_LOGO_URL + item.symbol + '.png';
              symbol_list.push(item);
              symbolName.push(item.symbol);
            });

            io.emit(SOCKET_MESSAGE.FETCH_SYMBOL_LIST, symbol_list);
            // setInterval(async () => {
            // await priceUpDown(symbolName);
            // }, 60000);// 2 min
          } else {
            console.log("Load Api Data Err :~>", err.message);
          }
        }, 10000);// 10 sec
      } catch (error) {
        console.log("Error in Symbol List :~>", error.message);
      }
    });

    /* IntraDay Chart Data fetch */
    socket.on(SOCKET_MESSAGE.INTRADAY_CHART_DATA, async (item) => {
      setInterval(async () => {

        let apiUrl = `https://financialmodelingprep.com/api/v3/historical-chart/5min/${item.symbol}?apikey=${config.API_KEY}`
        let { res, err } = await loadApi(apiUrl);
        const intraDayList = [];

        if (res) {
          let yesterDay = format(res[0].date, 'yyyy-MM-dd');
          const currentTime = new Date();
          const hours = currentTime.getHours();
          const minutes = currentTime.getMinutes();
          const seconds = currentTime.getSeconds();

          let intraDayChartDate = res.reverse();
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
          });
          //IntraDay Chart Data
          if (intraDayList) {
            io.emit(SOCKET_MESSAGE.FETCH_INTRADAY_CHART_DATA, intraDayList);
          }
        } else {
          console.log("Error in Fetch Intraday Chart Data :~>", err);
        }
      }, 60000); //1 min
    });

    /* Company Stock Information data fetch */
    socket.on(SOCKET_MESSAGE.COMPANY_INFO, async (item) => {
      setInterval(async () => {
        let apiUrl = `https://financialmodelingprep.com/api/v3/profile/${item.symbol}?apikey=${config.API_KEY}`
        let { res, err } = await loadApi(apiUrl);
        if (res) {
          io.emit(SOCKET_MESSAGE.FETCH_COMPANY_INFO, res);
        } else {
          console.log("Error in Fetch Company Data :~>", err);
        }
      }, 10000);
    });

    /* market-capitalization data fetch */
    socket.on(SOCKET_MESSAGE.MARKET_CAPITALIZATION, async (item) => {
      setInterval(async () => {
        let apiUrl = `https://financialmodelingprep.com/api/v3/market-capitalization/${item.symbol}?apikey=${config.API_KEY}`
        let { res, err } = await loadApi(apiUrl);
        if (res) {
          console.log("~ Symbol ~>", res);
          io.emit(SOCKET_MESSAGE.FETCH_MARKET_CAPITALIZATION, res);
        } else {
          console.log("Error in Fetch Company Data :~>", err);
        }
      }, 10000);
    });

    /* My Stock Portfolio */
    socket.on(SOCKET_MESSAGE.MY_STOCK_PORTFOLIO, async (item) => {
      let user;
      /* Verify the token using jwt.verify method */
      await jwt.verify(item.token, config.JWT_SECRET, (error, decode) => {
        if (error) console.log("~~ ERROR IN VERIFY TOKEN ~~", error);
        user = decode.user_id;
      });
      setInterval(async () => {
        if (user) {
          let totalStockValue = 0;
          const myShare = await Buy_share.findAll({ where: { user_id: user, status: 0 } });
          if (!myShare) totalStockValue = 0.00;

          await fetchStockPrice(myShare);
        }
      }, 10000);
    });
  } catch (error) {
    console.log("Error in Socket Catch :~>", error);
  }
}

module.exports = { init };