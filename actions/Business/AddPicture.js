'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;
var _ = require('lodash');
var debug = require('debug')('Action:Business:AddPicture');

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(BusinessEvents.ADD_PICTURE);

    context
        .getHairfieApi()
        .uploadPicture(payload.pictureToUpload, 'business-pictures')
        .then(function (picture) {
            context.dispatch(BusinessEvents.ADD_PICTURE_SUCCESS, {
                picture: picture
            });

            var business = {};
            business.id = payload.business.id;
            business.pictures = _.cloneDeep(payload.business.pictures) || [];
            business.pictures.push(picture);

            return context.getHairfieApi().saveBusiness(business);
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
