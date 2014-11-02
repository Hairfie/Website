'use strict';

var Client = require('../lib/hairfie/client'),
    client = new Client({
        apiUrl: 'https://hairfie.herokuapp.com/api',
    });


module.exports = client;
