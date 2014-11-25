var express = require('express');
var router = express.Router();

require('node-jsx').install({extension:'.jsx'});

var app = require('../client/app.js');
var navigateAction = require('flux-router-component').navigateAction;

var React = require('react');
var metaGenerator = require('../services/metaGenerator.js');
var hairfieApi = require('../client/services/hairfie-api-client');
var getHairfieAction = require('../client/actions/getHairfie');
var ApplicationStore = require('../client/stores/ApplicationStore');

var ROUTE_PREFIX = '/hairfies';

router.get('/:id', function(req, res, next) {
    var context = app.createContext();
    var path = ROUTE_PREFIX + req.path;
    var params = {id: req.params.id};

    context.getActionContext().executeAction(navigateAction, {path: path}, function (err) {
        context.getActionContext().executeAction(getHairfieAction, {params: params}, function (err) {
            if (err)  {
                console.log(err);
                if (err.status && err.status === 404) {
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
    });
});

module.exports = router;
