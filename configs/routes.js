'use strict';

module.exports = {
    home: {
        path: '/',
        method: 'get',
        component: require('../components/HomePage.jsx'),
        action: require('../actions/Page/Home'),
        numTopDeals: 3,
        numTopHairfies: 5
    },
    reset_password: {
        path: '/reset-password/:userId/:token',
        method: 'get',
        component: require('../components/ResetPasswordPage.jsx')
    },
    write_verified_business_review: {
        path: '/write-business-review/:businessReviewRequestId',
        method: 'get',
        component: require('../components/WriteVerifiedBusinessReviewPage.jsx'),
        action: require('../actions/Page/BusinessReviewRequest')
    },
    show_hairfie: {
        path: '/hairfie/:hairfieId',
        method: 'get',
        action: require('../actions/Page/Hairfie'),
        component: require('../components/ShowHairfiePage.jsx')
    },
    show_business: {
        path: '/coiffeur/:businessId/:businessSlug',
        method: 'get',
        action: require('../actions/Page/Business'),
        component: require('../components/ShowBusinessPage.jsx')
    },
    show_business_without_slug: {
        path: '/businesses/:businessId',
        method: 'get',
        action: require('../actions/Page/Business'),
        component: require('../components/ShowBusinessPage.jsx')
    },
    book_business: {
        path: '/businesses/:businessId/:businessSlug/booking',
        method: 'get',
        action: require('../actions/Business/RouteOpen'),
        component: require('../components/BusinessBookingPage.jsx')
    },
    booking_confirmation: {
        path: '/bookings/:bookingId',
        method: 'get',
        action: require('../actions/Booking/RouteOpen'),
        component: require('../components/BusinessBookingConfirmationPage.jsx')
    },
    business_search_result: {
        path: '/coiffeurs/:address',
        method: 'get',
        action: require('../actions/Page/BusinessSearchResult'),
        component: require('../components/BusinessSearchResultPage.jsx')
    },
    hairfie_search_result: {
        path: '/hairfies/:address',
        method: 'get',
        component: require('../components/HairfieSearchResultPage.jsx')
    }
};
