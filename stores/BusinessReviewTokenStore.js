'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var BusinessReviewTokenActions = require('../actions/BusinessReviewToken');
var BusinessReviewTokenEvents = require('../constants/BusinessReviewTokenConstants').Events;

module.exports = createStore({
    storeName: 'BusinessReviewTokenStore',
    handlers: makeHandlers({
        handleReceiveSuccess: BusinessReviewTokenEvents.RECEIVE_SUCCESS
    }),
    initialize: function () {
        this.tokens = {};
    },
    handleReceiveSuccess: function (payload) {
        this.tokens[payload.id] = payload.businessReviewToken;
        this.emitChange();
    },
    getById: function (id) {
        var token = this.tokens[id];

        if (undefined === token) {
            this._fetchById(id);
        }

        return token;
    },
    _fetchById: function (id) {
        this.dispatcher.getContext().executeAction(BusinessReviewTokenActions.Fetch, {
            id: id
        });
    }
});
