'use strict';

var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var SearchUtils = require('../lib/search-utils');
var _ = require('lodash');

module.exports = {
    loadSimilarBusinesses: function (context, payload) {
        var businessId = payload.businessId;
        var limit = payload.limit;

        return context.hairfieApi
            .get('/businesses/'+businessId+'/similar', { query: { limit: limit } })
            .then(function (businesses) {
                context.dispatch(Actions.RECEIVE_SIMILAR_BUSINESSES, { businessId: businessId, businesses: businesses });
            });
    },
    submitSearch: function (context, search) {
        var search = search;
        if (!search.address) {
            search = _.assign({}, search, { address: 'Paris, France' });
        }

        var params = SearchUtils.searchToRouteParams(search);

        return context.executeAction(NavigationActions.navigate, {
            route: 'business_search',
            params: params.path,
            query: params.query
        });
    },
    loadSearchResult: function (context, search) {
        var query = {};
        query.pageSize = 10;
        if (search.bounds) {
            query['bounds[northEast][lat]'] = search.bounds.northEast.lat;
            query['bounds[northEast][lng]'] = search.bounds.northEast.lng;
            query['bounds[southWest][lat]'] = search.bounds.southWest.lat;
            query['bounds[southWest][lng]'] = search.bounds.southWest.lng;
        }
        if (search.location) {
            query['location[lat]'] = search.location.lat;
            query['location[lng]'] = search.location.lng;
        }
        if (search.radius) query.radius = search.radius;
        if (search.q) query.query = search.q;
        if (search.page) query.page = search.page;
        if (search.priceMin) query['price[min]'] = search.priceMin;
        if (search.priceMax) query['price[max]'] = search.priceMax;
        if (search.withDiscount) query.withDiscount = search.withDiscount;

        _.forEach(search.categories, function (category, i) {
            query['facetFilters[categories]['+i+']'] = category;
        });

        return context.hairfieApi
            .get('/businesses/search', { query: query })
            .then(function (result) {
                context.dispatch(Actions.RECEIVE_BUSINESS_SEARCH_RESULT, {
                    search: search,
                    result: result
                });

                return result;
            });
    },
    loadBusinessCalendar: function(context, payload) {
        var query = {
            from: payload.from,
            until: payload.until
        };

        return context.hairfieApi
            .get("/business/" + payload.id + "/timeslots", query)
            .then(function(timeslots) {
                console.log(timeslots)
            });
    }
};
