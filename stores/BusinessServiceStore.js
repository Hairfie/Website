'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessServiceEvents = require('../constants/BusinessServiceConstants').Events;
var BusinessServiceActions = require('../actions/BusinessService');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessServiceStore',
    initialize: function () {
        this.businessServices = {};
    },
    handlers: makeHandlers({
        handleSaveSuccess           : BusinessServiceEvents.SAVE_SUCCESS,
        handleDeleteSuccess         : BusinessServiceEvents.DELETE_SUCCESS,
        handleReceiveBusinessSuccess: BusinessServiceEvents.RECEIVE_BUSINESS_SUCCESS
    }),
    handleSaveSuccess: function (payload) {
        var bs = payload.businessService;
        if (bs.business && bs.business.id && this.businessServices[bs.business.id]) {
            var exists = false;
            // try to replace with new values if already in collection
            this.businessServices[bs.business.id] = _.map(this.businessServices[bs.business.id], function (existing) {
                if (existing.id == bs.id) {
                    exists = true;
                    return bs;
                }
                return existing;
            });
            if (!exists) {
                // it's new, add it to the collection
                this.businessServices[bs.business.id].push(bs);
            }
            this.emitChange();
        }
    },
    handleDeleteSuccess: function (payload) {
        var bs = payload.businessService;
        if (bs.business && bs.business.id && this.businessServices[bs.business.id]) {
            this.businessServices[bs.business.id] = _.filter(this.businessServices[bs.business.id], function (existing) {
                return existing.id != bs.id;
            });
            this.emitChange();
        }
    },
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
