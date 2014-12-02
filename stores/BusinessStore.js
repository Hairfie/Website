'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');
var HairdresserEvents = require('../constants/HairdresserConstants').Events;

var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessStore',
    handlers: makeHandlers({
        handleOpenSuccess: BusinessEvents.OPEN_SUCCESS,
        handleSaveSuccess: BusinessEvents.SAVE_SUCCESS,
        handleReceiveHairdressersSuccess: BusinessEvents.RECEIVE_HAIRDRESSERS_SUCCESS,
        handleHairdresserSaveSuccess: HairdresserEvents.SAVE_SUCCESS
    }),
    initialize: function () {
        this.business = null;
        this.hairdressers = null;
    },
    handleOpenSuccess: function (payload) {
        if (this.business && this.business.id != payload.business.id) {
            // destroy business dependant data when business changes
            this.hairdressers = null;
        }

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
    handleReceiveHairdressersSuccess: function (payload) {
        if (!this.business || payload.business.id != this.business.id) {
            return;
        }

        this.hairdressers = payload.hairdressers;
        this.emitChange();
    },
    handleHairdresserSaveSuccess: function (payload) {
        var hairdresser = payload.hairdresser;
        if (!this.business || hairdresser.business.id != this.business.id) {
            return;
        }

        var index = _.findIndex(this.hairdressers, {id: hairdresser.id});
        if (-1 == index) {
            this.hairdressers.push(hairdresser);
        } else {
            this.hairdressers[index] = hairdresser;
        }

        this.emitChange();
    },
    getBusiness: function () {
        return this.business;
    },
    getHairdressers: function () {
        if (this.business && !this.hairdressers) {
            this.dispatcher.getContext().executeAction(BusinessActions.RefreshHairdressers, {
                business: this.business
            });
        }

        return this.hairdressers || [];
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
