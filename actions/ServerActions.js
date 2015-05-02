'use strict';

var NavigationActions = require('./NavigationActions');

module.exports = {
    initialize: function (context, url) {
        return context.executeAction(NavigationActions.navigate, { url: url });
    }
};
