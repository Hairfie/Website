'use strict';

var createStore = require('fluxible/addons/createStore');
var footerLinks = require('../constants/Links').footerLinks;

module.exports = createStore({
    storeName: 'FooterLinkStore',
    all: function () {
        return footerLinks;
    }
});
