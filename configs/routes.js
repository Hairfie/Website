'use strict';

var Navigate = require('flux-router-component/actions/navigate');

function authenticated(action) {
    return function (context, payload, done) {
        if (!context.getAuthToken()) {
            return context.executeAction(Navigate, {url: context.router.makePath('pro_home')}, done);
        }

        if (action) {
            return context.executeAction(action, payload, done);
        }

        done();
    }
}

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
        component: require('../components/WriteVerifiedBusinessReviewPage.jsx')
    },
    pro_home: {
        path: '/pro/',
        method: 'get',
        component: require('../components/HomePagePro.jsx'),
        action: function (context, payload, done) {
            if (context.getAuthToken()) {
                return context.executeAction(Navigate, {
                    url: context.router.makePath('pro_dashboard')
                }, done);
            }
            done();
        }
    },
    pro_dashboard: {
        path: '/pro/dashboard',
        method: 'get',
        action: authenticated(require('../actions/Page/ProDashboard')),
        component: require('../components/DashboardPage.jsx')
    },
    pro_business: {
        path: '/pro/businesses/:businessId',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessDashboardPage.jsx'),
    },
    pro_business_new: {
        path: '/pro/claim',
        method: 'get',
        action: authenticated(),
        component: require('../components/BusinessClaimPage.jsx')
    },
    pro_business_photos: {
        path: '/pro/businesses/:businessId/photos',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessPhotosPage.jsx')
    },
    pro_business_hairfies: {
        path: '/pro/businesses/:businessId/hairfies',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessHairfiesPage.jsx')
    },
    pro_business_timetable: {
        path: '/pro/businesses/:businessId/timetable',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessTimetablePage.jsx')
    },
    pro_business_services: {
        path: '/pro/businesses/:businessId/services',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessServicesPage.jsx')
    },
    pro_business_infos: {
        path: '/pro/businesses/:businessId/infos',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessInfosPage.jsx')
    },
    pro_business_members: {
        path: '/pro/businesses/:businessId/members',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessMembersPage.jsx')
    },
    pro_business_social_networks: {
        path: '/pro/businesses/:businessId/social-networks',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessSocialNetworksPage.jsx')
    },
    pro_business_customers: {
        path: '/pro/businesses/:businessId/customers',
        method: 'get',
        action: authenticated(require('../actions/Business/RouteOpen')),
        component: require('../components/BusinessCustomersPage.jsx')
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
