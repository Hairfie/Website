'use strict';

var Actions = require('../constants/Actions');
var _ = require('lodash');
var NavigationActions = require('./NavigationActions');
var SearchUtils = require('../lib/search-utils');

module.exports = {
    loadTopHairfies: function (context, params) {
        return context.hairfieApi
            .get('/tops/hairfies', { query: { limit: params.limit } })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_TOP_HAIRFIES, hairfies);
            });
    },
    loadHairfie: function (context, id) {
        return context.hairfieApi
            .get('/hairfies/'+id)
            .then(function (hairfie) {
                context.dispatch(Actions.RECEIVE_HAIRFIE, hairfie);
            });
    },
    loadBusinessTopHairfies: function (context, businessId) {
        var query = {
            'filter[where][businessId]': businessId,
            'filter[order]': 'createdAt DESC',
            'filter[limit]': 10
        };

        return context.hairfieApi
            .get('/hairfies', { query: query })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_BUSINESS_TOP_HAIRFIES, {
                    businessId: businessId,
                    hairfies: hairfies
                });
            });
    },
    loadBusinessHairfies: function (context, params) {
        var params = _.merge({}, { page: 1, pageSize: 6 }, params);

        var query = {
            'filter[where][businessId]': params.businessId,
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (params.page - 1) * params.pageSize,
            'filter[limit]': params.pageSize
        };

        if (params.since) {
            query['filter[createdAt][lte]'] = params.since;
        }

        context.dispatch(Actions.RECEIVE_BUSINESS_HAIRFIES_START, { businessId: params.businessId });

        return  context.hairfieApi
            .get('/hairfies', { query: query })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_BUSINESS_HAIRFIES_SUCCESS, {
                    businessId: params.businessId
                });
            });
    },
    submitSearch: function (context, search) {
        var search = _.merge({ address: 'Paris, France' }, search);
        var params = SearchUtils.searchToRouteParams(search);

        return context.executeAction(NavigationActions.navigate, {
            route: 'hairfie_search',
            params: params.path,
            query: params.query
        });
    },
    loadSearchResult: function (context, search) {
        var query = { pageSize: 12 };
        query.page = search.page;
        if (search.location) {
            query.location = [
                search.location.lat,
                search.location.lng
            ].join(',');
            query.radius = search.radius;
        }
        if (search.bounds) {
            query.bounds = [
                search.bounds.southWest.lat,
                search.bounds.southWest.lng,
                search.bounds.northEast.lat,
                search.bounds.northEast.lng
            ].join(',');
        }
        _.forEach(search.categories, function (category, i) {
            query['categories['+i+']'] = category;
        });
        if (search.priceMin) query.priceMin = search.priceMin;
        if (search.priceMax) query.priceMin = search.priceMax;

        return context.hairfieApi
            .get('/hairfies/search', { query: query })
            .then(function (result) {
                context.dispatch(Actions.RECEIVE_HAIRFIE_SEARCH_RESULT, {
                    search: search,
                    result: result
                });
            });
    }
};
