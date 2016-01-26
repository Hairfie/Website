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
                context.dispatch(Actions.HAIRDRESSER_REGISTRATION_SUCCESS);
                ga('send', 'event', 'Business Lead', 'Submit');
                return;
            });
    }
};
