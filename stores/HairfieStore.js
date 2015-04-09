'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var HairfieEvents = require('../constants/HairfieConstants').Events;
var HairfieActions = require('../actions/Hairfie');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'HairfieStore',
    handlers: makeHandlers({
        handleReceiveSuccess: HairfieEvents.RECEIVE_SUCCESS,
        handleReceiveFailure: HairfieEvents.RECEIVE_FAILURE,
        handleFetchQuerySuccess: HairfieEvents.FETCH_QUERY_SUCCESS,
        handleFetchQueryFailure: HairfieEvents.FETCH_QUERY_FAILURE
    }),
    initialize: function () {
        this.hairfies = {};
        this.queries = {};
    },
    dehydrate: function () {
        return {
            hairfies: this.hairfies,
            queries: this.queries
        };
    },
    rehydrate: function (state) {
        this.hairfies = state.hairfies;
        this.queries = state.queries;
    },
    handleReceiveSuccess: function (payload) {
        var hairfie = payload.hairfie;
        if (hairfie) hairfie.descriptions = this._generateDescriptions(hairfie);

        this.hairfies[payload.id] = _.assign({}, this.hairfies[payload.id], {
            entity  : hairfie,
            loading : false
        });

        this.emitChange();
    },
    handleReceiveFailure: function (payload) {
        this.hairfies[payload.id] = _.assign({}, this.hairfies[payload.id], {
            loading: false
        });

        this.emitChange();
    },
    getById: function (hairfieId) {
        var hairfie = this.hairfies[hairfieId];

        if (_.isUndefined(hairfie)) {
            this._fetchById(hairfieId);
        }

        return hairfie && hairfie.entity;
    },
    query: function (filter) {
        var key = this._queryKey(filter);
        var query = this.queries[key];
        if (_.isUndefined(query)) {
            this._fetchQuery(filter);
        }

        return query && query.results;
    },
    handleFetchQuerySuccess: function (payload) {
        var key = this._queryKey(payload.filter);
        this.queries[key] = _.assign({}, this.queries[key], {
            loading: false,
            results: payload.hairfies
        });
        this.emitChange();
    },
    handleFetchQueryFailure: function (payload) {
        var key = this._queryKey(payload.filter);
        this.queries[key] = _.assign({}, this.queries[key], {
            loading: false
        });
        this.emitChange();
    },
    _fetchById: function (hairfieId) {
        this.hairfies[hairfieId] = _.assign({}, this.hairfies[hairfieId], {loading: true });
        this.dispatcher.getContext().executeAction(HairfieActions.Fetch, {
            id: hairfieId
        });
    },
    _fetchQuery: function (filter) {
        var key = this._queryKey(filter);
        this.queries[key] = _.assign({}, this.queries[key], {loading: true});
        this.dispatcher.getContext().executeAction(HairfieActions.FetchQuery, {
            filter: filter
        });
    },
    _queryKey: function (filter) {
        return JSON.stringify(filter);
    },
    // Is this the right place ?
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
