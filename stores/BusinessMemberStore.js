'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessMemberEvents = require('../constants/BusinessMemberConstants').Events;
var BusinessMemberActions = require('../actions/BusinessMember');

module.exports = createStore({
    storeName: 'BusinessMemberStore',
    initialize: function () {
        this.businessMembers = {};
    },
    handlers: makeHandlers({
        handleReceiveBusinessSuccess: BusinessMemberEvents.RECEIVE_BUSINESS_SUCCESS,
        handleSaveSuccess: BusinessMemberEvents.SAVE_SUCCESS
    }),
    handleReceiveBusinessSuccess: function (payload) {
        this.businessMembers[payload.business.id] = payload.businessMembers;
        this.emitChange();
    },
    handleSaveSuccess: function (payload) {
        var businessCollection = this.businessMembers[payload.businessMembers.business.id];
        if (businessCollection) {
            businessCollection.push(payload.businessMember);
            this.emitChange();
        }
    },
    getBusinessMembersByBusiness: function (business) {
        if (!this.businessMembers[business.id]) {
            this.dispatcher.getContext().executeAction(BusinessMemberActions.RefreshBusiness, {
                business: business
            });
        }

        return this.businessMembers[business.id];
    }
});
