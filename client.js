'use strict';

var React = require('react');
var app = require('./app');
var appState = window.App;
var debug = require('debug');
var Facebook = require('./services/facebook');
var FacebookEvents = require('./constants/FacebookConstants').Events;
var serverConfig   = require('./configs/server');

if(!serverConfig.DEBUG) {
    debug.disable('*');
}

app.rehydrate(appState, function (error, context) {
    if (error) throw error;
    React.render(
        app.getComponent()({context: context.getComponentContext()}),
        document.getElementById('app')
    );

    Facebook
        .load()
        .then(function (fb) {
            fb.Event.subscribe('auth.statusChange', function (loginStatus) {
                context.dispatch(FacebookEvents.RECEIVE_LOGIN_STATUS, {
                    loginStatus: loginStatus
                });
            });
        });
});
