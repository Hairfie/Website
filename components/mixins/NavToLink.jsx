'use strict';
var Navigate = require('flux-router-component/actions/navigate');

var NavToLinkMixin = {
    navToLink: function(routeName, navParams) {
        var path = this.props.context.makePath(routeName, navParams);
        this.executeAction(Navigate, {url: path});
    }
};

module.exports = NavToLinkMixin;