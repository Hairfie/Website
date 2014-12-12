'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace:  'HAIRFIE_API',
    defaults: {
        //URL: 'http://api-staging.hairfie.com/api'
        URL: 'http://localhost:3000/api'
    },
    production: {
        URL: 'http://api.hairfie.com/api'
    }
});
