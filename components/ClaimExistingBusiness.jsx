/** @jsx React.DOM */

var React = require('react');

var StoreMixin = require('fluxible-app').StoreMixin;

var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var AuthStore = require('../stores/AuthStore');
var AuthActions = require('../actions/Auth');

var Button = require('react-bootstrap/Button');

module.exports = React.createClass({
    displayName: 'ClaimExistingBusiness',
    mixins: [StoreMixin],
    statics: {
        storeListeners: [AuthStore]
    },
    getStateFromStores: function () {
        var user = this.getStore(AuthStore).getUser();
        return {
            user                : user,
            loading             : this.getStore(AuthStore).isLoginInProgress()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var business = this.props.business || {};
        if (this.state.user && !business.owner) {
            return (
                <Button className="btn-block btn-primary" type="submit" onClick={this.ClaimExistingBusiness}>
                    Claim this Business
                </Button>
            )
        } else return(null);
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    ClaimExistingBusiness: function() {
        this.props.context.executeAction(BusinessActions.ClaimExisting, {
            business: this.props.business
        });
    }
});
