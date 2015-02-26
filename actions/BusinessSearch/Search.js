'use strict';

var BusinessSearchEvents = require('../../constants/BusinessSearchConstants').Events;
var lodash = require('lodash-contrib');

module.exports = function (context, payload, done) {
    var queryParams = payload.query;
    var queryString = lodash.toQuery(queryParams);

    context.dispatch(BusinessSearchEvents.SEARCH, {
        queryString: queryString
    });

    context
        .getHairfieApi()
        .search(queryParams)
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