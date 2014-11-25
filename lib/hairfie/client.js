'use strict';

var q       = require('q'),
    request = require('request');

function HairfieClient(options) {
    if (!this instanceof HairfieClient) return new HairfieClient(options);
    this.options = options;
}

HairfieClient.prototype.getHairfie = function (id) {
    return this.request('GET', 'hairfies/'+id);
};

HairfieClient.prototype.getBusiness = function (id) {
    return this.request('GET', 'businesses/'+id);
};

HairfieClient.prototype.request = function (method, path) {
    var deferred = q.defer();

    request(this.buildUrl(path), function (error, response, body) {
        if (error) return deferred.reject(error);
        if (200 != response.statusCode) return deferred.resolve(null);
        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

HairfieClient.prototype.buildUrl = function (path) {
    return this.options.apiUrl + '/' + path;
};

module.exports = HairfieClient;