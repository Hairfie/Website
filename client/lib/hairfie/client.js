'use strict';

var request = require('superagent');
var Q = require('q');

function send(req, token) {
    var deferred = Q.defer();

    if (token) req.set('Authorization', token.id);

    req.end(function (res) {
        if (res.ok) {
            deferred.resolve(res.body);
        } else {
            deferred.reject({status: res.status});
        }
    });

    return deferred.promise;
};

function Client (options) {
    if (!this instanceof Client) return new Client(options);
    this.options = options;
};

Client.prototype.createUser = function (values) {
    var req = request.post(this.buildUrl('users')).send(values);

    return send(req);
};

Client.prototype.getUser = function (userId, token) {
    var req = request.get(this.buildUrl('users/'+userId));

    return send(req, token);
};

/**
 * Logs in the user
 *
 * The promise is resolved with an object { user: Object, token: Object }
 *
 * @param string email
 * @param string password
 *
 * @return Promise
 */
Client.prototype.login = function (email, password) {
    var req = request.post(this.buildUrl('users/login')).send({
        email   : email,
        password: password
    });

    var api = this;
    return send(req).then(function (token) {
        return api.getUser(token.userId, token).then(function (user) {
            return {token: token, user: user};
        });
    });
};

Client.prototype.logout = function (token) {
    var req = request.post(this.buildUrl('users/logout'))

    return send(req, token);
};

Client.prototype.buildUrl = function (path) {
    return this.options.apiUrl + '/' + path;
};

module.exports = Client;
