'use strict';

var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
    storeName: 'BusinessStore',
    handlers: {
        'RECEIVE_BUSINESS_SUCCESS': '_receiveBusiness'
    },
    initialize: function () {
        this.business = null;
    },
    _receiveBusiness: function (business) {
        this.business = business;
        this.emitChange();
    },
    getBusiness: function () {

        return this.business;
    },
    dehydrate: function () {
        return {
            business: this.business
        };
    },
    rehydrate: function (state) {
        this.business = state.business;
    }
});