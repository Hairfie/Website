'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.ADD_PICTURE);

    hairfieApi
        .uploadPicture(payload.pictureToUpload, 'business-pictures', context.getAuthToken())
        .then(function (response) {
            console.log("picture uploaded", response.result.files.image.name);
            console.log("picture uploaded", response.result.files.image.url);
            context.dispatch(BusinessEvents.ADD_PICTURE_SUCCESS, {
                picture: response.result.files.image
            });
        })
        .fail(function () {
            context.dispatch(BusinessEvents.ADD_PICTURE_FAILURE);
        });
};