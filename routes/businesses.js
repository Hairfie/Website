var express = require('express');
var router = express.Router();

require('node-jsx').install({extension:'.jsx'});

var app = require('../client/app.js');
var navigateAction = require('flux-router-component').navigateAction;

var React = require('react');
var metaGenerator = require('../services/metaGenerator.js');
var hairfieApi = require('../client/services/hairfie-api-client');
var getBusinessAction = require('../client/actions/getBusiness');
var ApplicationStore = require('../client/stores/ApplicationStore');

var ROUTE_PREFIX = '/businesses'

router.get('/:id/:slug?', function(req, res, next) {
    var context = app.createContext();
    var path = ROUTE_PREFIX + req.path;

    context.getActionContext().executeAction(navigateAction, {path: path}, function (err) {
        context.getActionContext().executeAction(getBusinessAction, {id: req.params.id}, function (err) {
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

// router.get('/:id/:slug?', function(req, res) {
//     hairfie.getBusiness(req.params.id)
//         .then(function (business) {
//             if (!business) {
//                 res.status(404);
//                 res.send('Business not found');
//             } else {
//                 if (business.slug != req.params.slug) {
//                     return res.redirect(301, '/businesses/'+business.id+'/'+business.slug);
//                 }
//                 metaGenerator.getBusinessMetas(business, function(metas) {
//                     res.render('businesses/show', {
//                         business: business,
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
