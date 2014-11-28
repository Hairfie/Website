'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.OPEN);
    hairfieApi
        .getBusiness(payload.id)
        .then(function (business) {
            context.dispatch(BusinessEvents.OPEN_SUCCESS, {
                business: business
            });
            done();
        })
        .catch(function () {
            context.dispatch(BusinessEvents.OPEN_FAILURE);
            done();
        })
    ;
};
