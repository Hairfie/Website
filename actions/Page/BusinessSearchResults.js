'use strict';

var PlaceActions = require('../Place');
var PlaceStore = require('../../stores/PlaceStore');
var BusinessSearchActions = require('../BusinessSearch');
var SearchUtils = require('../../lib/search-utils');
var Q = require('q');

module.exports = function BusinessSearchResults(context, payload, done) {
    var address = SearchUtils.locationFromUrlParameter(payload.params.location);

    // load place if necessary
    getPlaceByAddress(context, address).then(done.bind(null, null), done);
};

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
