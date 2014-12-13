'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessMemberEvents = require('../constants/BusinessMemberConstants').Events;
var BusinessMemberActions = require('../actions/BusinessMember');
var _ = require('lodash');

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
        var businessMember = payload.businessMember,
            business       = businessMember.business;

        if (this.businessMembers[business.id]) {
            var exists = false;
            // try to replace with new values if already in collection
            this.businessMembers[business.id] = _.map(this.businessMembers[business.id], function (existing) {
                if (existing.id == businessMember.id) {
                    exists = true;
                    return businessMember;
                }
                return existing;
            });
            if (!exists) {
                // it's new, add it to the collection
                this.businessMembers[business.id].push(businessMember);
            }
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
