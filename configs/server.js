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
        API_PROXY_TARGET: hairfieApi.URL,
        FB_APP_ID       : "1567052370184577",
        FB_APP_NAMESPACE: "hairfie-dev",
    },
    development: {
        DEBUG           : true,
    },
    staging: {
        HOST            : 'harifie-website-staging.herokuapp.com',
    },
    production: {
        HOST            : 'www.hairfie.com',
    }
});
