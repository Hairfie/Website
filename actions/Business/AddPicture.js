'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;
var _ = require('lodash');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.ADD_PICTURE);

    hairfieApi
        .uploadPicture(payload.pictureToUpload, 'business-pictures', context.getAuthToken())
        .then(function (response) {
            var pictureUploaded = response.result.files.image;
            console.log("picture", pictureUploaded);
            var pictures = _.reduce(payload.business.pictures, function(arr, picture) {
                if(picture.name) {
                    arr.push(picture.name);
                }
                return arr;
            }, []);
            console.log("pictures", pictures);

            pictures.push(pictureUploaded.name);
            var business = {
                id: payload.business.id,
                pictures : pictures
            };
            context.dispatch(BusinessEvents.ADD_PICTURE_SUCCESS, {
                picture: pictureUploaded
            });
            return hairfieApi.saveBusiness(business, context.getAuthToken())
        })
        .then(function(business) {
            context.dispatch(BusinessEvents.SAVE_SUCCESS, {
                business: business
            });
        })
        .fail(function () {
            context.dispatch(BusinessEvents.ADD_PICTURE_FAILURE);
        });
};