'use strict';

var _ = require('lodash');
var SearchUtils = require('../../lib/search-utils');
var config = require('../../configs/search');
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function SubmitBusinessSearch(context, payload, done) {
    var done = done || _.noop;

    var search = _.cloneDeep(payload.search);

    if (!search.address) search.address = config.DEFAULT_ADDRESS;

    var params = SearchUtils.searchToRouteParams(search);

    context.executeAction(Navigate, {
        url: context.router.makeUrl('hairfie_search_result', params.path, params.query)
    }, done);
};
