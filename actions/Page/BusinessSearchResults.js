'use strict';

var PlaceActions = require('../Place');
var PlaceStore = require('../../stores/PlaceStore');
var BusinessSearchStore = require('../../stores/BusinessSearchStore');
var BusinessSearchActions = require('../BusinessSearch');
var SearchUtils = require('../../lib/search-utils');
var Q = require('q');
var _ = require('lodash');

module.exports = function BusinessSearchResults(context, payload, done) {
    var address = SearchUtils.addressFromUrlParameter(payload.params.address);

    // load place if necessary
    getPlaceByAddress(context, address)
        .then(getSearchResult.bind(null, context, payload))
        .then(done.bind(null, null), done);
};

function getSearchResult(context, route, place) {
    var deferred = Q.defer();

    var search = SearchUtils.searchFromRouteAndPlace(route, place);

    var store  = context.getStore(BusinessSearchStore);
    var result = store.getResult(search);

    if (!_.isUndefined(result)) {
        deferred.resolve(result);
    }

    var listener = function onSearchChange() {
        var result = store.getResult(search);
        if (!_.isUndefined(result)) return; // try next change
        store.removeChangeListener(onSearchChange);
        deferred.resolve(result);
    };

    store.addChangeListener(listener);
}

function getPlaceByAddress(context, address) {
    var deferred = Q.defer();

    var store = context.getStore(PlaceStore);
    var place = store.getByAddress(address);

    if (place) {
        deferred.resolve(place);
    } else {
        context.executeAction(PlaceActions.FetchByAddress, {address: address}, function () {
            deferred.resolve(store.getByAddress(address));
        });
    }

    return deferred.promise;
}
