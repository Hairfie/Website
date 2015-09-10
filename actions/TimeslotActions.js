'use strict';

var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = {
    loadBusinessTimeslots: function(context, payload) {
        var query = {
            from: payload.from,
            until: payload.until
        };

        return context.hairfieApi
            .get("/businesses/" + payload.id + "/timeslots", {query: query})
            .then(function(timeslots) {
                context.dispatch(Actions.RECEIVE_BUSINESS_TIMESLOTS, {
                    id: payload.id,
                    timeslots: timeslots
                });
            });
    }
};