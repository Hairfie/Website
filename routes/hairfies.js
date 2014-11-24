// var express = require('express');
// var router = express.Router();

require('node-jsx').install({extension:'.jsx'});

var app = require('../client/app.js');
var navigateAction = require('flux-router-component').navigateAction;
var React = require('react');
var metaGenerator = require('../services/metaGenerator.js');

// Client side
var ApplicationStore = require('../client/stores/ApplicationStore');
var hairfieApi = require('../client/services/hairfie-api-client');



module.exports = function (req, res, next) {
    var context = app.createContext();

    context.getActionContext().executeAction(navigateAction, {path: req.path}, function (err) {
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
};

// router.get('/:id', function(req, res) {
//     hairfie.getHairfie(req.params.id)
//         .then(function (hairfie) {
//             if (!hairfie) {
//                 res.status(404);
//                 res.send('Hairfie not found');
//             } else {
//                 metaGenerator.getHairfieMetas(hairfie, function(metas) {
//                     res.render('hairfies/show', {
//                         hairfie: hairfie,
//                         metas: metas
//                     });
//                 });
//             }
//         })
//         .catch(function () {
//             res.status(500);
//         });
// });

// module.exports = router;
