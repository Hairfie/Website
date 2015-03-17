'use strict';

var resolve = require('../lib/config').resolve;

module.exports = resolve({
    namespace: 'I18N',
    defaults: {
        SUPPORTED_LOCALES: ['fr'],
        DEFAULT_LOCALE   : 'fr'
    }
});
