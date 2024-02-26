const jwt = require("jsonwebtoken");
const config = require('../config');
const { User_wallet } = global.models;
const { SOCKET_MESSAGE, RES_MESSAGE } = require('../json/message.json');
const { checkIfItemExistsById } = require('../utils/utils');
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

        setInterval(async () => {
          const walletData = await User_wallet.findOne({ where: { user_id: user, isDeleted: 0 } });
          await socket.emit(SOCKET_MESSAGE.FETCH_WALLET_DATA, {
            wallet: walletData
          });
        }, 10000)
      }
    });
  } catch (error) {
    console.log("Error in Wallet Amount Increment :~> ", error);
  }
}

module.exports = { init };