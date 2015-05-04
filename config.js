'use strict';

var pkg = require('./package.json');

module.exports = {
    version                     : pkg.version,
    debug                       : 'true' === process.env.DEBUG,
    url                         : process.env.URL,
    cdnUrl                      : process.env.CDN_URL,
    hairfieApiUrl               : process.env.HAIRFIE_API_URL,
    facebookAppId               : process.env.FACEBOOK_APP_ID,
    facebookAppNamespace        : process.env.FACEBOOK_APP_NAMESPACE,
    googleAnalyticsTrackingCode : process.env.GOOGLE_ANALYTICS_TRACKING_CODE,
};
