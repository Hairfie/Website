'use strict';

/**
 * TODO: why JSX?
 */

var React = require('react');
var NavigationActions = require('../../actions/NavigationActions');

var NavToLinkMixin = {
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    navToLink: function(route, params, query) {
        this.context.executeAction(NavigationActions.navigate, {
            route: route,
            params: params,
            query: query
        });
    }
};

module.exports = NavToLinkMixin;
