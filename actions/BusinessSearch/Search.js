'use strict';

var BusinessSearchEvents = require('../../constants/BusinessSearchConstants').Events;
var toQueryString = require('../../lib/queryString.js');

module.exports = function (context, payload, done) {
    var query = payload.query;
    var queryString = toQueryString(query);

    context.dispatch(BusinessSearchEvents.SEARCH, {
        queryString: queryString
    });

    context
        .getHairfieApi()
        .search(query.query, query.isGeoipable)
        .then(function (businesses) {
            context.dispatch(BusinessSearchEvents.SEARCH_SUCCESS, {
                businesses: businesses,
                queryString: queryString
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(BusinessSearchEvents.SEARCH_FAILURE, {
                queryString: queryString
            });
            done(error);
        });
};