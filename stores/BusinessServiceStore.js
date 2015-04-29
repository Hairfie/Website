'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessServiceActions = require('../actions/BusinessService');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessServiceStore',
    initialize: function () {
        this.businessServices = {};
    },
    handlers: makeHandlers({
        handleReceiveBusinessSuccess: Actions.RECEIVE_BUSINESS_SERVICES
    }),
    handleReceiveBusinessSuccess: function (payload) {
        this.businessServices[payload.businessId] = payload.businessServices;
        this.emitChange();
    },
    getByBusiness: function (businessId) {
        if (!this.businessServices[businessId]) {
            this.dispatcher.getContext().executeAction(BusinessServiceActions.RefreshBusiness, {
                businessId: businessId
            });
        }

        return this.businessServices[businessId];
    }
});
