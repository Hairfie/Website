'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');
var HairfieActions = require('../actions/HairfieActions');

var PAGE_SIZE = 12;

module.exports = createStore({
    storeName: 'HairfieStore',
    handlers: makeHandlers({
        onReceiveHairfie: Actions.RECEIVE_HAIRFIE,
        onReceiveTopHairfies: Actions.RECEIVE_TOP_HAIRFIES,
        onReceiveBusinessTopHairfies: Actions.RECEIVE_BUSINESS_TOP_HAIRFIES,
        onReceiveHairfieSearchResult: Actions.RECEIVE_HAIRFIE_SEARCH_RESULT,
        onReceiveBusinessHairfies: Actions.RECEIVE_BUSINESS_HAIRFIES,
        onReceiveUserHairfies: Actions.RECEIVE_USER_HAIRFIES,
        onReceiveUserLikes: Actions.RECEIVE_USER_LIKES,
        onReceiveHairdresserHairfie: Actions.RECEIVE_HAIRDRESSER_HAIRFIES,
        onReceiveSimilarHairfies: Actions.RECEIVE_SIMILAR_HAIRFIES
    }),
    initialize: function () {
        this.hairfies = {};
        this.userHairfies = {};
        this.userLikes = {};
        this.topIds = [];
        this.businessTopIds = {};
        this.searchResults = {};
    },
    dehydrate: function () {
        return {
            hairfies: this.hairfies,
            userHairfies: this.userHairfies,
            userLikes: this.userLikes,
            topIds: this.topIds,
            businessTopIds: this.businessTopIds,
            searchResults: this.searchResults
        };
    },
    rehydrate: function (state) {
        this.hairfies = state.hairfies;
        this.userHairfies = state.userHairfies;
        this.userLikes = state.userLikes;
        this.topIds = state.topIds;
        this.businessTopIds = state.businessTopIds;
        this.searchResults = state.searchResults;
    },
    onReceiveHairfie: function (hairfie) {
        if (_.isUndefined(this.hairfies[hairfie.id])) {
            this.hairfies[hairfie.id] = hairfie;
        }
        else {
            this.hairfies[hairfie.id] = _.assign(this.hairfies[hairfie.id], {}, hairfie);
        }
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
    onReceiveBusinessHairfies: function (payload) {
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(payload.hairfies, 'id'));
        this.emitChange();
    },
    onReceiveUserHairfies: function (payload) {
        this.userHairfies[payload.userId] = payload.hairfies;
        this.emitChange();
    },
    onReceiveUserLikes: function (payload) {
        if (_.isUndefined(this.userLikes[payload.userId]))
            this.userLikes[payload.userId] = new Array();
        _.map(payload.hairfies, function (obj) {
            this.userLikes[payload.userId].push(obj.hairfie.id);
            if (_.isUndefined(this.hairfies[obj.hairfie.id])
                this.hairfies[obj.hairfie.id] = obj.hairfie;
        }.bind(this));
        this.emitChange();
    },
    onReceiveSimilarHairfies: function(payload) {
        var arr = _.map(payload.hairfies, function(hairfie) {
            if (payload.hairfieId != hairfie.id && _.isUndefined(this.hairfies[hairfie.id])) {
                this.hairfies[hairfie.id] = hairfie;
            }
            return hairfie.id;
        }.bind(this));
        if (this.hairfies[payload.hairfieId]) {
            if (_.isArray(this.hairfies[payload.hairfieId].similarHairfies)) {
                _.map(arr, function(val) {
                    this.hairfies[payload.hairfieId].similarHairfies.push(val);
                }.bind(this)); }
            else
                this.hairfies[payload.hairfieId].similarHairfies = arr;
            this.hairfies[payload.hairfieId].similarHairfiesPage = payload.hairfiePage;
        }
        this.emitChange();
    },
    getById: function (id) {
        return this.hairfies[id];
    },
    getHairfiesByUser: function (id) {
        return this.userHairfies[id];
    },
    getLikesByUser: function (userId) {
        return _.map(this.userLikes[userId], function(id) {
            return this.hairfies[id];
        }.bind(this));
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
    getByBusiness: function (businessId) {
        var hairfies = _.filter(this.hairfies, function (h) { return h.business && h.business.id === businessId; });

        return _.sortByOrder(hairfies, ['createdAt'], [false]);
    },
    getSimilarHairfies: function (id) {
        return _.map(this.hairfies[id].similarHairfies, function (id) {
            return this.hairfies[id];
        }.bind(this));
    },
    getSimilarHairfiesPage: function (id) {
        if (_.isUndefined(this.hairfies[id].similarHairfiesPage))
            this.getContext().executeAction(HairfieActions.loadSimilarHairfies, {
                hairfie: this.hairfies[id],
                page: 1,
                pageSize: PAGE_SIZE
            });
        return this.hairfies[id].similarHairfiesPage;
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
