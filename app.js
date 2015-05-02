'use strict';

var React = require('react');
var FluxibleApp = require('fluxible');
var Router = require('routr');
var _ = require('lodash');
var QueryString = require('query-string');
var provideContext = require('fluxible/addons/provideContext');
var Promise = require('q');

var Application = provideContext(require('./components/Application.jsx'), {
    makePath: React.PropTypes.func.isRequired,
    makeUrl: React.PropTypes.func.isRequired,
    navigateTo: React.PropTypes.func.isRequired
});

var app = new FluxibleApp({
    component: Application
});

var routes = require('./configs/routes');

app.plug({ // TODO: use the new fluxible-router with a custom RouteStore
    name: 'Router',
    plugContext: function (options, context) {
        var router = new Router(routes);
        router.makeUrl = function (routeName, pathParams, queryParams) {
            var path = this.makePath(routeName, pathParams);
            var query = QueryString.stringify(queryParams);

            return query ? path+'?'+query : path;
        };

        return {
            plugActionContext: function (actionContext) {
                actionContext.router = router;
            },
            plugComponentContext: function (componentContext) {
                componentContext.makePath = router.makePath.bind(router);
                componentContext.makeUrl  = router.makeUrl.bind(router);
                componentContext.navigateTo = function (url) {
                    return context.executeAction(require('flux-router-component/actions/navigate'), {url: url});
                };
            },
            plugStoreContext: function (storeContext) {
                storeContext.makePath = router.makePath.bind(router);
                storeContext.getRoutes = function () {
                    return routes;
                }
            }
        };
    }
});

app.plug({
    name: 'App',
    plugContext: function (options, context) {
        return {
            plugActionContext: function (actionContext) {
                // TODO: use action utils from fluxible
                actionContext.executeActions = function (actions, done) {
                    return Promise
                        .all(_.map(actions, function (action) {
                            return actionContext.executeAction(action[0], action[1]);
                        }))
                        .then(function () {
                            console.Log('toto');
                            if (done) done();
                        });
                };
            },
            plugStoreContext: function (storeContext) {
                // allow to execute actions from stores
                storeContext.executeAction = context.executeAction.bind(context);
            }
        }
    }
});

app.plug(require('./context/hairfie-api-plugin')({ // TODO: use fluxible-plugin-hairfie-api
    Client: require('./lib/hairfie/client'),
    apiUrl: require('./configs/hairfie-api').URL
}));

app.plug(require('fluxible-plugin-hairfie-api')({
    apiUrl: require('./configs/hairfie-api').URL
}));

app.registerStore(require('./stores/RouteStore'));
app.registerStore(require('./stores/HairfieStore'));
app.registerStore(require('./stores/HairfieSearchStore'));
app.registerStore(require('./stores/DealStore'));
app.registerStore(require('./stores/BusinessStore'));
app.registerStore(require('./stores/BusinessServiceStore.js'));
app.registerStore(require('./stores/BusinessReviewStore'));
app.registerStore(require('./stores/BusinessReviewRequestStore'));
app.registerStore(require('./stores/MetaStore'));
app.registerStore(require('./stores/NotificationStore'));
app.registerStore(require('./stores/BusinessSearchStore'));
app.registerStore(require('./stores/TokenStore'));
app.registerStore(require('./stores/BookingStore'));
app.registerStore(require('./stores/CategoryStore'));
app.registerStore(require('./stores/PlaceStore'));
app.registerStore(require('./stores/StationStore'));
app.registerStore(require('./stores/HomeLinkStore'));

// Front end require
//var Share = require('public/js/share.min.js');

module.exports = app;
