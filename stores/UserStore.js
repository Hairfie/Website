'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');

module.exports = createStore({
    storeName: 'UserStore',
    handlers: makeHandlers({
        onReceiveUserInfo: Actions.RECEIVE_USER_INFO,
        onDeleteUserInfo: Actions.DELETE_USER_INFO,
        onReceiveUserLikeHairfie: Actions.RECEIVE_USER_LIKE_HAIRFIE
    }),
    initialize: function () {
        this.userInfo = {};
        this.userInfo.likeHairfie = {};
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
    onReceiveUserLikeHairfie: function(payload) {
        this.userInfo.likeHairfie[payload.hairfieId] = payload.isLiked;
        this.emitChange();
    },
    getHairfieLikedById: function(hairfieId) {
        return this.userInfo.likeHairfie[hairfieId] || false;
    },
    getUserInfo: function(userId) {
        return this.userInfo[userId];
    }
});
