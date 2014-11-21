'use strict';

module.exports = {
    home: {
        path: '/pro/',
        method: 'get',
        leaveAfterAuth: true
    },
    dashboard: {
        path: '/pro/dashboard',
        method: 'get',
        authRequired: true
    }
};
