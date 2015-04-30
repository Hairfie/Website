'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadStationsNearby: function (context, payload) {
        var location = payload.location || {};

        return context.hairfieApi
            .get('/stations', {query: {
                'location[lat]': location.lat,
                'location[lng]': location.lng
            }})
            .then(function (stations) {
                context.dispatch(Actions.RECEIVE_STATIONS_NEARBY, { location: location, stations: stations });
            });
    }
};
