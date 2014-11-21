'use strict';

require('node-jsx').install({extension:'.jsx'});

var app = require('../client/app.js');
var navigateAction = require('flux-router-component').navigateAction;
var loginWithAuthTokenAction = require('../client/actions/loginWithAuthToken');
var authStorage = require('../client/services/auth-storage');
var React = require('react');
var metaGenerator = require('../services/metaGenerator.js');
var ApplicationStore = require('../client/stores/ApplicationStore');

module.exports = function (req, res, next) {
    var context = app.createContext();

    // TODO: remove this hard-coded value
    var path = '/pro'+req.path

    var authToken = authStorage.getToken(req);
    context.getActionContext().executeAction(loginWithAuthTokenAction, {token: authToken}, function () {
        context.getActionContext().executeAction(navigateAction, {path: path}, function (err) {
            if (err)  {
                if (err.status && err.status === 404) {
                    next();
                } else {
                    next(err);
                }
                return;
            }

            // do we need to redirect user?
            var actualRouteName = context.getActionContext().router.getRoute(path, {navigate: {path: path}}).name;
            var wantedRouteName = context.getActionContext().getStore(ApplicationStore).getCurrentRouteName();
            if (actualRouteName != wantedRouteName) {
                return res.redirect(context.getComponentContext().makePath(wantedRouteName));
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
    });
};
