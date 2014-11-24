'use strict';

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
    show_hairfie: {
        path: '/hairfies/:id',
        method: 'get',
        authRequired: false
    },
    show_business: {
        path: '/businesses/:id',
        method: 'get',
        authRequired: false
    }
};
