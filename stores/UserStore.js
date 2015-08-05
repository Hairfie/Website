'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'UserStore',
    handlers: makeHandlers({
        onReceiveUserInfo: Actions.RECEIVE_USER_INFO,
        onDeleteUserInfo: Actions.DELETE_USER_INFO,
        onReceiveUserLikeHairfie: Actions.RECEIVE_USER_LIKE_HAIRFIE,
        onReceivePostedHairfie: Actions.RECEIVE_USER_POST_HAIRFIE
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
        this.userInfo[user.id].likeHairfie = [];
        this.userInfo[user.id].postHairfie = [];
        this.userInfo[user.id].reviews = [];
        this.emitChange();
    },
    onDeleteUserInfo: function() {
        this.userInfo = {};
        this.emitChange();
    },
    onReceiveUserLikeHairfie: function(payload) {
        if (!(_.isArray(this.userInfo[payload.userId].likeHairfie)))
            this.userInfo[payload.userId].likeHairfie = [];
        this.userInfo[payload.userId].likeHairfie[payload.hairfie.id] = _.assign({hairfie: payload.hairfie}, {isLiked: payload.isLiked});
        this.emitChange();
    },
    onReceivePostedHairfie: function (payload) {
        if (!(_.isArray(this.userInfo[payload.userId].postHairfie)))
            this.userInfo[payload.userId].postHairfie = [];
        this.userInfo[payload.userId].postHairfie[payload.hairfie.id] = payload.hairfie
        this.emitChange();
    },
    onReceiveUserReview: function(payload) {
        if (!(_.isArray(this.userInfo[payload.userId].reviews)))
            this.userInfo[payload.userId].reviews = [];
        this.userInfo[payload.userId].reviews[payload.review.id] = payload.review
        this.emitChange();
    },
    getHairfieLikedById: function(hairfieId) {
        return this.userInfo.likeHairfie[hairfieId] || false;
    },
    getById: function(userId) {
        return this.userInfo[userId];
    }
});
