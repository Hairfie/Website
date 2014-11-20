'use strict';

var createStore = require('fluxible-app/utils/createStore');

module.exports = createStore({
    storeName: 'ApplicationStore',
    handlers: {
        'CHANGE_ROUTE_SUCCESS': 'onChangeRouteSuccess'
    },
    dehydrate: function () {
        return {
            currentPage: this.currentPage
        }
    },
    rehydrate: function (state) {
        this.currentPage = state.currentPage;
    },
    onChangeRouteSuccess: function (payload) {
        if (payload.name == this.getCurrentPage()) {
            return;
        }

        this.currentPage = payload.name;
        this.emitChange();
    },
    getCurrentPage: function () {
        return this.currentPage;
    }
});
