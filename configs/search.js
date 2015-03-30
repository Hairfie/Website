'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace: 'SEARCH',
    defaults: {
        DEFAULT_RADIUS: 1000,
        DEFAULT_ADDRESS: 'Paris, France'
    }
});
