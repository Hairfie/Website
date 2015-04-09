'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var HairfieEvents = require('../constants/HairfieConstants').Events;
var HairfieActions = require('../actions/Hairfie');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'TopHairfiesStore',
    handlers: makeHandlers({
        handleReceiveTop        : HairfieEvents.RECEIVE_TOP,
        handleReceiveTopSuccess : HairfieEvents.RECEIVE_TOP_SUCCESS,
        handleReceiveTopFailure : HairfieEvents.RECEIVE_TOP_FAILURE
    }),
    initialize: function () {
        this.hairfies = [];
        this.limit = 0;
    },
    dehydrate: function () {
        return {
            hairfies: this.hairfies,
            limit   : this.limit
        };
    },
    rehydrate: function (data) {
        this.hairfies = data.hairfies;
        this.limit = data.limit;
    },
    get: function (limit) {
        if (!this.loading && limit > this.limit) {
            this._load(limit);
        }

        return _.take(this.hairfies, limit);
    },
    handleReceiveTop: function (payload) {
        this.loading = true;
    },
    handleReceiveTopSuccess: function (payload) {
        this.loading = false;
        this.limit = payload.limit;
        this.hairfies = payload.hairfies;
        try {
        this.emitChange();
        } catch (e) {console.log(e); };
    },
    handleReceiveTopFailure: function (payload) {
        this.loading = false;
        this.emitChange();
    },
    _load: function (limit) {
        this.dispatcher.getContext().executeAction(HairfieActions.FetchTop, {
            limit: limit
        });
    }
});
