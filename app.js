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
    name: 'ActionAccessor',
    plugContext: function () {
        return {
            plugActionContext: function plugActionContext(actionContext) {
                actionContext.getAction = function (name) {
                    try {
                        return require('./actions/'+name);
                    } catch (e) {
                        return;
                    }
                }
            }
        }
    }
});

app.registerStore(require('./stores/ApplicationStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/EditedBusinessClaimStore'));
app.registerStore(require('./stores/HairfieStore'));
app.registerStore(require('./stores/BusinessStore'));

module.exports = app;
