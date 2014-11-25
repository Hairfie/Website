'use strict';

var hairfieApi = require('../services/hairfie-api-client');

module.exports = function (context, payload, done) {
    // TODO: do we care if it fails here?
    hairfieApi.saveBusinessClaim(payload.businessClaim, payload.token);

    context.emit('CHANGE_BUSINESS_CLAIM_STEP', {step: payload.step});
    done();
};
