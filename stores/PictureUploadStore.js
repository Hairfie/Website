'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var PictureEvents = require('../constants/PictureConstants').Events;

module.exports = createStore({
    storeName: 'PictureUploadStore',
    handlers: makeHandlers({
        handleUploadStart   : PictureEvents.UPLOAD_START,
        handleUploadProgress: PictureEvents.UPLOAD_PROGRESS,
        handleUploadSuccess : PictureEvents.UPLOAD_SUCCESS,
        handleUploadFailure : PictureEvents.UPLOAD_FAILURE,
    }),
    initialize: function () {
        this.uploads = {};
    },
    handleUploadStart: function (payload) {
        this.uploads[payload.id] = {
            finished: false,
            percent : 0,
            picture : null
        };
        this.emitChange();
    },
    handleUploadProgress: function (payload) {
        this.uploads[payload.id].percent = payload.percent;
        this.emitChange();
    },
    handleUploadSuccess: function (payload) {
        this.uploads[payload.id].picture = payload.picture;
        this.uploads[payload.id].percent = 100;
        this.uploads[payload.id].finished = true;
        this.emitChange();
    },
    handleUploadFailure: function (payload) {
        this.uploads[payload.id].finished = true;
        this.emitChange();
    },
    getById: function (id) {
        return this.uploads[id];
    }
});
