'use strict';

module.exports = {
    home: {
        path: '/',
        method: 'get',
        pageComponent: require('../components/HomePage.jsx'),
        action: require('../actions/Page/Home'),
        numTopDeals: 3,
        numTopHairfies: 5
    },
    reset_password: {
        path: '/reset-password/:userId/:token',
        method: 'get',
        pageComponent: require('../components/ResetPasswordPage.jsx')
    },
    write_verified_business_review: {
        path: '/write-business-review/:businessReviewRequestId',
        method: 'get',
        pageComponent: require('../components/WriteVerifiedBusinessReviewPage.jsx')
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
        path: '/pro/businesses/:businessId',
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
        path: '/pro/businesses/:businessId/photos',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessPhotosPage.jsx'),
        authRequired: true
    },
    pro_business_hairfies: {
        path: '/pro/businesses/:businessId/hairfies',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessHairfiesPage.jsx'),
        authRequired: true
    },
    pro_business_timetable: {
        path: '/pro/businesses/:businessId/timetable',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessTimetablePage.jsx'),
        authRequired: true
    },
    pro_business_services: {
        path: '/pro/businesses/:businessId/services',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessServicesPage.jsx'),
        authRequired: true
    },
    pro_business_infos: {
        path: '/pro/businesses/:businessId/infos',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessInfosPage.jsx'),
        authRequired: true
    },
    pro_business_members: {
        path: '/pro/businesses/:businessId/members',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessMembersPage.jsx'),
        authRequired: true
    },
    pro_business_social_networks: {
        path: '/pro/businesses/:businessId/social-networks',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessSocialNetworksPage.jsx'),
        authRequired: true
    },
    pro_business_customers: {
        path: '/pro/businesses/:businessId/customers',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessCustomersPage.jsx'),
        authRequired: true
    },
    show_hairfie: {
        path: '/hairfies/:hairfieId',
        method: 'get',
        action: require('../actions/Hairfie/RouteOpen'),
        pageComponent: require('../components/ShowHairfiePage.jsx')
    },
    show_business: {
        path: '/businesses/:businessId/:businessSlug',
        method: 'get',
        action: require('../actions/Page/Business'),
        pageComponent: require('../components/ShowBusinessPage.jsx')
    },
    show_business_without_slug: {
        path: '/businesses/:businessId',
        method: 'get',
        action: require('../actions/Page/Business'),
        pageComponent: require('../components/ShowBusinessPage.jsx')
    },
    book_business: {
        path: '/businesses/:businessId/:businessSlug/booking',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        pageComponent: require('../components/BusinessBookingPage.jsx')
    },
    booking_confirmation: {
        path: '/bookings/:bookingId',
        method: 'get',
        action: require('../actions/Booking/RouteOpen'),
        pageComponent: require('../components/BusinessBookingConfirmationPage.jsx')
    },
    search: {
        path: '/search',
        method: 'get',
        action: require('../actions/BusinessSearch/RouteOpen'),
        pageComponent: require('../components/SearchPage.jsx')
    },
    business_search_results: {
        path: '/coiffeurs/:address',
        method: 'get',
        action: require('../actions/Page/BusinessSearchResults'),
        pageComponent: require('../components/BusinessSearchResultsPage.jsx')
    }
};
