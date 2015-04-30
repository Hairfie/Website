'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadSimilarBusinesses: function (context, payload) {
        var businessId = payload.businessId;
        var limit = payload.limit;

        return context.hairfieApi
            .get('/businesses/'+businessId+'/similar', { query: { limit: limit } })
            .then(function (businesses) {
                context.dispatch(Actions.RECEIVE_SIMILAR_BUSINESSES, { businessId: businessId, businesses: businesses });
            });
    }
};
