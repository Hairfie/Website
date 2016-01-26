'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'SubscriberStore',
    handlers: makeHandlers({
        onEmailRegistration: Actions.ADD_SUBSCRIBER_SUCCESS
    }),
    initialize: function () {
        this.registeredEmail = false;
        this.email = '';
    },
    dehydrate: function () {
        return { registeredEmail: this.registeredEmail };
    },
    rehydrate: function (state) {
        this.registeredEmail = state.registeredEmail;
    },
    onEmailRegistration: function (subscriber) {
        this.registeredEmail = true;
        this.email = subscriber.email;
        this.emitChange();
    },
    getEmailRegistrationStatus: function () {
        return this.registeredEmail;
    },
    getEmail: function () {
        return this.email;
    }
});