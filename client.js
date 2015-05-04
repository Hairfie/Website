'use strict';

var React = require('react');
var app = require('./app');
var appState = window.App;

window.debug = require('debug');

app.rehydrate(appState, function (error, context) {
    if (error) throw error;

    React.render(
        React.createFactory(app.getComponent())({context: context.getComponentContext()}),
        document.getElementById('app')
    );
});
