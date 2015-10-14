'use strict';

var PageActions = require('./actions/PageActions');

module.exports = {
    home: {
        title: 'Hairfie',
        path: '/fr/',
        method: 'get',
        handler: require('./components/HomePage.jsx'),
        action: PageActions.home,
        numTopDeals: 3,
        numTopHairfies: 5
    },
    home_pro: {
        title: 'Hairfie pour les coiffeurs',
        path: '/fr/pro',
        method: 'get',
        handler: require('./components/HomePagePro.jsx')
    },
    reset_password: {
        title: 'Choisissez votre nouveau mot de passe',
        path: '/fr/reset-password/:userId/:tokenId',
        method: 'get',
        action: PageActions.resetPassword,
        handler: require('./components/ResetPasswordPage.jsx')
    },
    ask_reset_password: {
        title: 'Mot de passe oublié',
        path: '/fr/ask-reset-password',
        method: 'get',
        handler: require('./components/AskResetPasswordPage.jsx')
    },
    old_write_business_review: {
        title: 'Donnez votre avis',
        path: '/fr/write-business-review/:businessReviewRequestId',
        method: 'get',
        handler: require('./components/WriteBusinessReviewPage.jsx'),
        action: PageActions.writeBusinessReview
    },
    write_business_review: {
        title: 'Donnez votre avis',
        path: '/fr/deposer-un-avis',
        method: 'get',
        action: PageActions.writeBusinessReview,
        handler: require('./components/WriteBusinessReviewPage.jsx')
    },
    business_reviews_confirmation: {
        title: 'Avis déposé',
        path: '/fr/avis/:reviewId',
        method: 'get',
        action: PageActions.writeBusinessReviewConfirmation,
        handler: require('./components/WriteBusinessReviewConfirmationPage.jsx')
    },
    hairfie: {
        path: '/fr/hairfie/:hairfieId',
        method: 'get',
        action: PageActions.hairfie,
        handler: require('./components/HairfiePage.jsx')
    },
    business: {
        path: '/fr/coiffeur/:businessId/:businessSlug',
        method: 'get',
        action: PageActions.business,
        handler: require('./components/BusinessPage.jsx')
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
        handler: require('./components/BusinessReviewsPage.jsx')
    },
    business_hairfies: {
        path: '/fr/coiffeur/:businessId/:businessSlug/hairfies',
        method: 'get',
        action: PageActions.businessHairfies,
        handler: require('./components/BusinessHairfiesPage.jsx')
    },
    business_booking: {
        path: '/fr/coiffeur/:businessId/:businessSlug/reserver',
        method: 'get',
        action: PageActions.businessBooking,
        handler: require('./components/BusinessBookingPage.jsx')
    },
    booking_confirmation: {
        title: 'Votre réservation',
        path: '/fr/reservation/:bookingId',
        method: 'get',
        action: PageActions.bookingConfirmation,
        handler: require('./components/BookingConfirmationPage.jsx')
    },
    business_search: {
        title: 'Trouvez un coiffeur',
        path: '/fr/coiffeurs/:address',
        method: 'get',
        action: PageActions.businessSearch,
        handler: require('./components/BusinessSearchPage.jsx')
    },
    hairfie_search: {
        title: 'Hairfies',
        path: '/fr/hairfies/:address',
        method: 'get',
        action: PageActions.hairfieSearch,
        handler: require('./components/HairfieSearchPage.jsx')
    },
    connect_page: {
        title: 'Connexion',
        path: '/fr/connect',
        method: 'get',
        handler: require('./components/ConnectPage.jsx')
    },
    registration_page: {
        title: 'Inscription',
        path: '/fr/register',
        method: 'get',
        handler: require('./components/RegistrationPage.jsx')
    },
    user_hairfies: {
        path: '/fr/membre/:userId/hairfies',
        method: 'get',
        handler: require('./components/UserHairfiesPage.jsx'),
        action: PageActions.userHairfies
    },
    user_reviews: {
        path: '/fr/membre/:userId/avis',
        method: 'get',
        handler: require('./components/UserReviewsPage.jsx'),
        action: PageActions.userReviews
    },
    user_likes: {
        path: '/fr/membre/:userId/likes',
        method: 'get',
        action: PageActions.userLikes,
        handler: require('./components/UserLikesPage.jsx')
    },
    user_edit: {
        path: '/fr/membre/edition',
        method: 'get',
        handler: require('./components/UserEditPage.jsx')
    },
    hairdresser: {
        path: '/fr/profil-coiffeur/:id',
        method: 'get',
        action: PageActions.hairdresser,
        handler: require('./components/HairdresserPage.jsx')
    },
    hairdresser_hairfies: {
        path: '/fr/profil-coiffeur/:id/hairfies',
        method: 'get',
        action: PageActions.hairdresserHairfies,
        handler: require('./components/HairdresserHairfiesPage.jsx')
    },
};
