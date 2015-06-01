'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadTopDeals: function (context, payload) {
        return context.hairfieApi
            .get('/tops/deals', { query: { limit: 3 }})
            .then(function (deals) {
                context.dispatch(Actions.RECEIVE_TOP_DEALS, deals);
            });
    }
};