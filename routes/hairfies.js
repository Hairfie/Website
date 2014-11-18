var express = require('express');
var router = express.Router();
var _ = require('underscore');

var hairfie = require('../services/hairfie.js');
var metaGenerator = require('../services/metaGenerator.js');

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

router.get('/:id', function(req, res) {
    hairfie.getHairfie(req.params.id)
        .then(function (hairfie) {
            if (!hairfie) {
                res.status(404);
                res.send('Hairfie not found');
            } else {
                hairfie.descriptions = descriptionsGenerator(hairfie);
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
