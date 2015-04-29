'use strict';

var React = require('react');
var app = require('./app');
var appState = window.App;
var debug = require('debug');
var serverConfig   = require('./configs/server');

if(!serverConfig.DEBUG) {
    debug.disable('*');
}

app.rehydrate(appState, function (error, context) {
    if (error) throw error;

    React.render(
        React.createFactory(app.getComponent())({context: context.getComponentContext()}),
        document.getElementById('app')
    );
});
