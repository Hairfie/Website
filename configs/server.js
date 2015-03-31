'use strict';

var resolve = require('../lib/config').resolve;
var hairfieApi = require('./hairfie-api');

module.exports = resolve({
    defaults: {
        DEBUG           : true,
        URL             : 'http://localhost:3001',
        HOST            : 'localhost',
        PORT            : 3001,
        API_PROXY_PATH  : '/api',
        ROBOTS          : 'robots-staging.txt',
        APP_FILE        : '/build/js/app.js',
        API_PROXY_TARGET: hairfieApi.URL,
        CDN_URL         : process.env.CDN_URL || ''
    },
    development: {
        DEBUG            : true,
    },
    staging: {
        DEBUG            : false,
        HOST             : 'www-staging.hairfie.com',
        APP_FILE         : '/build/js/app.min.js'
    },
    production: {
        DEBUG            : false,
        HOST             : 'www.hairfie.com',
        ROBOTS           : 'robots-production.txt',
        APP_FILE         : '/build/js/app.min.js'
    }
});
