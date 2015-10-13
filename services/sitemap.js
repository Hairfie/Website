var sm = require('sitemap');

var sitemap = sm.createSitemap ({
      hostname: 'http://www.hairfie.com',
      cacheTime: 600000,  // 600 sec cache period
      urls: [
        { url: '/page-1/',  changefreq: 'daily', priority: 0.3 },
        { url: '/page-2/',  changefreq: 'monthly',  priority: 0.7 },
        { url: '/page-3/' } // changefreq: 'weekly',  priority: 0.5
      ]
    });

module.exports = sitemap;