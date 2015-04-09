'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'SimilarBusinessStore',
    handlers: makeHandlers({
        handleFetchSuccess: BusinessEvents.FETCH_SIMILAR_SUCCESS
    }),
    initialize: function () {
        this.caches = {};
    },
    dehydrate: function () {
        return {
            chaches: this.caches
        };
    },
    rehydrate: function (data) {
        this.caches = data.caches;
    },
    handleFetchSuccess: function (payload) {
        this.caches[payload.businessId+'|'+payload.limit] = payload.businesses;
        this.emitChange();
    },
    list: function (businessId, limit) {
        var cache = this.caches[businessId+'|'+limit];
        if (_.isUndefined(cache)) {
            this._load(businessId, limit);
        }

        return cache;
    },
    _load: function (businessId, limit) {
        this.dispatcher.getContext().executeAction(BusinessActions.FetchSimilar, {
            businessId: businessId,
            limit:      limit
        });
    }
});
