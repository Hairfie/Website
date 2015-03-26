'use strict';

var _ = require('lodash');
var StationEvents = require('../../constants/StationConstants').Events;

module.exports = function FetchByLocation(context, payload, done) {
    var done = done || _.noop;

    context
        .getHairfieApi()
        .getStations(payload.location)
        .then(function (stations) {
            context.dispatch(StationEvents.FETCH_BY_LOCATION_SUCCESS, {
                location: payload.location,
                stations: stations,
            });
            done();
        })
        .fail(done);
};
