'use strict';

var Actions = require('../constants/Actions');

module.exports = {
    loadAll: function (context) {
        return context.hairfieApi
            .get('/selections')
            .then(function (selections) {
                context.dispatch(Actions.RECEIVE_SELECTIONS, selections);
            });
    }
};
