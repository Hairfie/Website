'use strict';

require('node-jsx').install({extension:'.jsx'});

var app = require('../client/app.js');
var navigateAction = require('flux-router-component').navigateAction;
var React = require('react');
var metaGenerator = require('../services/metaGenerator.js');

module.exports = function (req, res, next) {
    var context = app.createContext();

    // TODO: remove this hard-coded value
    var path = '/pro'+req.path

    context.getActionContext().executeAction(navigateAction, {path: path}, function (err) {
        if (err)  {
            if (err.status && err.status === 404) {
                console.log('toto');
                next();
            } else {
                next(err);
            }
            return;
        }

        var appHtml = React.renderToString(app.getAppComponent()({
            context: context.getComponentContext()
        }));
        var appState = app.dehydrate(context);

        res.render('index/app', {
            title: 'Hairfie',
            appHtml: appHtml,
            appState: appState
        });
    });
};
