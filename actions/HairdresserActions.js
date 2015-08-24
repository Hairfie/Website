'use strict';

var _ = require('lodash');
var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var Promise = require('q');

module.exports = {
    loadHairdresser: function(context, id) {
        return context.hairfieApi
            .get('/businessMembers/' + id)
            .then(function (data) {
                context.dispatch(Actions.RECEIVE_HAIRDRESSER, {hairdresser: data});
            })
    },
    getHairdresserHairfies: function (context, id) {
        var query = {
        'filter[where][businessMemberId]': id,
        'filter[order]': 'createdAt DESC',
        'filter[limit]': 12
        };
        return context.hairfieApi
            .get('/hairfies', { query: query })
            .then(function (hairfies) {
                Promise.all([
                    context.dispatch(Actions.RECEIVE_HAIRDRESSER_HAIRFIES, {userId: id, hairfies: hairfies})
                ]);
            }, function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            });
    }
};