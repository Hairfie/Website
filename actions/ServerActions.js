'use strict';

var NavigationActions = require('./NavigationActions');
var AuthActions = require('./AuthActions');

module.exports = {
    initialize: function (context, url) {
    	return context.executeAction(AuthActions.loginWithCookie)
    		.then(function() {
     			return context.executeAction(NavigationActions.navigate, { url: url });
    		}, function() {
    			return context.executeAction(NavigationActions.navigate, { url: url });
    	});
    }
};
