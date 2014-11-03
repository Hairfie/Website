'use strict';

var Client = require('../lib/hairfie/client'),
    client = new Client({
        apiUrl: 'http://staging.hairfie.com/api',
    });


module.exports = client;
