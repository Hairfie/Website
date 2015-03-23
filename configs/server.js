'use strict';

var resolve = require('../lib/config').resolve;
var hairfieApi = require('./hairfie-api');

module.exports = resolve({
    defaults: {
        DEBUG           : false,
        URL             : 'http://localhost:3001',
        HOST            : 'localhost',
        PORT            : 3001,
        API_PROXY_PATH  : '/api',
        ROBOTS          : 'robots-staging.txt',
        APP_FILE         : '/build/js/app.js',
        API_PROXY_TARGET: hairfieApi.URL
    },
    development: {
        DEBUG           : true,
    },
    staging: {
        HOST            : 'www-staging.hairfie.com',
        APP_FILE         : '/build/js/app.min.js'
    },
    production: {
        HOST            : 'www.hairfie.com',
        ROBOTS           : 'robots-production.txt',
        APP_FILE         : '/build/js/app.min.js'
    }
});
