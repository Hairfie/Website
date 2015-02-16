'use strict';

var Uuid = require('uuid');
var FlashEvents = require('../../constants/FlashConstants').Events;

module.exports = function (context, payload, done) {
    var done = done || function () {};

    var message = {};
    message.id = Uuid.v4();
    message.body = payload.body;
    message.type = payload.type;

    context.dispatch(FlashEvents.RECEIVE_MESSAGE, {
        message: message
    });

    done();
};
