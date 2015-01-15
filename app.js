'use strict';

var React = require('react');
var FluxibleApp = require('fluxible-app');
var routrPlugin = require('fluxible-plugin-routr');

var app = new FluxibleApp({
    appComponent: React.createFactory(require('./components/Application.jsx'))
});

app.plug(routrPlugin({
    routes: require('./configs/routes')
}));

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

app.registerStore(require('./stores/ApplicationStore'));
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
app.registerStore(require('./stores/ServiceStore'));
app.registerStore(require('./stores/FlashStore'));
app.registerStore(require('./stores/SlugStore'));
app.registerStore(require('./stores/UserSuggestionStore'));
app.registerStore(require('./stores/UserManagedBusinessStore'));
app.registerStore(require('./stores/FacebookStore'));
app.registerStore(require('./stores/BusinessSearchStore'));
app.registerStore(require('./stores/PasswordRecoveryStore'));
app.registerStore(require('./stores/BookingStore'));

module.exports = app;
