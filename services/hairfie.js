'use strict';

var config = require('../config/config');


var Client = require('../lib/hairfie/client'),
    client = new Client({
        apiUrl: config.apiUrl
    });


module.exports = client;
