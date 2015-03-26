'use strict';

var request = require('superagent');
var Q = require('q');
var qs = require('qs');
var _ = require('lodash-contrib');

function Client (options) {
    if (!this instanceof Client) return new Client(options);
    this.options = options;
};

module.exports = Client;

Client.prototype.getUser = function (userId, config) {
    var req = request.get(this._buildUrl('users/'+userId));

    return this._send(req, config);
};

Client.prototype.getUsersByQuery = function (query, config) {
    var req = request.get(this._buildUrl('users?q='+query));

    return this._send(req, config).then(function (results) { return results || []; });
};

Client.prototype.saveUser = function (user, config) {
    var req = request.put(this._buildUrl('users/'+user.id)).send(user);

    return this._send(req, config);
};

Client.prototype.getHairfies = function (filter, config) {
    var req = request.get(this._buildUrl('hairfies?'+qs.stringify({filter: filter})));

    return this._send(req);
};

Client.prototype.getBusinessReviews = function (filter, config) {
    var req = request
        .get(this._buildUrl('businessReviews'))
        .query(_.toQuery({
            filter: filter
        }));

    return this._send(req);
};

Client.prototype.getHairfie = function (hairfieId, config) {
    var req = request.get(this._buildUrl('hairfies/' + hairfieId));
    return this._send(req, config);
};

Client.prototype.deleteHairfie = function (hairfie, config) {
    var req = request.del(this._buildUrl('hairfies/'+ hairfie.id));

    return this._send(req, config);
};

Client.prototype.getTopHairfies = function (limit, config) {
    var req = request.get(this._buildUrl('tops/hairfies?limit='+limit));
    return this._send(req, config);
};

Client.prototype.getCategories = function (limit, config) {
    var req = request.get(this._buildUrl('categories'));
    return this._send(req, config);
};

Client.prototype.getStations = function (location, config) {
    var req = request.get(this._buildUrl('stations?location[lat]=' + location.lat + '&location[lng]=' + location.lng));
    return this._send(req, config);
};

Client.prototype.getBusiness = function (businessId, config) {
    var req = request.get(this._buildUrl('businesses/' + businessId));
    return this._send(req, config);
};

Client.prototype.searchNearby = function (gps, query, config) {
    var req = request
        .get(this._buildUrl('businesses/nearby'))
        .query({
            'here[lat]' : gps.lat,
            'here[lng]' : gps.lng,
            'query'     : query
        });

    return this._send(req, config).then(function (results) { return results || []; });
};


Client.prototype.getTopDeals = function (limit, config) {
    var req = request.get(this._buildUrl('tops/deals')).query({limit: limit});
    return this._send(req, config);
};

Client.prototype.getBusinessSearchResult = function (query, config) {
    var req = request
        .get(this._buildUrl('businesses/search'))
        .query(_.toQuery(query));

    return this._send(req, config);
};

Client.prototype.listLatestByBusiness = function (businessId, limit, skip, config) {
    var query = {
        filter: {
            order: 'createdAt DESC',
            limit: limit,
            skip: skip,
            where: {
                businessId: businessId
            }
        }
    };
    var url = this._buildUrl('hairfies?' + qs.stringify(query));
    var req = request.get(url);
    return this._send(req, config);
};

/**
 * Signs up the user
 *
 * @param string email
 * @param string password
 *
 * @return Q
 */
