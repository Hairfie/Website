'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var _ = require('lodash');

module.exports = function (context, payload, done) {
    var done = done || _.noop;

    context.dispatch(BusinessEvents.FETCH_SEARCH_RESULT, {
        search: payload.search
    });

    var apiQuery = {facetFilters: {}, price: {}};
    if (payload.search.bounds) apiQuery.bounds = payload.search.bounds;
    if (payload.search.location) apiQuery.location = payload.search.location;
    if (payload.search.radius) apiQuery.radius = payload.search.radius;
    if (payload.search.query) apiQuery.query = payload.search.query;
    if (payload.search.categories) apiQuery.facetFilters.categories = payload.search.categories;
    if (payload.search.page) apiQuery.page = payload.search.page;
    if ((payload.search.price || {}).min) apiQuery.price.min = payload.search.price.min;
    if ((payload.search.price || {}).max) apiQuery.price.max = payload.search.price.max;

    context
        .getHairfieApi()
        .getBusinessSearchResult(apiQuery)
        .then(function (result) {
            context.dispatch(BusinessEvents.FETCH_SEARCH_RESULT_SUCCESS, {
                search: payload.search,
                result: result
            });
            done();
        })
        .fail(function (error) {
            console.log(error);
            context.dispatch(BusinessEvents.FETCH_SEARCH_RESULT_FAILURE, {
                search: payload.search
            });
            done(error);
        });
};
