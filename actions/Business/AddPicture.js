'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;
var _ = require('lodash');
var debug = require('debug')('Action:Business:AddPicture');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessEvents.ADD_PICTURE);

    hairfieApi
        .uploadPicture(payload.pictureToUpload, 'business-pictures', context.getAuthToken())
        .then(function (picture) {
            context.dispatch(BusinessEvents.ADD_PICTURE_SUCCESS, {
                picture: picture
            });

            var business = {};
            business.id = payload.business.id;
            business.pictures = _.cloneDeep(payload.business.pictures) || [];
            business.pictures.push(picture);

            return hairfieApi.saveBusiness(business, context.getAuthToken());
        })
        .then(function(business) {
            context.dispatch(BusinessEvents.RECEIVE_SUCCESS, {
                id      : business.id,
                business: business
            });
            done();
        })
        .fail(function (e) {
            debug('Failed to add picture', e);
            context.dispatch(BusinessEvents.ADD_PICTURE_FAILURE);
            done(e);
        });
};
