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
    plugContext: function () {
        return {
            plugActionContext: function plugActionContext(actionContext) {
                // shortcut to access auth token from actions
                actionContext.getAuthToken = function () {
                    return actionContext.getStore(require('./stores/AuthStore')).getToken();
                };
            }
        }
    }
});

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/ClaimedBusinessStore'));
app.registerStore(require('./stores/HairfieStore'));
app.registerStore(require('./stores/BusinessStore'));

module.exports = app;
