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
        pageComponent: require('../components/BusinessDashboardPage.jsx'),
        authRequired: true
    },
    pro_business_new: {
        path: '/pro/claim',
        method: 'get',
        pageComponent: require('../components/BusinessClaimPage.jsx'),
        authRequired: true
    },
    pro_business_photos: {
        path: '/pro/businesses/:id/photos',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessPhotosPage.jsx'),
        authRequired: true
    },
    pro_business_hairfies: {
        path: '/pro/businesses/:id/hairfies',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessHairfiesPage.jsx'),
        authRequired: true
    },
    pro_business_hairdressers: {
        path: '/pro/businesses/:id/hairdressers',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessHairdressersPage.jsx'),
        authRequired: true
    },
    pro_business_timetable: {
        path: '/pro/businesses/:id/timetable',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessTimetablePage.jsx'),
        authRequired: true
    },
    pro_business_services: {
        path: '/pro/businesses/:id/services',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessServicesPage.jsx'),
        authRequired: true
    },
    pro_business_infos: {
        path: '/pro/businesses/:id/infos',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessInfosPage.jsx'),
        authRequired: true
    },
    pro_business_members: {
        path: '/pro/businesses/:id/members',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessMembersPage.jsx'),
        authRequired: true
    },
    pro_business_social_networks: {
        path: '/pro/businesses/:id/social-networks',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessSocialNetworksPage.jsx'),
        authRequired: true
    },
    show_hairfie: {
        path: '/hairfies/:id',
        method: 'get',
        action: require('../actions/Hairfie/RouteOpen'),
        pageComponent: require('../components/ShowHairfiePage.jsx')
    },
    show_business: {
        path: '/businesses/:id/:slug',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/ShowBusinessPage.jsx')
    },
    show_business_without_slug: {
        path: '/businesses/:id',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/ShowBusinessPage.jsx')
    }
};
