'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'BusinessReviewRequestStore',
    handlers: makeHandlers({
        onReceiveBusinessReviewRequest: Actions.RECEIVE_BUSINESS_REVIEW_REQUEST
    }),
    initialize: function () {
        this.requests = {};
    },
    dehydrate: function () {
        return {
            requests: this.requests,
        };
    },
    rehydrate: function (state) {
        this.requests = state.requests;
    },
    onReceiveBusinessReviewRequest: function (request) {
        this.requests[request.id] = request;
        this.emitChange();
    },
    getById: function (id) {
        return this.requests[id];
    }
});
