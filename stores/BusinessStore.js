'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var BusinessEvents = require('../constants/BusinessConstants').Events;
var BusinessActions = require('../actions/Business');
var HairdresserEvents = require('../constants/HairdresserConstants').Events;
var Notify = require('../actions/Flash/Notify');
var _ = require('lodash');

module.exports = createStore({
    storeName: 'BusinessStore',
    handlers: makeHandlers({
        handleReceive: BusinessEvents.RECEIVE,
        handleReceiveSuccess: BusinessEvents.RECEIVE_SUCCESS,
        handleReceiveFailure: BusinessEvents.RECEIVE_FAILURE
    }),
    initialize: function () {
        this.businesses = {};
    },
    dehydrate: function () {
        return {
            businesses: this.businesses
        };
    },
    rehydrate: function (state) {
        this.businesses = state.businesses;
    },
    handleReceive: function (payload) {
        this.businesses[payload.id] = _.assign({}, this.businesses[payload.id], {
            loading: true
        });
        this.emitChange();
    },
    handleReceiveSuccess: function (payload) {
        this.businesses[payload.id] = _.assign({}, this.businesses[payload.id], {
            entity  : payload.business,
            loading : false
        });

        if (this.business && payload.business.id == this.business.id) {
            this.business = payload.business;
            this.uploadInProgress = false;
        }

        this.emitChange();
    },
    handleReceiveFailure: function (payload) {
        this.businesses[payload.id] = _.assign({}, this.businesses[payload.id], {
            loading: false
        });
        this.emitChange();
    },
    // TODO: move discount code into a discount store
    getDiscountForBusiness: function(businessId) {
        var business = this.getById(businessId);
        if (!business) return;

        var max =  _.chain(business.timetable)
            .map(function(day) {return _.max(_.compact(_.pluck(day, 'discount'))) })
            .max()
            .value();
        var discountsAvailable = _.chain(business.timetable)
            .reduce(function(result, timetable, day) {
                var values = _.compact(_.pluck(timetable, 'discount'));
                if(values.length > 0) {
                    _.each(values, function(value) {
                        if(result[value]) {
                            result[value].push(day);
                        } else {
                            result[value] = [day];
                        }
                    })
                }
                return result;
            }, {})
            .value();
        var discountObj = {
            max: _.isFinite(max) ? max : null,
            discountsAvailable: discountsAvailable
        };
        return discountObj;
    },
    getById: function (businessId) {
        var business = this.businesses[businessId];

        if (typeof business == 'undefined') {
            this._loadById(businessId);
        }

        return business && business.entity;
    },
    _loadById: function (businessId) {
        this.dispatcher.getContext().executeAction(BusinessActions.Fetch, {
            id: businessId
        });
    }
});
