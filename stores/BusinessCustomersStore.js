'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessCustomersEvents = require('../constants/BusinessCustomersConstants').Events;
var BusinessCustomersActions = require('../actions/BusinessCustomers');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessCustomersStore',
    initialize: function () {
        this.customers = {};
    },
    handlers: makeHandlers({
        handleReceiveCustomersSuccess: BusinessCustomersEvents.RECEIVE_CUSTOMERS_SUCCESS
    }),
    handleReceiveCustomersSuccess: function (payload) {
        this.customers[payload.businessId] = payload.customers;
        this.emitChange();
    },
    getByBusiness: function (businessId) {
        if (!this.customers[businessId]) {
            this.dispatcher.getContext().executeAction(BusinessCustomersActions.RefreshCustomers, {
                businessId: businessId
            });
        }

        return this.customers[businessId];
    }
});
