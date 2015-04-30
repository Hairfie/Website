'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadBusinessServices: function (context, payload) {
        var businessId = payload.businessId;

        return context.hairfieApi
            .get('/businessServices?filter[where][businessId]='+businessId)
            .then(function (services) {
                context.dispatch(Actions.RECEIVE_BUSINESS_SERVICES, services);
            });
    }
};
