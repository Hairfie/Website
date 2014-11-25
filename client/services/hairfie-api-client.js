'use strict';

var HairfieClient = require('../lib/hairfie/client');
var config = require('../../config/config');

module.exports = new HairfieClient({
    apiUrl: config.apiUrl
});
