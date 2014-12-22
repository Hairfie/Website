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
        this.customers[payload.business.id] = payload.customers;
        this.emitChange();
    },
    getCustomersByBusiness: function (business) {
        if (!this.customers[business.id]) {
            this.dispatcher.getContext().executeAction(BusinessCustomersActions.RefreshCustomers, {
                business: business
            });
        }

        return this.customers[business.id];
    }
});