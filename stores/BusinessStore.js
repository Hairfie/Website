'use strict';

var createStore = require('fluxible/utils/createStore');
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
        handleReceiveFailure: BusinessEvents.RECEIVE_FAILURE,
        handleReceiveHairdressersSuccess: BusinessEvents.RECEIVE_HAIRDRESSERS_SUCCESS,
        handleHairdresserSaveSuccess: HairdresserEvents.SAVE_SUCCESS,
        handleAddPicture: BusinessEvents.ADD_PICTURE,
        handleAddPictureSuccess: BusinessEvents.ADD_PICTURE_SUCCESS,
        handleAddPictureFailure: BusinessEvents.ADD_PICTURE_FAILURE
    }),
    initialize: function () {
        this.businesses = {};
        this.hairdressers = null;
        this.uploadInProgress = false;
    },
    handleReceive: function (payload) {
        this.businesses[payload.id] = _.merge({}, this.businesses[payload.id], {
            loading: true
        });
        this.emitChange();
    },
    handleReceiveSuccess: function (payload) {
        this.businesses[payload.id] = _.merge({}, this.businesses[payload.id], {
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
        this.businesses[payload.id] = _.merge({}, this.businesses[payload.id], {
            loading: false
        });
        this.emitChange();
    },
    handleReceiveHairdressersSuccess: function (payload) {
        if (!this.business || payload.business.id != this.business.id) {
            return;
        }

        this.hairdressers = payload.hairdressers;
        this.emitChange();
    },
    handleHairdresserSaveSuccess: function (payload) {
        var hairdresser = payload.hairdresser;
        if (!this.business || hairdresser.business.id != this.business.id) {
            return;
        }

        var index = _.findIndex(this.hairdressers, {id: hairdresser.id});
        if (-1 == index) {
            this.hairdressers.push(hairdresser);
        } else {
            this.hairdressers[index] = hairdresser;
        }

        this.emitChange();
    },
    handleAddPicture: function() {
        this.uploadInProgress = true;
        this.emitChange();
    },
    handleAddPictureSuccess: function() {
        this.uploadInProgress = false;
        this.emitChange();
    },
    handleAddPictureFailure: function() {
        this.uploadInProgress = false;
        context.executeAction(Notify, {
            type: "FAILURE",
            body: "Echec de l'upload de la photo"
        });
        this.emitChange();
    },
    getHairdressers: function () {
        if (this.business && !this.hairdressers) {
            this.dispatcher.getContext().executeAction(BusinessActions.RefreshHairdressers, {
                business: this.business
            });
        }

        return this.hairdressers || [];
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
    isUploadInProgress: function () {
        return this.uploadInProgress;
    },
    getById: function (businessId) {
        var business = this.businesses[businessId];

        if (typeof business == 'undefined') {
            this._loadById(businessId);
        }

        return business && business.entity;
    },
    dehydrate: function () {
        return {
            business    : this.business,
            businesses  : this.businesses
        };
    },
    rehydrate: function (state) {
        this.business = state.business;
        this.businesses = state.businesses;
    },
    _loadById: function (businessId) {
        this.dispatcher.getContext().executeAction(BusinessActions.Fetch, {
            id: businessId
        });
    }
});
