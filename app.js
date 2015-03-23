'use strict';

var React = require('react');
var FluxibleApp = require('fluxible');
var Router = require('routr');
var _ = require('lodash');
var QueryString = require('query-string');

var app = new FluxibleApp({
    component: React.createFactory(require('./components/Application.jsx'))
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
            var params = _.assign({
                locale: context.getActionContext().getStore('RouteStore').getPathParam('locale')
            }, params);
            return makePath(routeName, params);
        };

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

                actionContext.redirect = function (url, permanent) {
                    actionContext.dispatch('REDIRECT', {
                        url      : url,
                        permanent: permanent
                    });
                };

                // executes actions in //. It doesn't take care of errors yet :(
                actionContext.executeActions = function (actions, done) {
                    var done = _.after(actions.length, done || _.noop());
                    _.forEach(actions, function (action, i) {
                        actionContext.executeAction(action[0], action[1], done);
                    });
                };
            },
            plugComponentContext: function (componentContext) {
                componentContext.redirect = function (url, permanent) {
                    componentContext.executeAction(function (actionContext) {
                        actionContext.dispatch('REDIRECT', {
                            url      : url,
                            permanent: permanent
                        });
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

app.plug(require('./context/hairfie-api-plugin')({
    Client: require('./lib/hairfie/client'),
    apiUrl: require('./configs/hairfie-api').URL
}));

app.registerStore(require('./stores/RouteStore'));
app.registerStore(require('./stores/RedirectStore'));
app.registerStore(require('./stores/LocaleStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/HairfieStore'));
app.registerStore(require('./stores/HairfiesStore'));
app.registerStore(require('./stores/TopHairfiesStore'));
app.registerStore(require('./stores/TopDealsStore'));
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
app.registerStore(require('./stores/CategoriesStore'));
app.registerStore(require('./stores/PlaceStore'));
app.registerStore(require('./stores/StationStore'));

// Front end require
//var Share = require('public/js/share.min.js');

module.exports = app;
