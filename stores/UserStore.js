'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'UserStore',
    handlers: makeHandlers({
        onReceiveUserInfo: Actions.RECEIVE_USER_INFO,
        onDeleteUserInfo: Actions.DELETE_USER_INFO
    }),
    initialize: function () {
        this.userInfo = {};
    },
    dehydrate: function () {
        return { userInfo: this.userInfo };
    },
    rehydrate: function (state) {
        this.userInfo = state.userInfo;
    },
    onReceiveUserInfo: function (user) {
        this.userInfo[user.id] = user;
        this.emitChange();
    },
    onDeleteUserInfo: function() {
        this.userInfo = {};
        this.emitChange();
    },
    onReceiveUserReview: function(payload) {
        if (!(_.isArray(this.userInfo[payload.userId].reviews)))
            this.userInfo[payload.userId].reviews = [];
        this.userInfo[payload.userId].reviews[payload.review.id] = payload.review
        this.emitChange();
    },
    getById: function(userId) {
        return this.userInfo[userId];
    }
});
