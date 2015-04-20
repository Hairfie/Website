'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var _ = require('lodash');

module.exports = function (context, payload, done) {
    var done = done || _.noop;

    context.dispatch(BusinessEvents.FETCH_SEARCH_RESULT, {
        search: payload.search
    });

    var apiQuery = {facetFilters: {}, price: {}};
    apiQuery.pageSize = 10;
    if (payload.search.bounds) apiQuery.bounds = payload.search.bounds;
    if (payload.search.location) apiQuery.location = payload.search.location;
    if (payload.search.radius) apiQuery.radius = payload.search.radius;
    if (payload.search.q) apiQuery.query = payload.search.q;
    if (payload.search.categories) apiQuery.facetFilters.categories = payload.search.categories;
    if (payload.search.page) apiQuery.page = payload.search.page;
    if (payload.search.priceMin) apiQuery.price.min = payload.search.priceMin;
    if (payload.search.priceMax) apiQuery.price.max = payload.search.priceMax;

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
