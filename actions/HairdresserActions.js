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
    }
};