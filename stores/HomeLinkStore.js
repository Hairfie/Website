'use strict';

var createStore = require('fluxible/addons/createStore');
var homeLinks = require('../constants/Links').homeLinks;

module.exports = createStore({
    storeName: 'HomeLinkStore',
    all: function () {
        return homeLinks;
    }
});
