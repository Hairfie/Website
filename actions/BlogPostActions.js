'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    getRecent: function (context) {
        return context.hairfieApi
            .get('/blogPosts', { query: { limit: 3 } })
            .then(function (posts) {
                context.dispatch(Actions.RECEIVE_BLOG_POSTS, posts);
            });
    }
};