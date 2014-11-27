'use strict';

var HairfieClient = require('../lib/hairfie/client');
var config = require('../configs/hairfie-api');

module.exports = new HairfieClient({
    apiUrl: config.URL
});
