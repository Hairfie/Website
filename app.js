'use strict';

var React = require('react');
var FluxibleApp = require('fluxible-app');
var routrPlugin = require('fluxible-plugin-routr');

// TODO : fix this, but it doesnt work here.
// if (typeof global.Intl == 'undefined') {
//     global.Intl = require('intl');
// }

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
app.registerStore(require('./stores/ClaimedBusinessStore'));
app.registerStore(require('./stores/HairfieStore'));
app.registerStore(require('./stores/BusinessStore'));
app.registerStore(require('./stores/MetaStore'));

module.exports = app;
