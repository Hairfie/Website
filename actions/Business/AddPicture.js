'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.ADD_PICTURE);

    hairfieApi
        .uploadPicture(payload.pictureToUpload, 'business-pictures', context.getAuthToken())
        .then(function (response) {
            var picture = response.result.files.image;
            if(payload.business.pictures.length > 0) {
                var pictures = payload.business.pictures.map(function(picture) {
                    if(picture.name.length === 0) {
                        return picture.url;
                    } else {
                        return picture.name;
                    }
                });
            } else {
                var pictures = [];
            }

            pictures.push(picture.name);

            var business = {
                id: payload.business.id,
                pictures : pictures
            };
            console.log("business", business);
            context.dispatch(BusinessEvents.ADD_PICTURE_SUCCESS, {
                picture: picture
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