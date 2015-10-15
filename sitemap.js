var sm = require('sitemap');
var _ = require('lodash');
var links = require('./constants/Links').xmlLinks;

var sitemap = sm.createSitemap ({
    hostname: 'http://www.hairfie.com',
    cacheTime: 600000, 
    urls: _.map(links, 'url')
});

module.exports = sitemap;