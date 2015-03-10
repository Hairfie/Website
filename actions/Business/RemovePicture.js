'use strict';

var SaveBusiness = require('./Save');
var _ = require('lodash');

module.exports = function (context, payload, done) {
    var business = {
        id      : payload.business.id,
        pictures: _.cloneDeep(payload.business.pictures)
    };

    business.pictures = _.reject(business.pictures, function (picture) {
        return picture.name == payload.picture.name;
    });

    context.executeAction(SaveBusiness, {business: business}, done);
};
