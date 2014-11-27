/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var ClaimedBusinessStore = require('../stores/ClaimedBusinessStore');
var BusinessClaimSteps = require('../constants/BusinessClaimConstants').Steps;
var BusinessClaimActions = require('../actions/BusinessClaim');
var BusinessClaimComponents = require('./BusinessClaim');

var GeneralStep = BusinessClaimComponents.GeneralStep;
var AddressStep = BusinessClaimComponents.AddressStep;
var MapStep = BusinessClaimComponents.MapStep;

module.exports = React.createClass({
    displayName: 'BusinessClaimPage',
    mixins: [StoreMixin],
    statics: {
        storeListeners: [ClaimedBusinessStore]
    },
    getStateFromStores: function () {
        return {
            businessClaim: this.getStore(ClaimedBusinessStore).getBusinessClaim(),
            currentStep: this.getStore(ClaimedBusinessStore).getCurrentStep(),
            nextStep: this.getStore(ClaimedBusinessStore).getNextStep()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var step;
        switch (this.state.currentStep) {
            case BusinessClaimSteps.GENERAL:
                step = <GeneralStep ref="step" businessClaim={this.state.businessClaim} />
                break;

            case BusinessClaimSteps.ADDRESS:
                step = <AddressStep ref="step" businessClaim={this.state.businessClaim} />;
                break;

            case BusinessClaimSteps.MAP:
                step = <MapStep ref="step" businessClaim={this.state.businessClaim} />;
                break;
        }

        return (
            <div>
                {step}
                <button onClick={this.next}>Validate</button>
            </div>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    next: function () {
        this.refs.step.applyChanges();
        if (this.state.nextStep) {
            this.props.context.executeAction(BusinessClaimActions.ChangeStep, {
                businessClaim: this.state.businessClaim,
                step: this.state.nextStep
            });
        } else {
            this.props.context.executeAction(BusinessClaimActions.Submit, {
                businessClaim: this.state.businessClaim
            });
        }
    }
});
