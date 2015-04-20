'use strict';

var Promise = require('q');
var _ = require('lodash');
var debug = require('debug')('Service:Facebook');
var config = require('../configs/facebook');

var loading   = false,
    deferreds = [];

module.exports = {
    load: load
};

function load() {
    var deferred = Promise.defer();

    if (typeof window === 'undefined') {
        debug('Not in browser, cannot load SDK');
        deferred.reject(new Error('Not in browser'));
        return deferred.promise;
    }

    if (window.FB) {
        debug('SDK already loaded');
        deferred.resolve(window.FB);
        return deferred.promise;
    }

    deferreds.push(deferred);

    if (!loading) {
        loading = true;
        debug('start loading SDK');
        window.fbAsyncInit = onFacebookLoad;

        (function(d, s, id){
            var fbRoot = document.createElement('div');
            fbRoot.setAttribute('id', 'fb-root');
            document.body.appendChild(fbRoot);
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    return deferred.promise;
}

function onFacebookLoad() {
    window.FB.init({
        appId   : config.APP_ID,
        version : 'v2.3'
    });

    debug('finished loading facebook SDK, resolving promises');
    _.invoke(deferreds, 'resolve', window.FB);
    deferreds = [];
}
