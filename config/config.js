var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    debug: true,
    url: 'http://localhost:3001',
    apiUrl: 'http://staging.hairfie.com/api',
    facebookAppId: "1567052370184577",
    facebookAppNamespace: "hairfie-dev",
    facebookAppAccessToken: "1567052370184577|C2qSlkEfz8-XtgZZzdLJFslO9SE",
    host: "localhost",
    restApiRoot: "/api",
    locales: ["en", "fr"]
  },
  staging: {
    debug: true,
    url: 'http://hairfie-website-staging.herokuapp.com',
    apiUrl: 'http://staging.hairfie.com/api',
    facebookAppId: "1567052370184577",
    facebookAppNamespace: "hairfie-dev",
    facebookAppAccessToken: "1567052370184577|C2qSlkEfz8-XtgZZzdLJFslO9SE",
    host: "www-staging.hairfie.com",
    restApiRoot: "/api",
    locales: ["en", "fr"],
  },
  production: {
    url: process.env.URL,
    apiUrl: 'http://hairfie.herokuapp.com/api',
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppNamespace: process.env.FACEBOOK_APP_NAMESPACE,
    facebookAppAccessToken: process.env.FACEBOOK_APP_ACCESS_TOKEN,
    host: "www.hairfie.com",
    restApiRoot: "/api",
    locales: ["en", "fr"],
  }
};

module.exports = config[env];
