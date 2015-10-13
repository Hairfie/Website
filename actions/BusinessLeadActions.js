'use strict';

var Actions = require('../constants/Actions');
var NavigationActions = require('./NavigationActions');
var NotificationActions = require('./NotificationActions');
var ga = require('../services/analytics');

module.exports = {
    submit: function (context, payload) {
        var businessLead = payload.businessLead;

        return context.hairfieApi
            .post('/businessLeads', businessLead, { token: null })
            .then(function (businessLead) {
                ga('send', 'event', 'Business Lead', 'Submit');

                return context.executeAction(
                    NotificationActions.notifyInfo,
                    {
                        title: "Demande prise en compte",
                        message: 'Votre demande a bien été prise en compte, merci !'
                    }
                ).then(function () {
                    return context.executeAction(NavigationActions.navigate, {
                        route: 'home_pro'
                    });
                });
            });
    }
};
