'use strict';

var _ = require('lodash');
var StationEvents = require('../../constants/StationConstants').Events;

module.exports = function FetchForBusiness(context, payload, done) {
    var done = done || _.noop();

    context
        .getHairfieApi()
        .getStations(payload.location)
        .then(function (stations) {
            context.dispatch(StationEvents.FETCH_FOR_BUSINESS_SUCCESS, {
                stations   : stations,
                businessId : payload.businessId
            });
            done();
        })
        .fail(done);
};