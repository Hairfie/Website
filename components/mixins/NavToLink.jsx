'use strict';

/**
 * TODO: why JSX?
 */

var React = require('react');
var Navigate = require('flux-router-component/actions/navigate');

var NavToLinkMixin = {
    contextTypes: {
        makeUrl: React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func.isRequired
    },
    navToLink: function(routeName, pathParams, queryParams) {
        var path = this.context.makeUrl(routeName, pathParams, queryParams);
        this.context.executeAction(Navigate, {url: path});
    }
};

module.exports = NavToLinkMixin;
