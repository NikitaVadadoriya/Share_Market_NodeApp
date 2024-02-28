const Joi = require("joi");
const apiRes = require("../utils/apiResponse");
const { RES_MESSAGE } = require("../json/message.json");
const { checkIfItemExistsById } = require("../utils/utils");
const { User_info, User_wallet, Buy_share, Share_transactions } = global.models;

async function checkShareRePurchase(body) {
    try {
        let { quantityTotal, priceTotal } = 0;
        const buyShareInfo = await Buy_share.findOne({ where: { symbol_name: body.symbol_name } });

        if (!buyShareInfo) {
            /* New Purchase */
            quantityTotal = parseInt(body.share_quantity);
            // priceTotal = parseFloat(body.share_price) * quantityTotal;
            await Buy_share.create({ user_id: body.user_id, symbol_name: body.symbol_name, share_full_name: body.share_full_name, share_quantity: quantityTotal, share_price: body.share_price });
            console.log("New Share Purchase :~~>");
        } else {
            /* RePurchase */
            quantityTotal = parseInt(body.share_quantity) + parseInt(buyShareInfo.share_quantity);
            // priceTotal = (body.share_quantity * parseFloat(body.share_price) + parseFloat(buyShareInfo.share_price));
            await Buy_share.update({ share_quantity: quantityTotal, share_price: body.share_price, status: 0 }, { where: { id: buyShareInfo.id, status: 0 } });
            console.log("Share RePurchase :~~>");
        }
    } catch (error) {
        console.log("ERROR :~>", error);
    }
}
async function shareTransactions(body, type) {
    return await {
        user_id: body.user_id,
        symbol_name: body.symbol_name,
        transaction_type: type, /* type = Buy & Sell */
        quantity: body.share_quantity,
        share_price: body.share_price
    }
}

module.exports = {
    /*joi validation*/
    buyShareJoiValidation: Joi.object().keys({
        user_id: Joi.number().required(),
        // wallet_id: Joi.number().required(),
        symbol_name: Joi.string().required(),
        share_full_name: Joi.string().required(),
        share_quantity: Joi.number().required(),
        share_price: Joi.number().required()
    }),

    // @route   GET /api/stock/buy
    // @desc    get All buy share
    // @access  Public
    getMyShare: async (req, res) => {
        try {
            let { page, limit, sortBy, sortOrder, isAll, ...query } = req.query;
            query = isAll === "true" ? { ...query } : { status: 0, ...query }

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 1000;
            sortBy = sortBy || "createdAt";
            sortOrder = sortOrder || "DESC";
            let skip = (page - 1) * limit;

            const { count, rows } = await Buy_share.findAndCountAll({
                where: { ...query },
                order: [[sortBy, sortOrder]],
                limit: limit,
                offset: skip,
                raw: true,
            });

            return apiRes.OK(res, RES_MESSAGE.PURCHASE_SHARE_FETCH,
                {
                    count: count,
                    BuyTotalShare: rows
                });
        } catch (error) {
            console.log(RES_MESSAGE.PURCHASE_SHARE_ERROR_FETCH, "~>", error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route   POST /api/stock/buy
    // @desc    buy share
    // @access  Public
    buyShare: async (req, res) => {
        try {
            let { user_id, share_price, share_quantity } = req.body;

            const userInfo = await User_info.findOne({ where: { id: user_id } });
            if (!userInfo) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);
            const walletInfo = await User_wallet.findOne({ where: { user_id: userInfo.id, isDeleted: 0 } });

            let shareTotalPrices = parseFloat(share_price) * parseFloat(share_quantity);
            if (walletInfo.current_balance > shareTotalPrices) {
                /* New Share Purchase  */
                checkShareRePurchase(req.body);

                await User_wallet.update({ current_balance: parseFloat(walletInfo.current_balance) - parseFloat(shareTotalPrices) }, { where: { user_id: req.body.user_id } });
                await Share_transactions.create(await shareTransactions(req.body, "Buy"));
                return apiRes.OK(res, RES_MESSAGE.SHARE_PURCHASE);
            } else {
                console.log("Error: Wallet balance is not valid. Please check your balance.");
                return apiRes.OK(res, RES_MESSAGE.WALLETE_NOT_AVAILABLE_BALANCE);
            }

        } catch (error) {
            console.log(RES_MESSAGE.SHARE_PURCHASE_ERROR, "~>", error.message);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    },

    // @route   POST /api/stock/sell
    // @desc    sell share
    // @access  Public
    sellShare: async (req, res) => {
        try {
            let { user_id, share_price, share_quantity } = req.body;
            let { quantityTotal } = 0;
            const userInfo = await User_info.findOne({ where: { id: user_id } });
            if (!userInfo) return apiRes.NOT_FOUND(res, RES_MESSAGE.USERINFO_NOT_FOUND);
            const walletInfo = await User_wallet.findOne({ where: { user_id: userInfo.id, isDeleted: 0 } });
            const buyShare = await Buy_share.findOne({ where: { user_id: userInfo.id, symbol_name: req.body.symbol_name } });

            if (share_quantity <= buyShare.share_quantity) {

                let sellTotalSharePrice = parseFloat(share_quantity) * parseFloat(share_price);
                let totalWalletBalance = parseFloat(walletInfo.current_balance) + parseFloat(sellTotalSharePrice);
                quantityTotal = parseInt(buyShare.share_quantity) - parseInt(share_quantity);
                if (quantityTotal === 0) {
                    await Buy_share.update({ share_quantity: quantityTotal, status: 1 }, { where: { id: buyShare.id } });
                } else {
                    await Buy_share.update({ share_quantity: quantityTotal, status: 0 }, { where: { id: buyShare.id } });
                }
                await Share_transactions.create(await shareTransactions(req.body, "Sell"))
                await User_wallet.update({ current_balance: totalWalletBalance }, { where: { id: walletInfo.id, isDeleted: 0 } });
                return apiRes.OK(res, RES_MESSAGE.SELL_SHARE);
            } else {
                return apiRes.BAD_REQUEST(res, RES_MESSAGE.SELL_SHARE_QUANTITY_NOT_VALIDE);
            }
        } catch (error) {
            console.log(RES_MESSAGE.SELL_SHARE_ERROR);
            return apiRes.CATCH_ERROR(res, error.message);
        }
    }
}