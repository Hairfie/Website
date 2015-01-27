'use strict';

var createStore = require('fluxible/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var FlashEvents = require('../constants/FlashConstants').Events;
var _ = require('lodash');

module.exports = createStore({
    storeName: 'FlashStore',
    handlers: makeHandlers({
        handleReceiveMessage: FlashEvents.RECEIVE_MESSAGE,
        handleCloseMessage  : FlashEvents.CLOSE_MESSAGE
    }),
    initialize: function () {
        this.messages = [];
    },
    dehydrate: function () {
        return {
            messages: this.messages
        };
    },
    rehydrate: function (data) {
        this.messages = data.messages;
    },
    handleReceiveMessage: function (payload) {
        this.messages.push(payload.message);
        this.emitChange();
    },
    handleCloseMessage: function (payload) {
        this.messages = _.filter(this.messages, function (message) {
            return message.id != payload.message.id;
        });
        this.emitChange();
    },
    getMessages: function () {
        return this.messages;
    }
});
