'use strict';

var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
    storeName: 'EditedBusinessClaimStore',
    handlers: {
        'OPEN_BUSINESS_CLAIM_SUCCESS': 'handleOpenSuccess'
    },
    initialize: function () {},
    dehydrate: function () {
        return {
            currentStep: this.currentStep,
            businessClaim: this.businessClaim
        };
    },
    rehydrate: function (state) {
        this.businessClaim = state.businessClaim;
    },
    handleOpenSuccess: function (payload) {
        this.businessClaim = payload.businessClaim;
        this.emitChange();
    },
    getBusinessClaim: function () {
        return this.businessClaim;
    }
});
