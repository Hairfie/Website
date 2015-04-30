'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadTopHairfies: function (context, payload) {
        return context.hairfieApi
            .get('/tops/hairfies', { query: { limit: payload.limit } })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_TOP_HAIRFIES, hairfies);
            });
    }
};
