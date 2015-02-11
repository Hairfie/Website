'use strict';

var React = require('react');
var FluxibleApp = require('fluxible');
var Router = require('routr');
var _ = require('lodash');

var app = new FluxibleApp({
    appComponent: React.createFactory(require('./components/Application.jsx'))
});

var routes = _.mapValues(require('./configs/routes'), function (route) {
    return _.assign(route, {path: '/:locale'+route.path});
});

app.plug({
    name: 'Router',
    plugContext: function (options, context) {
        var router = new Router(routes);

        var makePath = router.makePath.bind(router);
        router.makePath = function (routeName, params) {
            var params = _.assign({}, params, {
                locale: context.getActionContext().getStore('RouteStore').getParam('locale')
            });
            return makePath(routeName, params);
        };

        return {
            plugActionContext: function (actionContext) {
                actionContext.router = router;
            },
            plugComponentContext: function (componentContext) {
                componentContext.makePath = router.makePath.bind(router);
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
                // shortcut to access auth token from actions
                actionContext.getAuthToken = function () {
                    return actionContext.getStore(require('./stores/AuthStore')).getToken();
                };
            },
            plugStoreContext: function (storeContext) {
                // allow to execute actions from stores
                storeContext.executeAction = context.executeAction.bind(context);
            }
        }
    }
});

app.plug(require('./context/hairfie-api-plugin')({
    Client: require('./lib/hairfie/client'),
    apiUrl: require('./configs/hairfie-api').URL
}));

app.registerStore(require('./stores/RouteStore'));
app.registerStore(require('./stores/LocaleStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/HairfieStore'));
app.registerStore(require('./stores/HairfiesStore'));
app.registerStore(require('./stores/BusinessStore'));
app.registerStore(require('./stores/BusinessMemberStore'));
app.registerStore(require('./stores/BusinessCustomersStore'));
app.registerStore(require('./stores/BusinessServiceStore'));
app.registerStore(require('./stores/BusinessFacebookPageStore'));
app.registerStore(require('./stores/BusinessReviewRequestStore'));
app.registerStore(require('./stores/MetaStore'));
app.registerStore(require('./stores/FlashStore'));
app.registerStore(require('./stores/SlugStore'));
app.registerStore(require('./stores/UserSuggestionStore'));
app.registerStore(require('./stores/UserManagedBusinessStore'));
app.registerStore(require('./stores/FacebookStore'));
app.registerStore(require('./stores/BusinessSearchStore'));
app.registerStore(require('./stores/PasswordRecoveryStore'));
app.registerStore(require('./stores/BookingStore'));
app.registerStore(require('./stores/PictureUploadStore'));

module.exports = app;
