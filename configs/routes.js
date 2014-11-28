'use strict';

module.exports = {
    home: {
        path: '/',
        method: 'get'
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
        action: require('../actions/BusinessClaim/RouteOpen'),
        authRequired: true
    },
    pro_business: {
        path: '/pro/businesses/:id',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        authRequired: true
    },
    show_hairfie: {
        path: '/hairfies/:id',
        method: 'get',
        action: require('../actions/Hairfie/RouteOpen'),
    },
    show_business: {
        path: '/businesses/:id',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
    }
};
