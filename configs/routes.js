'use strict';

var PageActions = require('../actions/PageActions');

module.exports = {
    home: {
        path: '/',
        method: 'get',
        component: require('../components/HomePage.jsx'),
        action: PageActions.home,
        numTopDeals: 3,
        numTopHairfies: 5
    },
    reset_password: {
        path: '/reset-password/:userId/:tokenId',
        method: 'get',
        action: PageActions.resetPassword,
        component: require('../components/ResetPasswordPage.jsx')
    },
    write_verified_business_review: {
        path: '/write-business-review/:businessReviewRequestId',
        method: 'get',
        component: require('../components/WriteVerifiedBusinessReviewPage.jsx'),
        action: PageActions.writeVerifiedBusinessReview
    },
    hairfie: {
        path: '/hairfie/:hairfieId',
        method: 'get',
        action: PageActions.hairfie,
        component: require('../components/HairfiePage.jsx')
    },
    business: {
        path: '/coiffeur/:businessId/:businessSlug',
        method: 'get',
        action: PageActions.business,
        component: require('../components/BusinessPage.jsx')
    },
    business_by_id: { // redirects to canonical business's page
        path: '/coiffeur/:businessId',
        method: 'get',
        action: PageActions.business
    },
    business_booking: {
        path: '/coiffeur/:businessId/:businessSlug/reserver',
        method: 'get',
        action: PageActions.businessBooking,
        component: require('../components/BusinessBookingPage.jsx')
    },
    booking_confirmation: {
        path: '/reservation/:bookingId',
        method: 'get',
        action: PageActions.bookingConfirmation,
        component: require('../components/BookingConfirmationPage.jsx')
    },
    business_search: {
        path: '/coiffeurs/:address',
        method: 'get',
        action: PageActions.businessSearch,
        component: require('../components/BusinessSearchPage.jsx')
    },
    hairfie_search_result: {
        path: '/hairfies/:address',
        method: 'get',
        component: require('../components/HairfieSearchResultPage.jsx')
    }
};
