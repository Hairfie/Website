'use strict';

var createStore = require('fluxible-app/utils/createStore');
var _ = require('lodash');
var Constants = require('../constants/BusinessClaimConstants');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var handlers = [];
handlers[Constants.Events.OPEN_SUCCESS] = 'handleOpenSuccess';
handlers[Constants.Events.CHANGE_STEP_SUCCESS] = 'handleChangeStepSuccess';

var steps = _.values(Constants.Steps);

module.exports = createStore({
    storeName: 'ClaimedBusinessStore',
    handlers: makeHandlers({
        'handleOpenSuccess': Constants.Events.OPEN_SUCCESS,
        'handleChangeStepSuccess': Constants.Events.CHANGE_STEP_SUCCESS
    }),
    initialize: function () {},
    dehydrate: function () {
        return {
            businessClaim: this.businessClaim,
            currentStep: this.currentStep
        };
    },
    rehydrate: function (state) {
        this.businessClaim = state.businessClaim;
        this.currentStep = state.currentStep;
    },
    handleOpenSuccess: function (payload) {
        this.businessClaim = payload.businessClaim;
        this.currentStep = Constants.Steps.GENERAL;
        this.emitChange();
    },
    handleChangeStepSuccess: function (payload) {
        this.businessClaim = payload.businessClaim;
        this.currentStep = payload.step;
        this.emitChange();
    },
    getBusinessClaim: function () {
        return this.businessClaim;
    },
    getCurrentStep: function () {
        return this.currentStep;
    },
    getNextStep: function () {
        return steps[steps.indexOf(this.currentStep) + 1];
    }
});
