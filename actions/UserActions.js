'use strict';

var Actions = require('../constants/Actions');
var Promise = require('q');
var NotificationActions = require('./NotificationActions');
var NavigationActions = require('./NavigationActions');

module.exports = {
    getUserById: function(context, token) {
        return context.hairfieApi
            .get('/users/' + token.userId, { query: { access_token: token.id }})
            .then(function (userInfo) {
                // fonction differente : loginWithToken
                alert(userInfo);
                console.log(userInfo);
                context.dispatch(Actions.RECEIVE_USER_INFO, userInfo);
            }, 
            function () {
                return context.executeAction(
                    NotificationActions.notifyFailure,
                    "Un problème est survenu"
                );
            })
    }
};