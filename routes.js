'use strict';

var PageActions = require('./actions/PageActions');

module.exports = {
    home: {
        path: '/fr/',
        method: 'get',
        component: require('./components/HomePage.jsx'),
        action: PageActions.home,
        numTopDeals: 3,
        numTopHairfies: 5
    },
    reset_password: {
        path: '/fr/reset-password/:userId/:tokenId',
        method: 'get',
        action: PageActions.resetPassword,
        component: require('./components/ResetPasswordPage.jsx')
    },
    write_verified_business_review: {
        path: '/fr/write-business-review/:businessReviewRequestId',
        method: 'get',
        component: require('./components/WriteVerifiedBusinessReviewPage.jsx'),
        action: PageActions.writeVerifiedBusinessReview
    },
    hairfie: {
        path: '/fr/hairfie/:hairfieId',
        method: 'get',
        action: PageActions.hairfie,
        component: require('./components/HairfiePage.jsx')
    },
    business: {
        path: '/fr/coiffeur/:businessId/:businessSlug',
        method: 'get',
        action: PageActions.business,
        component: require('./components/BusinessPage.jsx')
    },
    business_by_id: { // redirects to canonical business's page
        path: '/fr/coiffeur/:businessId',
        method: 'get',
        action: PageActions.business
    },
    business_reviews: {
        path: '/fr/coiffeur/:businessId/:businessSlug/reviews',
        method: 'get',
        action: PageActions.businessReviews,
        component: require('./components/BusinessReviewsPage.jsx')
    },
    business_hairfies: {
        path: '/fr/coiffeur/:businessId/:businessSlug/hairfies',
        method: 'get',
        action: PageActions.businessHairfies,
        component: require('./components/BusinessHairfiesPage.jsx')
    },
    business_booking: {
        path: '/fr/coiffeur/:businessId/:businessSlug/reserver',
        method: 'get',
        action: PageActions.businessBooking,
        component: require('./components/BusinessBookingPage.jsx')
    },
    booking_confirmation: {
        path: '/fr/reservation/:bookingId',
        method: 'get',
        action: PageActions.bookingConfirmation,
        component: require('./components/BookingConfirmationPage.jsx')
    },
    business_search: {
        path: '/fr/coiffeurs/:address',
        method: 'get',
        action: PageActions.businessSearch,
        component: require('./components/BusinessSearchPage.jsx')
    },
    hairfie_search: {
        path: '/fr/hairfies/:address',
        method: 'get',
        action: PageActions.hairfieSearch,
        component: require('./components/HairfieSearchPage.jsx')
    }
};
