'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');
var authStorage = require('../services/auth-storage');
var SubscriberActions = require('../actions/SubscriberActions');

module.exports = createStore({
    storeName: 'AuthStore',
    handlers: makeHandlers({
        onReceiveToken: Actions.RECEIVE_TOKEN,
        onDeleteToken: Actions.DELETE_TOKEN,
        onClosedPopupStatusChange: Actions.CLOSED_POPUP_STATUS,
        onClosedBannerStatusChange: Actions.CLOSED_BANNER_STATUS,
        onNavigateSuccess: Actions.NAVIGATE_SUCCESS
    }),
    initialize: function () {
        this.tokens = {};
        this.closesPopupStatus, this.hasNavigated, this.closedBannerStatus;
    },
    dehydrate: function () {
        return { tokens: this.tokens };
    },
    rehydrate: function (state) {
        this.tokens = state.tokens;
    },
    onReceiveToken: function (token) {
        this.tokens = token;
        this.emitChange();
    },
    onDeleteToken: function() {
        this.tokens = {};
        this.emitChange();
    },
    getToken: function () {
        return this.tokens;
    },
    getUserId: function () {
        return this.getToken() && this.getToken().userId;
    },
    onClosedPopupStatusChange: function(status) {
        this.closedPopupStatus = status;
        this.emitChange();
    },
    getClosedPopupStatus: function() {
        if(_.isUndefined(this.closedPopupStatus)) {
            this.getContext().executeAction(SubscriberActions.getClosedPopupStatus);
            return true;
        } else {
            return this.closedPopupStatus;
        }
    },
    onNavigateSuccess: function() {
        this.hasNavigated = true;
        this.emitChange();
    },
    shouldOpenPopup: function() {
        var shouldOpenPopup = this.hasNavigated && !this.closedPopupStatus && !_.isUndefined(this.closedPopupStatus);

        return shouldOpenPopup;
    },
    onClosedBannerStatusChange: function(status) {
        this.closedBannerStatus = status;
        this.emitChange();
    },
    shouldOpenBanner: function() {
        if(_.isUndefined(this.closedBannerStatus)) {
            this.getContext().executeAction(SubscriberActions.getClosedBannerStatus);
            return false;
        } else {
            return !this.closedBannerStatus;
        }
    }
});
