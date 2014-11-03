var express = require('express');
var router = express.Router();

var hairfie = require('../services/hairfie.js');

router.get('/:id', function(req, res) {
    hairfie.getHairfie(req.params.id)
        .then(function (hairfie) {
            if (!hairfie) {
                res.status(404);
                res.send('Hairfie not found');
            } else {
                res.render('hairfies/show', {
                    hairfie: hairfie
                });
            }
        })
        .catch(function () {
            res.status(500);
        });
});

module.exports = router;
