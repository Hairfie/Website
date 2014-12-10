'use strict';

var hairfieApi = require('../../services/hairfie-api-client');
var BusinessEvents = require('../../constants/BusinessConstants').Events;
var Navigate = require('flux-router-component/actions/navigate');

module.exports = function (context, payload, done) {
    context.dispatch(BusinessEvents.OPEN);
    hairfieApi
        .getBusiness(payload.id)
        .then(function (business) {
            console.log("business open", payload);
            if(business.slug != payload.slug) {
                var path = context.router.makePath('show_business', {id: business.id, slug: business.slug});
                context.dispatch(BusinessEvents.OPEN_WITH_BAD_SLUG, {
                    path: path
                });
            }
            context.dispatch(BusinessEvents.OPEN_SUCCESS, {
                business: business
            });
            done();
        })
        .catch(function () {
            context.dispatch(BusinessEvents.OPEN_FAILURE);
            done();
        })
    ;
};
