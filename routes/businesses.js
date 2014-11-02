var express = require('express');
var router = express.Router();

var hairfie = require('../services/hairfie.js');

/* GET users listing. */
router.get('/:id', function(req, res) {
    hairfie
        .getBusiness(req.params.id)
        .then(function (business) {
            if (!business) {
                res.status(404);
                res.send('Business not found');
            } else {
                res.send('<h1>'+business.name+'</h1>');
            }
        })
        .catch(function () {
            res.status(500);
        })
    ;
});

module.exports = router;
