var express = require('express');
var router = express.Router();

var hairfie = require('../services/hairfie.js');
var metaGenerator = require('../services/metaGenerator.js');

router.get('/:id/:slug?', function(req, res) {
    hairfie.getBusiness(req.params.id)
        .then(function (business) {
            if (!business) {
                res.status(404);
                res.send('Business not found');
            } else {
                if (business.slug != req.params.slug) {
                    return res.redirect(301, '/businesses/'+business.id+'/'+business.slug);
                }
                metaGenerator.getBusinessMetas(business, function(metas) {
                    res.render('businesses/show', {
                        business: business,
                        metas: metas
                    });
                });
            }
        })
        .catch(function () {
            res.status(500);
        });
});

module.exports = router;
