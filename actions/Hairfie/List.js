'use strict';

var HairfieEvents = require('../../constants/HairfieConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(HairfieEvents.LIST);
    context
        .getHairfieApi()
        .listLatestByBusiness(payload.businessId, payload.limit, payload.skip)
        .then(function (hairfies) {
            context.dispatch(HairfieEvents.LIST_SUCCESS, {
                limit   : payload.limit,
                offset  : payload.offset,
                hairfies: hairfies
            });
            done();
        })
        .catch(function () {
            context.dispatch(HairfieEvents.LIST_FAILURE);
            done();
        })
    ;
};
