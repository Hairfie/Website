'use strict';

var React = require('react');
var Fluxible = require('fluxible');
var _ = require('lodash');
var QueryString = require('query-string');
var provideContext = require('fluxible-addons-react/provideContext');
var Promise = require('q');
var config = require('./config');

var Application = provideContext(require('./components/Application.jsx'), require('./context'));

var app = new Fluxible({
    component: Application
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

app.plug(require('fluxible-plugin-hairfie-api')({
    apiUrl: config.hairfieApiUrl
}));

app.plug(require('fluxible-plugin-cookie')());

app.plug(require('fluxible-plugin-facebook')({
    appId: '1567052370184577'
}));

app.plug(require('fluxible-plugin-config')(config));

app.plug(require('fluxible-plugin-google-maps')());

app.plug(require('./plugins/assets')({
    cdnUrl  : config.cdnUrl,
    version : config.version
}));

app.registerStore(require('./stores/RouteStore'));
app.registerStore(require('./stores/HairfieStore'));
app.registerStore(require('./stores/BusinessStore'));
app.registerStore(require('./stores/BusinessServiceStore.js'));
app.registerStore(require('./stores/BusinessReviewStore'));
app.registerStore(require('./stores/BusinessReviewRequestStore'));
app.registerStore(require('./stores/MetaStore'));
app.registerStore(require('./stores/NotificationStore'));
app.registerStore(require('./stores/AuthStore'));
app.registerStore(require('./stores/BookingStore'));
app.registerStore(require('./stores/DealStore'));
app.registerStore(require('./stores/CategoryStore'));
app.registerStore(require('./stores/TagStore'));
app.registerStore(require('./stores/PlaceStore'));
app.registerStore(require('./stores/StationStore'));
app.registerStore(require('./stores/HomeLinkStore'));
app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/UploadStore'));
app.registerStore(require('./stores/HairdresserStore'));
app.registerStore(require('./stores/TimeslotStore'));
app.registerStore(require('./stores/BlogPostStore'));
// Front end require
//var Share = require('public/js/share.min.js');

module.exports = app;
