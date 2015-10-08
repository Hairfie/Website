'use strict';

var RouteStore = require('fluxible-router').RouteStore;
var routes = require('../routes');
var QueryString = require('query-string');

RouteStore.prototype.makeUrl = function (route, params, query) {
    console.log('TRALALALALALALALALALALALALALALAL', query);
    var path = this.makePath(route, params);
    var queryStr = QueryString.stringify(query);

    return queryStr ? path+'?'+queryStr : path;
};

module.exports = RouteStore.withStaticRoutes(routes);
