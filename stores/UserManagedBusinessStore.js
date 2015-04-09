'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var AuthStore = require('./AuthStore');
var UserEvents = require('../constants/UserConstants').Events;
var BusinessEvents = require('../constants/BusinessConstants').Events;
var UserActions = require('../actions/User');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'UserManagedBusinessStore',
    handlers: makeHandlers({
        handleReceiveManagedBusinessesSuccess   : UserEvents.RECEIVE_MANAGED_BUSINESSES_SUCCESS,
        handleReceiveBusiness                   : BusinessEvents.RECEIVE_SUCCESS,
        handleClaimSuccess                      : BusinessEvents.CLAIM_SUCCESS
    }),
    initialize: function () {
        this.managedBusinesses = {};
    },
    dehydrate: function () {
        return {
            managedBusinesses: this.managedBusinesses
        };
    },
    rehydrate: function (data) {
        this.managedBusinesses = data.managedBusinesses;
    },
    handleReceiveManagedBusinessesSuccess: function (payload) {
        this.managedBusinesses[payload.user.id] = payload.businesses;
        this.emitChange();
    },
    handleReceiveBusiness: function (payload) {
        var replaced = false;
        _.forIn(this.managedBusinesses, function (businesses, userId) {
            _.forEach(businesses, function (business, index) {
                if (business.id == payload.business.id) {
                    this.managedBusinesses[userId][index] = payload.business;
                    replaced = true;
                }
            }, this);
        }, this);

        if (replaced) {
            this.emitChange();
        }
    },
    handleClaimSuccess: function (payload) {
        var user = this._getAuthUser();
        if (user) {
            this._refreshManagedBusinesses(user);
        }
    },
    getManagedBusinessesByUser: function (user) {
        if (!this.managedBusinesses[user.id]) {
            this._refreshManagedBusinesses(user);
        }

        return this.managedBusinesses[user.id];
    },
    _refreshManagedBusinesses: function (user) {
        this.dispatcher.getContext().executeAction(UserActions.RefreshManagedBusinesses, {
            user: user
        });
    },
    _getAuthUser: function () {
        return this.dispatcher.getStore(AuthStore).getUser();
    }
});
