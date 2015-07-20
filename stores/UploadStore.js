var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var _ = require('lodash');
var Actions = require('../constants/Actions');
var authStorage = require('../services/auth-storage');

EMPTY_UPLOAD = {
    finished: false,
    success: false,
    failure: false,
    percent: 0,
    error: null,
    image: null
};

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
    onUploadProgress: function (payload) {
        this.uploads[payload.uploadId] = _.assign(this.uploads[payload.uploadId] || EMPTY_UPLOAD, payload.percent);
        this.emitChange();
    },
    onUploadSuccess: function (payload) {
        this.uploads[payload.uploadId] = _.assign(this.uploads[payload.uploadId] || EMPTY_UPLOAD, {
            percent: 100,
            finished: true,
            success: true
        });
        this.uploads[payload.uploadId].image = payload.image;
        this.emitChange();
    },
    onUploadFailure: function(payload) {
        this.uploads[payload.uploadId] = _.assign(this.uploads[payload.uploadId] || EMPTY_UPLOAD, {
            finished: true,
            failure: true
        });
        this.uploads[payload.uploadId].image = payload.error;
        this.emitChange();
    },
    getById: function(id) {
        return this.uploads[id];
    }
});
