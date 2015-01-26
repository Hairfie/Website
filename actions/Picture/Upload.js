'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var PictureEvents = require('../../constants/PictureConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    context.dispatch(PictureEvents.UPLOAD_START, {
        id: payload.id
    });

    var onProgress = function (progress) {
        context.dispatch(PictureEvents.UPLOAD_PROGRESS, {
            id      : payload.id,
            percent : progress.percent
        });
    };

    hairfieApi
        .uploadPicture(
            payload.file,
            payload.container,
            context.getAuthToken(),
            onProgress
        )
        .then(function (picture) {
            context.dispatch(PictureEvents.UPLOAD_SUCCESS, {
                id      : payload.id,
                picture : picture
            });
            done();
        })
        .fail(function (error) {
            context.dispatch(PictureEvents.UPLOAD_FAILURE, {
                id: payload.id
            });
            done(error);
        });
};
