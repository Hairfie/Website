'use strict';

var createStore = require('fluxible/addons/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');
var Actions = require('../constants/Actions');
var _ = require('lodash');
var TimeslotActions = require('../actions/TimeslotActions');
var moment = require('moment');

moment.locale('fr')

module.exports = createStore({
    storeName: 'TimeslotStore',
    handlers: makeHandlers({
        onReceiveTimeslots: Actions.RECEIVE_BUSINESS_TIMESLOTS
    }),
    initialize: function () {
        this.timeslots = {};
    },
    dehydrate: function () {
        return {
            timeslots: this.timeslots
        };
    },
    rehydrate: function (state) {
        this.timeslots = state.timeslots;
    },
    onReceiveTimeslots: function(payload) {
        if (!this.timeslots[payload.id])
            this.timeslots[payload.id] = {};
        _.forEach(payload.timeslots, function(timeslots, date) {
            this.timeslots[payload.id][date] = timeslots;
        }.bind(this));
        this.emitChange();
    },
    getById: function (businessId) {
        return this.timeslots[businessId];
    }
});