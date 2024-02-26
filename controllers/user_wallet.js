const config = require('../config');
const { RES_MESSAGE } = require('../json/message.json');
const apiRes = require('../utils/apiResponse');
const { User_wallet } = global.models;
const { checkIfItemExistsById } = require('../utils/utils');

module.exports = {

    // @route   POST /api/user/wallet
    // @desc    create Wallet
    // @access  Public
    createWallet: async (req, res) => {
        try {
            let { user_id } = req.body;

            const userItem = await checkIfItemExistsById({ id: user_id }, "user_info");
            if (!userItem) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);

            req.body.next_level_amount = config.NEXT_LEVEL_AMOUNT;
            await User_wallet.create(req.body);

            return apiRes.OK(res, RES_MESSAGE.WALLETE_CREATE);
        } catch (error) {
            console.log(RES_MESSAGE.WALLETE_CREATE_ERROR, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route   PUT /api/user/wallet
    // @desc    update Wallet
    // @access  Public
    updateWallet: async (req, res) => {
        try {
            let { user_id } = req.body;

            const userItem = await checkIfItemExistsById({ id: user_id }, "user_info");
            if (!userItem) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);

            // req.body.next_level_amount = config.NEXT_LEVEL_AMOUNT;
            await User_wallet.update(req.body, { where: { user_id: user_id } });
            // io.emit(SOCKET_MESSAGE.SYMBOL_LIST, symbol_list.map(item => item));


            return apiRes.OK(res, RES_MESSAGE.WALLETE_CREATE);
        } catch (error) {
            console.log(RES_MESSAGE.WALLETE_CREATE_ERROR, error);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    }
}
