var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');
var authStorage = require('../services/auth-storage');

module.exports = createStore({
    storeName: 'UploadStore',
    handlers: makeHandlers({
        onUploadStart: Actions.UPLOAD_START,
        onUploadProgress: Actions.UPLOAD_PROGRESS,
        onUploadSuccess: Actions.UPLOAD_SUCCESS,
        onUploadFailure: Actions.UPLOAD_FAILURE
    }),
    initialize: function () {
        this.uploads = {};
    },
    dehydrate: function () {
        return { tokens: this.uploads };
    },
    rehydrate: function (state) {
        this.uploads = state.uploads;
    },
    onUploadStart: function (uploadId) {
        this.uploads[uploadId] = EMPTY_UPLOAD;
        this.emitChange();
    },
    onUploadProgress: function (uploadId, percent) {
        this.uploads[uploadId] = _.assign(this.uploads[uploadId] || EMPTY_UPLOAD, { percent });
        this.emitChange();
    },
    onUploadSuccess: function (uploadId, image) {
        this.uploads[uploadId] = _.assign(this.uploads[uploadId] || EMPTY_UPLOAD, {
            percent: 100,
            finished: true,
            success: true,
            image
        });
        this.emitChange();
    },
    onUploadFailure: function(uploadId, error) {
        this.uploads[uploadId] = _.assign(this.uploads[uploadId] || EMPTY_UPLOAD, {
            finished: true,
            failure: true,
            error
        });
        this.emitChange();
    },
    getById: function(id) {
        return this.uploads[id];
    }
});
