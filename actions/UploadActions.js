'use strict';
var Actions = require('../constants/Actions');

var UploadActions = {
    uploadImage: function(context, payload) {
        var onProgress = function (percent) {context.dispatch(Actions.UPLOAD_PROGRESS, {
            uploadId: payload.uploadId, 
            percent: percent
        })};

        context.dispatch(Actions.UPLOAD_START, payload.uploadId);

        context.hairfieApi
            .upload(payload.container, payload.file, { onProgress:onProgress })
            .then(function(image) {
                context.dispatch(Actions.UPLOAD_SUCCESS, {
                    uploadId:payload.uploadId, 
                    image:image
                });
            }, function(error) {
                context.dispatch(Actions.UPLOAD_FAILURE, {
                    uploadId: payload.uploadId, 
                    error: error
                });
            });
    }
};

module.exports = UploadActions;