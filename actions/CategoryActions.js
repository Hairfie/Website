'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadAll: function (context) {
        return context.hairfieApi
            .get('/categories')
            .then(function (categories) {
                context.dispatch(Actions.RECEIVE_CATEGORIES, categories);
            });
    }
};
