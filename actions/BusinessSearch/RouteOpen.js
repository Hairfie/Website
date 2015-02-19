'use strict';

var BusinessSearchEvents = require('../../constants/BusinessSearchConstants').Events;

module.exports = function (context, payload, done) {
    var params = payload.query;

    context.dispatch(BusinessSearchEvents.SEARCH, {
        queryParams: params
    });

    context
        .getHairfieApi()
        .search(params.query, params.isGeoipable)
        .then(function (businesses) {
            context.dispatch(BusinessSearchEvents.SEARCH_SUCCESS, {
                businesses: businesses,
                queryParams: params
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessSearchEvents.SEARCH_FAILURE);
            done(error);
        });
    //done();
};