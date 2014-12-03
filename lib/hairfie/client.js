'use strict';

var request = require('superagent');
var Promise = require('q');
var _ = require('lodash');

function send(req, token) {
    var deferred = Promise.defer();

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

Client.prototype.getUser = function (userId, token) {
    var req = request.get(this.buildUrl('users/'+userId));

    return send(req, token);
};

Client.prototype.getHairfie = function (hairfieId) {
    var req = request.get(this.buildUrl('hairfies/' + hairfieId));
    return send(req);
};

Client.prototype.getBusiness = function (businessId) {
    var req = request.get(this.buildUrl('businesses/' + businessId));

    return send(req);
};

/**
 * Signs up the user
 *
 * @param string email
 * @param string password
 *
 * @return Promise
 */
Client.prototype.signup = function (values) {
    var req = request.post(this.buildUrl('users')).send(values);

    return send(req)
        .then(function (user) {
            return {
                user    : user,
                token   : user.token
            }
        });
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

Client.prototype.saveBusiness = function (business, token) {
    var req;
    if (business.id) {
        req = request.put(this.buildUrl('businesses/'+business.id));
    } else {
        req = request.post(this.buildUrl('businesses'));
    }
    req.send(business);

    return send(req, token);
};

Client.prototype.saveBusinessClaim = function (businessClaim, token) {
    var req;
    if (businessClaim.id) {
        req = request.put(this.buildUrl('businessClaims/'+businessClaim.id)).send(businessClaim);
    } else {
        req = request.post(this.buildUrl('businessClaims')).send(businessClaim);
    }

    return send(req, token);
};

Client.prototype.submitBusinessClaim = function (businessClaim, token) {
    var req = request.post(this.buildUrl('businessClaims/'+businessClaim.id+'/submit'));

    return send(req, token);
};

Client.prototype.getBusinessClaim = function (businessClaimId, token) {
    var req = request.get(this.buildUrl('businessClaims/'+businessClaimId));

    return send(req, token);
};

Client.prototype.getManagedBusinesses = function (user, token) {
    var req = request.get(this.buildUrl('users/'+user.id+'/managed-businesses'));

    return send(req, token);
};

Client.prototype.getBusinessHairdressers = function (business, token) {
    var req = request.get(this.buildUrl('businesses/'+business.id+'/hairdressers'));

    return send(req, token);
};

Client.prototype.saveHairdresser = function (hairdresser, token) {
    var payload = _.cloneDeep(hairdresser);
    payload.businessId = hairdresser.business ? hairdresser.business.id : null;
    payload.business = undefined;

    var req;
    if (hairdresser.id) {
        req = request.put(this.buildUrl('hairdressers/'+hairdresser.id)).send(payload);
    } else {
        req = request.post(this.buildUrl('hairdressers')).send(payload);
    }

    return send(req, token);
};

Client.prototype.buildUrl = function (path) {
    return this.options.apiUrl + '/' + path;
};

module.exports = Client;
