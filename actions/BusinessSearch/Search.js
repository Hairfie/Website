'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessSearchEvents = require('../../constants/BusinessSearchConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessSearchEvents.SEARCH);

    hairfieApi
        .searchNearby(payload.params)
        .then(function (businesses) {
            context.dispatch(BusinessSearchEvents.SEARCH_SUCCESS, {
                businesses: businesses
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessSearchEvents.SEARCH_FAILURE);
            done(error);
        });
};