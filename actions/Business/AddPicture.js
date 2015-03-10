'use strict';

var SaveBusiness = require('./Save');
var _ = require('lodash');

module.exports = function (context, payload, done) {
    var pictures = _.cloneDeep(payload.business.pictures);
    pictures.push(payload.picture);

    var business = {
        id      : payload.business.id,
        pictures: pictures
    };

    context.executeAction(SaveBusiness, {business: business}, done);
};
