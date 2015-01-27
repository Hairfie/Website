'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var ServiceEvents = require('../constants/ServiceConstants').Events;
var ServiceActions = require('../actions/Service');

module.exports = createStore({
    storeName: 'ServiceStore',
    handlers: makeHandlers({
        handleReceiveAllSuccess: ServiceEvents.RECEIVE_ALL_SUCCESS
    }),
    handleReceiveAllSuccess: function (payload) {
        this.services = payload.services;
        this.emitChange();
    },
    getServices: function () {
        if (!this.services) {
            this.dispatcher.getContext().executeAction(ServiceActions.RefreshAll);
        }

        return this.services || [];
    }
});
