'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');

module.exports = createStore({
    storeName: 'BusinessFacebookPageStore',
    initialize: function () {
        this.pages = {};
    },
    handlers: makeHandlers({
        handleReceiveFacebookPageSuccess: BusinessEvents.RECEIVE_FACEBOOK_PAGE_SUCCESS
    }),
    handleReceiveFacebookPageSuccess: function (payload) {
        this.pages[payload.business.id] = payload.facebookPage;
        this.emitChange();
    },
    getFacebookPageByBusiness: function (business) {
        if (typeof this.pages[business.id] == 'undefined') {
            this.dispatcher.getContext().executeAction(BusinessActions.RefreshFacebookPage, {
                business: business
            });
        }

        return this.pages[business.id];
    }
});
