'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var HairfieEvents = require('../constants/HairfieConstants').Events;
var HairfieActions = require('../actions/Hairfie');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'HairfiesStore',
    handlers: makeHandlers({
        'handleListSuccess': HairfieEvents.LIST_SUCCESS,
    }),
    initialize: function () {
        this.hairfies = [];
        this.endOfScroll = false;
    },
    handleListSuccess: function (payload) {
        this.hairfies = _.uniq(this.hairfies.concat(payload.hairfies), function(hairfie) { return hairfie.id; });
        this.endOfScroll = (payload.hairfies.length < 6) ? true : false;
        this.emitChange();
    },
    getHairfiesForBusiness: function (businessId) {
        var hairfies = _.filter(this.hairfies, function(hairfie) { return hairfie.business.id == businessId; });
        return hairfies;
    },
    isEndOfScroll: function() {
        return this.endOfScroll;
    },
    dehydrate: function () {
        return {
            hairfies: this.hairfies
        };
    },
    rehydrate: function (state) {
        this.hairfies = state.hairfies;
    }
});