Client.prototype.signup = function (values, config) {
    var req = request.post(this._buildUrl('users')).send(values);

    return this._send(req, config)
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
 * @return Q
 */
Client.prototype.login = function (email, password, config) {
    var req = request.post(this._buildUrl('users/login')).send({
        email   : email,
        password: password
    });

    var api = this;
    return this._send(req, _.assign({}, config, {token: null})).then(function (token) {
        return api.getUser(token.userId, _.assign({}, config, {token: token})).then(function (user) {
            return {token: token, user: user};
        });
    });
};

Client.prototype.reportLostPassword = function (email, config) {
    var req = request.post(this._buildUrl('users/reset')).send({email: email});

    return this._send(req, _.assign({}, config, {token: null}));
};

Client.prototype.loginWithFacebookToken = function (fbToken, config) {
    var api = this,
        req = request.post(this._buildUrl('auth/facebook/token')).send({
            access_token: fbToken
        });

    return this._send(req, _.assign({}, config, {token: null})).then(function (token) {
        return api.getUser(token.userId, _.assign({}, config, {token: token})).then(function (user) {
            return {token: token, user: user};
        });
    });
};

Client.prototype.linkFacebookToken = function (fbToken, config) {
    var api = this,
        req = request.post(this._buildUrl('link/facebook/token')).send({
            access_token: fbToken
        });

    return this._send(req, config);
};

Client.prototype.logout = function (config) {
    var req = request.post(this._buildUrl('users/logout'))

    return this._send(req, config);
};

Client.prototype.saveBusiness = function (business, config) {
    var req;
    if (business.id) {
        req = request.put(this._buildUrl('businesses/'+business.id));
    } else {
        req = request.post(this._buildUrl('businesses'));
    }
    req.send(payload(business, {
        pictures: ['pictures']
    }));

    return this._send(req, config);
};

Client.prototype.saveBusinessClaim = function (businessClaim, config) {
    var req;
    if (businessClaim.id) {
        req = request.put(this._buildUrl('businessClaims/'+businessClaim.id)).send(businessClaim);
    } else {
        req = request.post(this._buildUrl('businessClaims')).send(businessClaim);
    }

    return this._send(req, config);
};

Client.prototype.claimExistingBusiness = function (business, config) {
    var req = request.post(this._buildUrl('businesses/'+business.id+'/claim'));

    return this._send(req, config);
};

Client.prototype.submitBusinessClaim = function (businessClaim, config) {
    var req = request.post(this._buildUrl('businessClaims/'+businessClaim.id+'/submit'));

    return this._send(req, config);
};

Client.prototype.getBusinessClaim = function (businessClaimId, config) {
    var req = request.get(this._buildUrl('businessClaims/'+businessClaimId));

    return this._send(req, config);
};

Client.prototype.getManagedBusinesses = function (user, config) {
    var req = request.get(this._buildUrl('users/'+user.id+'/managed-businesses'));

    return this._send(req, config);
};

Client.prototype.getBusinessCustomers = function (businessId, config) {
    var req = request.get(this._buildUrl('businesses/' + businessId + '/customers'));

    return this._send(req, config);
};

Client.prototype.getBusinessHairdressers = function (business, config) {
    var req = request.get(this._buildUrl('businessMembers?filter[where][businessId]='+business.id));

    return this._send(req, config);
};

Client.prototype.saveHairdresser = function (hairdresser, config) {
    var req;
    if (hairdresser.id) {
        req = request.put(this._buildUrl('businessMembers/'+hairdresser.id));
    } else {
        req = request.post(this._buildUrl('businessMembers'));
    }
    req.send(payload(hairdresser, {
        refs: ['business']
    }));

    return this._send(req, config);
};

Client.prototype.getBusinessServicesByBusiness = function (businessId, config) {
    var req = request.get(this._buildUrl('businessServices?filter[where][businessId]='+businessId));

    return this._send(req, config);
};

Client.prototype.saveBusinessService = function (businessService, config) {
    var req;
    if (businessService.id) {
        req = request.put(this._buildUrl('businessServices/'+businessService.id));
    } else {
        req = request.post(this._buildUrl('businessServices'));
    }
    req.send(payload(businessService, {
        refs: ['business', 'service']
    }));

    return this._send(req, config);
};

Client.prototype.deleteBusinessService = function (businessService, config) {
    var req = request.del(this._buildUrl('businessServices/'+businessService.id));

    return this._send(req, config);
};

Client.prototype.getBusinessMembersByBusiness = function (businessId, config) {
    var req = request.get(this._buildUrl('businessMembers?filter[where][businessId]='+businessId));

    return this._send(req, config);
};

Client.prototype.saveBusinessMember = function (businessMember, config) {
    var req;
    if (businessMember.id) {
        req = request.put(this._buildUrl('businessMembers/'+businessMember.id));
    } else {
        req = request.post(this._buildUrl('businessMembers'));
    }
    req.send(payload(businessMember, {
        refs    : ['business', 'user'],
        pictures: ['picture']
    }));

    return this._send(req, config);
};

Client.prototype.uploadPicture = function (file, container, onProgress, config) {
    var req = request.post(this._buildUrl('containers/' + container + '/upload'));
    req.attach('picture', file, file.name);

    if (onProgress) {
        req.on('progress', function (e) {
            onProgress({
                percent: e.percent
            });
        });
    }

    return this._send(req, config)
        .then(function (data) {
            return data.result.files['picture'];
        });
};

Client.prototype.getBusinessFacebookPage = function (business, config) {
    var req = request.get(this._buildUrl('businesses/'+business.id+'/facebook-page'));

    return this._send(req, config)
        .fail(function (error) {
            if (error.notFound) return null;
            else throw error;
        });
};

Client.prototype.saveBusinessFacebookPage = function (business, facebookPage, config) {
    var req = request.put(this._buildUrl('businesses/'+business.id+'/facebook-page')).send(facebookPage);

    return this._send(req, config);
};

Client.prototype.deleteBusinessFacebookPage = function (business, config) {
    var req = request.del(this._buildUrl('businesses/'+business.id+'/facebook-page'));

    return this._send(req, config);
};

Client.prototype.saveBooking = function (booking, config) {
    var req = request.post(this._buildUrl('bookings')).send(booking);

    return this._send(req, config);
};

Client.prototype.getBooking = function (bookingId, config) {
    var req = request.get(this._buildUrl('bookings/' + bookingId));

    return this._send(req, config);
};

Client.prototype.getBusinessReviewRequest = function (id, config) {
    var req = request.get(this._buildUrl('businessReviewRequests/'+id));

    return this._send(req, config)
        .fail(function (error) {
            if (error.notFound) return null;
            else throw error;
        });
};

Client.prototype.saveBusinessReview = function (review, config) {
    var req = request
        .post(this._buildUrl('businessReviews'))
        .send(payload(review, {
            refs: ['request']
        }));

    return this._send(req, config);
};

Client.prototype.queryPlaces = function (query, config) {
    var req = request.get(this._buildUrl('places')).query(query);
    return this._send(req);
};

Client.prototype._buildUrl = function (path) {
    return this.options.apiUrl + '/' + path;
};

Client.prototype._send = function (req, configOverride) {
    var deferred = Q.defer();

    var config = _.assign(this._getConfig(), configOverride);

    if (config.token) req.set('Authorization', config.token.id);
    if (config.locale) req.set('Accept-Language', config.locale);

    req.end(function (err, res) {
        if (res.ok) {
            deferred.resolve(res.body);
        } else {
            deferred.reject(res);
        }
    });

    return deferred.promise;
};

Client.prototype._getConfig = function () {
    return {
        token   : this.options.token && this.options.token(),
        locale  : this.options.locale && this.options.locale()
    };
};

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
    return _.isObject(picture) && (picture.name || picture.url) || picture;
}

function hasErrorCode(res, property, code) {
    var codes = res.body
        && res.body.error
        && res.body.error.details
        && res.body.error.details.codes
        && res.body.error.details.codes[property];

    return codes && -1 != codes.indexOf(code);
}
