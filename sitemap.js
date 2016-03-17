var sm = require('sitemap');
var _ = require('lodash');
var links = require('./constants/Links').xmlLinks;

var urls = _.map(links, function(link) {
            return {
                url: link.url,
                priority: link.priority,
                changefreq: link.changefreq
            }
    });

var sitemap = sm.createSitemap ({
    hostname: 'http://www.hairfie.com',
    cacheTime: 600000, 
    urls: _.uniq(urls, 'url')
});

module.exports = sitemap;