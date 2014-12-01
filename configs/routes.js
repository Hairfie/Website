'use strict';

module.exports = {
    home: {
        path: '/',
        method: 'get',
        pageComponent: require('../components/HomePage.jsx')
    },
    pro_home: {
        path: '/pro/',
        method: 'get',
        pageComponent: require('../components/HomePagePro.jsx'),
        leaveAfterAuth: true
    },
    pro_dashboard: {
        path: '/pro/dashboard',
        method: 'get',
        pageComponent: require('../components/DashboardPage.jsx'),
        authRequired: true
    },
    pro_business: {
        path: '/pro/businesses/:id',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/ShowBusinessPage.jsx'),
        authRequired: true
    },
    pro_business_new: {
        path: '/pro/claim',
        method: 'get',
        pageComponent: require('../components/NewBusinessPage.jsx'),
        authRequired: true
    },
    pro_business_infos: {
        path: '/pro/businesses/:id/infos/:step',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessInfosPage.jsx'),
        authRequired: true
    },
    show_hairfie: {
        path: '/hairfies/:id',
        method: 'get',
        action: require('../actions/Hairfie/RouteOpen'),
        pageComponent: require('../components/ShowHairfiePage.jsx')
    },
    show_business: {
        path: '/businesses/:id',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/ShowBusinessPage.jsx')
    }
};
