'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace:  'HAIRFIE_API',
    defaults: {
        URL: 'http://api-staging.hairfie.com/v1'
    },
    local: {
        URL: 'http://localhost:3001/v1'
    },
    staging: {
        URL: 'http://api-staging.hairfie.com/v1'
    },
    production: {
        URL: 'http://api.hairfie.com/v1'
    }
});
