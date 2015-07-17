/*'use strict';
var Actions = require('../constants/Actions');

var UploadActions = {
    uploadImage: function(context, payload) {
        var onProgress = function ( percent) {context.dispatch(Actions.UPLOAD_PROGRESS, { payload.uploadId, payload.percent })};

        context.dispatch(Actions.UPLOAD_START, payload.uploadId);
        context.hairfieApi
            .upload(container, file, { token, onProgress })
            .then(
                image => context.dispatch(Actions.UPLOAD_SUCCESS, { uploadId, image }),
                error => context.dispatch(Actions.UPLOAD_FAILURE, { uploadId, error })
            );
    }
};

module.exports = UploadActions;*/