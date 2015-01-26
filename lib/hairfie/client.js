'use strict';

var request = require('superagent');
var Promise = require('q');
var qs = require('qs');
var _ = require('lodash');

function send(req, token) {
    var deferred = Promise.defer();

    if (token) req.set('Authorization', token.id);

    req.end(function (res) {
        if (res.ok) {
            deferred.resolve(res.body);
        } else {
            deferred.reject(res);
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

Client.prototype.getUsersByQuery = function (query, token) {
    var req = request.get(this.buildUrl('users?q='+query));

    return send(req, token).then(function (results) { return results || []; });
};

Client.prototype.saveUser = function (user, token) {
    var req = request.put(this.buildUrl('users/'+user.id)).send(user);

    return send(req, token);
};

Client.prototype.getHairfie = function (hairfieId) {
    var req = request.get(this.buildUrl('hairfies/' + hairfieId));
    return send(req);
};

Client.prototype.deleteHairfie = function (hairfie, token) {
    var req = request.del(this.buildUrl('hairfies/'+ hairfie.id));

    return send(req, token);
};

Client.prototype.getBusiness = function (businessId) {
    var req = request.get(this.buildUrl('businesses/' + businessId));
    return send(req);
};

Client.prototype.searchNearby = function (gps, query) {
    var req = request
        .get(this.buildUrl('businesses/nearby'))
        .query({
            'here[lat]' : gps.lat,
            'here[lng]' : gps.lng,
            'query'     : query
        });

    return send(req).then(function (results) { return results || []; });
};

Client.prototype.listLatestByBusiness = function (businessId, limit, skip) {
    var options = {
        filter: {
            order: 'createdAt DESC',
            limit: limit,
            skip: skip,
            where: {
                businessId: businessId
            }
        }
    };
    var url = this.buildUrl('hairfies?' + qs.stringify(options));
    var req = request.get(url);
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
            var accessToken = user.accessToken;
            user.accessToken = undefined;

            return {
                user    : user,
                token   : accessToken
            }
        })
        .fail(function (res) {
            var error = {};
            if (hasErrorCode(res, 'email', 'uniqueness')) {
                error.emailAlreadyExists = true;
            }
            throw error;
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

Client.prototype.loginWithFacebookToken = function (token) {
    var api = this,
        req = request.post(this.buildUrl('auth/facebook/token')).send({
            access_token: token
        });

    return send(req).then(function (token) {
        return api.getUser(token.userId, token).then(function (user) {
            return {token: token, user: user};
        });
    });
};

Client.prototype.linkFacebookToken = function (fbToken, token) {
    var api = this,
        req = request.post(this.buildUrl('link/facebook/token')).send({
            access_token: fbToken
        });

    return send(req, token);
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
    req.send(payload(business, {
        pictures: ['pictures']
    }));

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

Client.prototype.claimExistingBusiness = function (business, token) {
    var req = request.post(this.buildUrl('businesses/'+business.id+'/claim'));

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

Client.prototype.getBusinessCustomers = function (businessId, token) {
    var req = request.get(this.buildUrl('businesses/' + businessId + '/customers'));

    return send(req, token);
};

Client.prototype.getBusinessHairdressers = function (business, token) {
    var req = request.get(this.buildUrl('businessMembers?filter[where][businessId]='+business.id));

    return send(req, token);
};

Client.prototype.saveHairdresser = function (hairdresser, token) {
    var req;
    if (hairdresser.id) {
        req = request.put(this.buildUrl('businessMembers/'+hairdresser.id));
    } else {
        req = request.post(this.buildUrl('businessMembers'));
    }
    req.send(payload(hairdresser, {
        refs: ['business']
    }));

    return send(req, token);
};

Client.prototype.getServices = function () {
    var req = request.get(this.buildUrl('services'));

    return send(req);
};

Client.prototype.getBusinessServicesByBusiness = function (businessId) {
    var req = request.get(this.buildUrl('businessServices?filter[where][businessId]='+businessId));

    return send(req);
};

Client.prototype.saveBusinessService = function (businessService, token) {
    var req;
    if (businessService.id) {
        req = request.put(this.buildUrl('businessServices/'+businessService.id));
    } else {
        req = request.post(this.buildUrl('businessServices'));
    }
    req.send(payload(businessService, {
        refs: ['business', 'service']
    }));

    return send(req, token);
};

Client.prototype.deleteBusinessService = function (businessService, token) {
    var req = request.del(this.buildUrl('businessServices/'+businessService.id));

    return send(req, token);
};

Client.prototype.getBusinessMembersByBusiness = function (businessId, token) {
    var req = request.get(this.buildUrl('businessMembers?filter[where][businessId]='+businessId));

    return send(req, token);
};

Client.prototype.saveBusinessMember = function (businessMember, token) {
    var req;
    if (businessMember.id) {
        req = request.put(this.buildUrl('businessMembers/'+businessMember.id));
    } else {
        req = request.post(this.buildUrl('businessMembers'));
    }
    req.send(payload(businessMember, {
        refs    : ['business', 'user'],
        pictures: ['picture']
    }));

    return send(req, token);
};

Client.prototype.uploadPicture = function (file, container, token, onProgress) {
    var req = request.post(this.buildUrl('containers/' + container + '/upload'));
    req.attach('picture', file, file.name);

    if (onProgress) {
        req.on('progress', function (e) {
            onProgress({
                percent: e.percent
            });
        });
    }

    return send(req, token)
        .then(function (data) {
            return data.result.files['picture'];
        })
        .then(function (picture) {
            // if we try to download the picture to early, it doesn't work, so let's wait
            // for 500ms
            var deferred = Promise.defer();
            setTimeout(deferred.resolve.bind(deferred, picture), 500);
            return deferred.promise;
        });
};

Client.prototype.getBusinessFacebookPage = function (business, token) {
    var req = request.get(this.buildUrl('businesses/'+business.id+'/facebook-page'));

    return send(req, token)
        .fail(function (error) {
            if (error.notFound) return null;
            else throw error;
        });
};

Client.prototype.saveBusinessFacebookPage = function (business, facebookPage, token) {
    var req = request.put(this.buildUrl('businesses/'+business.id+'/facebook-page')).send(facebookPage);

    return send(req, token);
};

Client.prototype.deleteBusinessFacebookPage = function (business, token) {
    var req = request.del(this.buildUrl('businesses/'+business.id+'/facebook-page'));

    return send(req, token);
};

Client.prototype.saveBooking = function (booking) {
    var req = request.post(this.buildUrl('bookings')).send(booking);

    return send(req);
};

Client.prototype.getBooking = function (bookingId) {
    var req = request.get(this.buildUrl('bookings/' + bookingId));
    return send(req);
};

Client.prototype.getBusinessReviewRequest = function (id) {
    var req = request.get(this.buildUrl('businessReviewRequests/'+id));

    return send(req)
        .fail(function (error) {
            if (error.notFound) return null;
            else throw error;
        });
};

Client.prototype.saveBusinessReview = function (review) {
    var req = request
        .post(this.buildUrl('businessReviews'))
        .send(payload(review, {
            refs: ['request']
        }));

    return send(req);
};

Client.prototype.buildUrl = function (path) {
    return this.options.apiUrl + '/' + path;
};

module.exports = Client;

function payload(model, options) {
    var options = options || {};
    var payload = _.cloneDeep(model);

    _.map(options.refs || [], cleanRef.bind(null, payload));
    _.map(options.pictures || [], cleanPicture.bind(null, payload));

    return payload;
}

function cleanRef(model, ref) {
    if (model[ref]) model[ref+'Id'] = model[ref].id;
    model[ref] = undefined;
}

function cleanPicture(model, picture) {
    if (!model[picture]) return;

    if (_.isArray(model[picture])) {
        model[picture] = _.map(model[picture], pictureToApiValue);
    } else {
        model[picture] = pictureToApiValue(model[picture]);
    }
}

function pictureToApiValue(picture) {
    return _.isObject(picture) && picture.name || picture;
}

function hasErrorCode(res, property, code) {
    var codes = res.body
        && res.body.error
        && res.body.error.details
        && res.body.error.details.codes
        && res.body.error.details.codes[property];

    return codes && -1 != codes.indexOf(code);
}
