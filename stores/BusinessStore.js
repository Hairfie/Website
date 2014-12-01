'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessEvents = require('../constants/BusinessConstants').Events;

module.exports = createStore({
    storeName: 'BusinessStore',
    handlers: makeHandlers({
        handleOpenSuccess: BusinessEvents.OPEN_SUCCESS,
        handleSaveSuccess: BusinessEvents.SAVE_SUCCESS
    }),
    initialize: function () {
        this.business = null;
    },
    handleOpenSuccess: function (payload) {
        this.business = payload.business;
        this.emitChange();
    },
    handleSaveSuccess: function (payload) {
        if (!this.business || payload.business.id != this.business.id) {
            return;
        }

        this.business = payload.business;
        this.emitChange();
    },
    getBusiness: function () {
        return this.business;
    },
    dehydrate: function () {
        return {
            business: this.business
        };
    },
    rehydrate: function (state) {
        this.business = state.business;
    }
});
