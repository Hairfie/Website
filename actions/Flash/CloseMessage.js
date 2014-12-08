'use strict';

var FlashEvents = require('../../constants/FlashConstants').Events;

module.exports = function (context, payload, done) {
    context.dispatch(FlashEvents.CLOSE_MESSAGE, {
        message: payload.message
    });
    done();
};
