'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'HairfieStore',
    handlers: makeHandlers({
        onReceiveHairfie: Actions.RECEIVE_HAIRFIE,
        onReceiveTopHairfies: Actions.RECEIVE_TOP_HAIRFIES,
        onReceiveBusinessTopHairfies: Actions.RECEIVE_BUSINESS_TOP_HAIRFIES,
        onReceiveHairfieSearchResult: Actions.RECEIVE_HAIRFIE_SEARCH_RESULT
    }),
    initialize: function () {
        this.hairfies = {};
        this.topIds = [];
        this.businessTopIds = {};
        this.searchResults = {};
    },
    dehydrate: function () {
        return {
            hairfies: this.hairfies,
            topIds: this.topIds,
            businessTopIds: this.businessTopIds,
            searchResults: this.searchResults
        };
    },
    rehydrate: function (state) {
        this.hairfies = state.hairfies;
        this.topIds = state.topIds;
        this.businessTopIds = state.businessTopIds;
        this.searchResults = state.searchResults;
    },
    onReceiveHairfie: function (hairfie) {
        this.hairfies[hairfie.id] = hairfie;
        this.emitChange();
    },
    onReceiveTopHairfies: function (hairfies) {
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(hairfies, 'id'));
        this.topIds = _.pluck(hairfies, 'id');
        this.emitChange();
    },
    onReceiveBusinessTopHairfies: function (payload) {
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(payload.hairfies, 'id'));
        this.businessTopIds[payload.businessId] = _.pluck(payload.hairfies, 'id');
        this.emitChange();
    },
    onReceiveHairfieSearchResult: function (payload) {
        var search = payload.search;
        var result = payload.result;
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(result.hits, 'id'));
        this.searchResults[searchKey(search)] = _.assign({}, result, { hits: _.pluck(result.hits, 'id') });
        this.emitChange();
    },
    getById: function (id) {
        return this.hairfies[id];
    },
    getTop: function () {
        return _.map(this.topIds, this.getById, this);
    },
    getBusinessTop: function (businessId) {
        return this.businessTopIds[businessId] && _.map(this.businessTopIds[businessId], this.getById, this);
    },
    getSearchResult: function (search) {
        var result = this.searchResults[searchKey(search)];

        if (result) {
            return _.assign({}, result, { hits: _.map(result.hits, this.getById, this) });
        }
    },
    _generateDescriptions: function(hairfie) {
        var descriptions, tags = '', oldDescription = '', businessName = '';
        if(hairfie.tags) {
            tags = _.map(hairfie.tags, function(tag) { return '#'+tag.name.replace(/ /g,''); }).join(" ");
        }
        if(hairfie.description) {
            oldDescription = ' ' + hairfie.description;
        }
        if(hairfie.business) {
            businessName = ' made at ' + hairfie.business.name;
        }
        descriptions = {
            twitter: encodeURIComponent(tags + oldDescription + businessName + ' #hairfie'),
            facebook: tags + oldDescription + businessName,
            display: tags + oldDescription
        };

        return descriptions;
    }
});

function searchKey(searchKey) { return JSON.stringify(searchKey); }
