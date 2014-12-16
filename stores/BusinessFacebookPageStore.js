'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var FacebookEvents = require('../constants/FacebookConstants').Events;
var FacebookActions = require('../actions/Facebook');

module.exports = createStore({
    storeName: 'BusinessFacebookPageStore',
    initialize: function () {
        this.pages = {};
    },
    handlers: makeHandlers({
        handleRefreshBusinessPageSuccess: FacebookEvents.REFRESH_BUSINESS_PAGE_SUCCESS
    }),
    handleRefreshBusinessPageSuccess: function (payload) {
        this.pages[payload.business.id] = payload.facebookPage;
        this.emitChange();
    },
    getFacebookPageByBusiness: function (business) {
        if (typeof this.pages[business.id] == 'undefined') {
            this.dispatcher.getContext().executeAction(FacebookActions.RefreshBusinessPage, {
                business: business
            });
        }

        return this.pages[business.id];
    }
});
