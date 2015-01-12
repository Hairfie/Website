'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var BusinessReviewActions = require('../actions/BusinessReview');
var BusinessReviewEvents = require('../constants/BusinessReviewConstants').Events;

module.exports = createStore({
    storeName: 'BusinessReviewRequestStore',
    handlers: makeHandlers({
        handleReceiveSuccess: BusinessReviewEvents.RECEIVE_REQUEST_SUCCESS
    }),
    initialize: function () {
        this.requests = {};
    },
    handleReceiveSuccess: function (payload) {
        this.requests[payload.id] = payload.businessReviewRequest;
        this.emitChange();
    },
    getById: function (id) {
        var token = this.requests[id];

        if (undefined === token) {
            this._fetchById(id);
        }

        return token;
    },
    _fetchById: function (id) {
        this.dispatcher.getContext().executeAction(BusinessReviewActions.FetchRequest, {
            id: id
        });
    }
});
