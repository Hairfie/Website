'use strict';

/**
 * TODO: why JSX?
 */

var Navigate = require('flux-router-component/actions/navigate');

var NavToLinkMixin = {
    navToLink: function(routeName, pathParams, queryParams) {
        var path = this.props.context.makeUrl(routeName, pathParams, queryParams);
        this.executeAction(Navigate, {url: path});
    }
};

module.exports = NavToLinkMixin;
