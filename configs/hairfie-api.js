'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace:  'HAIRFIE_API',
    defaults: {
        URL: 'http://api.hairfie.com/exp'
    },
    local: {
        URL: 'http://localhost:3001/exp'
    },
    staging: {
        URL: 'http://api-staging.hairfie.com/exp'
    },
    production: {
        URL: 'http://api.hairfie.com/exp'
    }
});
