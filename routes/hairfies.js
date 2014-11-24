var express = require('express');
var router = express.Router();
var _ = require('underscore');

require('node-jsx').install({extension:'.jsx'});

var app = require('../client/app.js');
var navigateAction = require('flux-router-component').navigateAction;

var React = require('react');
var metaGenerator = require('../services/metaGenerator.js');
var hairfieApi = require('../client/services/hairfie-api-client');
var getHairfieAction = require('../client/actions/getHairfie');
var ApplicationStore = require('../client/stores/ApplicationStore');

var ROUTE_PREFIX = '/hairfies';

// NOT USED FOR THE MOMENT
var descriptionsGenerator = function(hairfie) {
    var descriptions, tags = '', oldDescription = '', businessName = '';
    if(hairfie.tags) {
        tags = _.map(hairfie.tags, function(tag) { return '#'+tag.name.replace(/ /g,''); }).join(" ");
    }
    if(hairfie.description) {
        oldDescription = ' ' + hairfie.description;
    }
    if(hairfie.business) {
        businessName = ' made at ' + hairfie.business.name;
    }
    descriptions = {
        twitter: encodeURIComponent(tags + oldDescription + businessName + ' #hairfie'),
        facebook: tags + oldDescription + businessName,
        display: tags + oldDescription
    };

    return descriptions;
};

router.get('/:id', function(req, res, next) {
    var context = app.createContext();
    var path = ROUTE_PREFIX + req.path;

    context.getActionContext().executeAction(navigateAction, {path: path}, function (err) {
        context.getActionContext().executeAction(getHairfieAction, {id: req.params.id}, function (err) {
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
