'use strict';

var PlaceActions = require('../Place');
var BusinessSearchActions = require('../BusinessSearch');
var SearchUtils = require('../../lib/search-utils');

module.exports = function BusinessSearchResults(context, payload, done) {
    var address = SearchUtils.locationFromUrlParameter(payload.params.location);
    context.executeAction(PlaceActions.FetchByAddress, {address: address}, done);
    return;

    context.executeAction(PlaceActions.FetchByAddress, {address: address}, function () {
        var place = context.getStore(PlaceStore).getByAddress(address);

        var query = {};
        query.here = place.location;

        done();

        //context.executeAction(BusinessSearchActions.Search, {
        //    query: query
        //}, done);
    });
};
