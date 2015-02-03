'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace:  'HAIRFIE_API',
    defaults: {
        URL: 'http://api-staging.hairfie.com/api'
    },
    local: {
        URL: 'http://api-staging.hairfie.com/api'
    },
    staging: {
        URL: 'http://api-staging.hairfie.com/api'
    },
    production: {
        URL: 'http://api.hairfie.com/api'
    }
});
