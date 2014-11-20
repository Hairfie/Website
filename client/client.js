'use strict';

var React = require('react');
var app = require('./app');
var appState = window.appState;

app.rehydrate(appState, function (error, context) {
    if (error) throw error;
    React.render(
        app.getAppComponent()({context: context.getComponentContext()}),
        document.getElementById('app')
    );
});
