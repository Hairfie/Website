'use strict';

var NavigationActions = require('./NavigationActions');
var AuthActions = require('./AuthActions');
var TagActions = require('./TagActions');
var CategoryActions = require('./CategoryActions');
var SelectionActions = require('./SelectionActions');
var Promise = require('q');

module.exports = {
    initialize: function (context, url) {
    	return Promise.all([
                context.executeAction(AuthActions.loginWithCookie),
                context.executeAction(TagActions.loadAll),
                context.executeAction(CategoryActions.loadAll),
                context.executeAction(SelectionActions.loadAll)
            ])
    		.then(function() {
     			return context.executeAction(NavigationActions.navigate, { url: url });
    		}, function() {
    			return context.executeAction(NavigationActions.navigate, { url: url });
    	});
    }
};
