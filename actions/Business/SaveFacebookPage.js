'use strict';

var BusinessEvents = require('../../constants/BusinessConstants').Events;

module.exports = function (context, payload, done) {
    context
        .getHairfieApi()
        .saveBusinessFacebookPage(payload.business, payload.facebookPage)
        .then(function (facebookPage) {
            context.dispatch(BusinessEvents.RECEIVE_FACEBOOK_PAGE_SUCCESS, {
                business: payload.business,
                facebookPage: facebookPage
            });
        });
};
