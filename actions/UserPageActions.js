'use strict';

var Actions = require('../constants/Actions');
var _ = require('lodash');
var Promise = require('q');

module.exports = {
    getUserHairfie: function (context, id) {
    var query = {
    'filter[where][authorId]': id,
    'filter[order]': 'createdAt DESC',
    'filter[limit]': 10
    };
    return context.hairfieApi
        .get('/hairfies', { query: query })
        .then(function (hairfies) {
            console.log(hairfies);
            debugger;
            _.map(hairfies, function(hairfie){
                Promise.all([
                    context.dispatch(Actions.RECEIVE_USER_POST_HAIRFIE, {userId: id, hairfie: hairfie})
                    ]);
            });
        }, function () {
            return context.executeAction(
                NotificationActions.notifyFailure,
                "Un problème est survenu"
            );
        });
    },
    getUserReviews: function (context, id) {
        return;
    },
    getUserLikes: function (context, id) {
        return;
    }
};