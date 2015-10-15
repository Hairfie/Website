'use strict';

var createStore = require('fluxible/addons/createStore');
var homeLinks = require('../constants/links').homeLinks;

module.exports = createStore({
    storeName: 'HomeLinkStore',
    all: function () {
        return homeLinks;
    }
});
