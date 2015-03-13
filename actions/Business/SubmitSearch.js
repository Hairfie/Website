'use strict';

function noop() {};

var SearchUtils = require('../../lib/search-utils');

module.exports = function SubmitBusinessSearch(context, payload, done) {
    var done = done || noop;

    context.redirect(context.router.makePath('business_search_results', {
        location: SearchUtils.locationToUrlParameter(payload.location)
    }));

    done();
};
