'use strict';

module.exports = {
    home: {
        path: '/',
        method: 'get',
        authRequired: false
    },
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
        action: 'openBusinessClaim',
        authRequired: true
    },
    pro_business: {
        path: '/pro/businesses/:id',
        method: 'get',
        action: 'openBusiness',
    },
    show_hairfie: {
        path: '/hairfies/:id',
        method: 'get',
        authRequired: false,
        action: 'loadHairfie'
    },
    show_business: {
        path: '/businesses/:id',
        method: 'get',
        authRequired: false,
        action: 'openBusiness'
    }
};
