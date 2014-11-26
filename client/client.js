'use strict';

var React = require('react');
var app = require('./app');
var appState = window.App;
var debug = require('debug');

debug.enable('*');

app.rehydrate(appState, function (error, context) {
    if (error) throw error;
    React.render(
        app.getAppComponent()({context: context.getComponentContext()}),
        document.getElementById('app')
    );
});