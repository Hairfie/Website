'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadAll: function (context) {
        return context.hairfieApi
            .get('/tags')
            .then(function (categories) {
                context.dispatch(Actions.RECEIVE_TAGS, tags);
            });
    }
};
