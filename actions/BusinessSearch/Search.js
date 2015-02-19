'use strict';

var BusinessSearchEvents = require('../../constants/BusinessSearchConstants').Events;
var Navigate = require('flux-router-component/actions/navigate');
var toQueryString = require('../../lib/queryString.js');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    //context.dispatch(BusinessSearchEvents.SEARCH);

    var path = context.router.makePath('search') + '?' + toQueryString(payload);

    context.executeAction(Navigate, {url: path}, done);

    // context
    //     .getHairfieApi()
    //     .search(payload.query, payload.isGeoipable)
    //     .then(function (businesses) {
    //         context.dispatch(BusinessSearchEvents.SEARCH_SUCCESS, {
    //             businesses: businesses
    //         });
    //         done();
    //     })
    //     .fail(function (error) {
    //         context.dispatch(BusinessSearchEvents.SEARCH_FAILURE);
    //         done(error);
    //     });
};
