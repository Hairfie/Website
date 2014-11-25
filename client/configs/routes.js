'use strict';

var AuthStore       = require('../stores/AuthStore');
var hairfieApi      = require('../services/hairfie-api-client');
var businessAction  = require('../actions/getBusiness');
var hairfieAction   = require('../actions/getHairfie');

module.exports = {
    pro_home: {
        path: '/pro/',
        method: 'get',
        leaveAfterAuth: true
    },
    pro_dashboard: {
        path: '/pro/dashboard',
        method: 'get',
        authRequired: true
    },
    pro_business_claim: {
        path: '/pro/business-claims/:id',
        method: 'get',
        action: function (context, payload, done) {
            context.dispatch('OPEN_BUSINESS_CLAIM');
            var token = context.getStore(AuthStore).getToken();
            hairfieApi
                .getBusinessClaim(payload.params.id, token)
                .then(function (claim) {
                    context.dispatch('OPEN_BUSINESS_CLAIM_SUCCESS', {
                        businessClaim: claim
                    });
                    done();
                })
                .fail(function (e) {
                    context.dispatch('OPEN_BUSINESS_CLAIM_FAILURE');
                    done(e);
                })
            ;
        },
        authRequired: true
    },
    pro_business: {
        path: '/pro/businesses/:id',
        method: 'get',
        action: function (context, payload, done) {
            context.dispatch('OPEN_BUSINESS');
            var token = context.getStore(AuthStore).getToken();
            hairfieApi
                .getBusiness(payload.params.id, token)
                .then(function (business) {
                    context.dispatch('OPEN_BUSINESS_SUCCESS', {
                        business: business
                    });
                    done();
                })
                .fail(function (e) {
                    context.dispatch('OPEN_BUSINESS_FAILURE');
                    done(e);
                })
            ;
        }
    },
    show_hairfie: {
        path: '/hairfies/:id',
        method: 'get',
        authRequired: false,
        action: hairfieAction
    },
    show_business: {
        path: '/businesses/:id',
        method: 'get',
        authRequired: false,
        action: businessAction
    }
};
