var express = require('express');
var router = express.Router();

var metaGenerator = require('../services/metaGenerator.js');

/* GET home page. */
router.get('/', function(req, res) {
    metaGenerator.getHomeMetas(function(metas) {
        console.log("locale", req.getLocale());

        console.log(req.__('Hello!'));
        res.render('index/index', {
            title: 'Hairfie',
            metas: metas
        });
    });
});

module.exports = router;
