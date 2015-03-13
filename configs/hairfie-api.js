'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace:  'HAIRFIE_API',
    defaults: {
        URL: 'http://localhost:3000/api'
    },
    local: {
        URL: 'http://localhost:3001/api'
    },
    staging: {
        URL: 'http://api-staging.hairfie.com/api'
    },
    production: {
        URL: 'http://api.hairfie.com/api'
    }
});
