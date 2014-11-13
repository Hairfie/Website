var express = require('express');
var router = express.Router();

var hairfie = require('../services/hairfie.js');
var metaGenerator = require('../services/metaGenerator.js');

router.get('/:id', function(req, res) {
    hairfie.getHairfie(req.params.id)
        .then(function (hairfie) {
            if (!hairfie) {
                res.status(404);
                res.send('Hairfie not found');
            } else {
                metaGenerator.getHairfieMetas(hairfie, function(metas) {
                    res.render('hairfies/show', {
                        hairfie: hairfie,
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
