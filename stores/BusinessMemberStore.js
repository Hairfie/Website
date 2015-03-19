'use strict';

var createStore = require('fluxible/utils/createStore');
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
        handleReceiveBusiness: BusinessMemberEvents.RECEIVE_BUSINESS,
        handleReceiveBusinessSuccess: BusinessMemberEvents.RECEIVE_BUSINESS_SUCCESS,
        handleReceiveBusinessFailure: BusinessMemberEvents.RECEIVE_BUSINESS_FAILURE,
        handleSaveSuccess: BusinessMemberEvents.SAVE_SUCCESS
    }),
    handleReceiveBusiness: function (payload) {
        this.businessMembers[payload.businessId] = _.assign({}, this.businessMembers[payload.businessId], {
            loading: true
        });
    },
    handleReceiveBusinessSuccess: function (payload) {
        this.businessMembers[payload.businessId] = _.assign({}, this.businessMembers[payload.businessId], {
            loading : false,
            entities: payload.businessMembers
        });
        this.emitChange();
    },
    handleReceiveBusinessFailure: function (payload) {
        this.businessMembers[payload.businessId] = _.assign({}, this.businessMembers[payload.businessId], {
            loading : false
        });
        this.emitChange();
    },
    handleSaveSuccess: function (payload) {
        var businessMember = payload.businessMember,
            business       = businessMember.business;

        if (this.businessMembers[business.id]) {
            var exists = false;
            // try to replace with new values if already in collection
            this.businessMembers[business.id].entities = _.map(this.businessMembers[business.id].entities, function (existing) {
                if (existing.id == businessMember.id) {
                    exists = true;
                    return businessMember;
                }
                return existing;
            });
            if (!exists) {
                // it's new, add it to the collection
                this.businessMembers[business.id].entities.push(businessMember);
            }
            this.emitChange();
        }
    },
    getActiveByBusiness: function (businessId) {
        var members = this.getByBusiness(businessId);

        return members && _.filter(members, 'active');
    },
    getVisibleByBusiness: function (businessId) {
        var members = this.getActiveByBusiness(businessId);

        return members && _.filter(members, {'hidden': false});
    },
    getByBusiness: function (businessId) {
        var stored = this.businessMembers[businessId];

        if (typeof stored == "undefined") {
            this._loadByBusiness(businessId);
        }

        return stored && stored.entities;
    },
    _loadByBusiness: function (businessId) {
        this.dispatcher.getContext().executeAction(BusinessMemberActions.RefreshBusiness, {
            businessId: businessId
        });
    }
});
