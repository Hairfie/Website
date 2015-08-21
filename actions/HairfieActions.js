'use strict';

var Actions = require('../constants/Actions');
var _ = require('lodash');
var NavigationActions = require('./NavigationActions');
var SearchUtils = require('../lib/search-utils');
var Promise = require('q');

module.exports = {
    loadTopHairfies: function (context, params) {
        return context.hairfieApi
            .get('/tops/hairfies', { query: { limit: 5 } })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_TOP_HAIRFIES, hairfies);
            });
    },
    loadHairfie: function (context, id) {
        return context.hairfieApi
            .get('/hairfies/'+id)
            .then(function (hairfie) {
                context.dispatch(Actions.RECEIVE_HAIRFIE, hairfie);
                return hairfie;
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
        var params = _.merge({}, { page: 1, pageSize: 12 }, params);
        var query = {
            'filter[where][businessId]': params.businessId,
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (params.page - 1) * params.pageSize,
            'filter[limit]': params.pageSize + (params.add || 0)
        };

        return  context.hairfieApi
            .get('/hairfies', { query: query })
            .then(function (hairfies) {
                context.dispatch(Actions.RECEIVE_BUSINESS_HAIRFIES, {
                    businessId: params.businessId,
                    hairfies: hairfies
                });
            });
    },
    loadSimilarHairfies: function (context, params) {
        var params = _.merge({}, { page: 1, pageSize: 12 }, params);

        var query = {
            page: params.page,
            pageSize: params.pageSize + (params.add || 0)
        };
        _.forEach(params.hairfie.tags, function (tag, i) {
            query['tags['+i+']'] = tag.name;
        });

        return  context.hairfieApi
            .get('/hairfies/similar-hairfies', { query: query })
            .then(function (hairfies) {
                var hairfiesId = _.map(hairfies, function(hairfie) {
                    return hairfie.id;
                });
                context.dispatch(Actions.RECEIVE_SIMILAR_HAIRFIES, {
                    hairfieId: params.hairfie.id,
                    hairfies: hairfies,
                    hairfiePage: params.page
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

        _.forEach(search.tags, function (tag, i) {
            query['tags['+i+']'] = tag;
        });
        if (search.priceMin) query.priceMin = search.priceMin;
        if (search.priceMax) query.priceMax = search.priceMax;

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
