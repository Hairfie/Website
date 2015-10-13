'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var Actions = require('../constants/Actions');

var _ = require('lodash');

module.exports = createStore({
    storeName: 'BlogPostStore',
    handlers: makeHandlers({
        onReceiveBlogPosts: Actions.RECEIVE_BLOG_POSTS
    }),
    initialize: function () {
        this.posts;
    },
    dehydrate: function () {
        return {
            posts: this.posts
        };
    },
    rehydrate: function (data) {
        this.posts = data.posts;
    },
    onReceiveBlogPosts: function (posts) {
        this.posts = posts;
        this.emitChange();
    },
    getRecent: function () {
        return this.posts;
    }
});