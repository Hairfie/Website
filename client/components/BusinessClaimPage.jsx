/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var EditedBusinessClaimStore = require('../stores/EditedBusinessClaimStore');
var submitBusinessClaimAction = require('../actions/submitBusinessClaim');

var GeneralForm = React.createClass({
    render: function  () {
        var claim = this.props.businessClaim;
        return (
            <div>
                <div>
                    <label>
                        Name:
                        <input ref="name" defaultValue={claim.name} />
                    </label>
                </div>
                <div>
                    <label>
                        Phone number:
                        <input ref="phoneNumber" defaultValue={claim.phoneNumber} />
                    </label>
                </div>
                <div>
                    <label>
                        Kind:
                        <select ref="kind" defaultValue={claim.kind}>
                            <option value="SALON">Salon</option>
                            <option value="HOME">Home</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }
});

var AddressForm = React.createClass({
    render: function  () {
        var address = this.props.businessClaim.address || {};

        return (
            <div>
                <div>
                    <label>
                        Street address:
                        <input ref="street" defaultValue={address.street} />
                    </label>
                </div>
                <div>
                    <label>
                        City:
                        <input ref="city" defaultValue={address.city} />
                    </label>
                </div>
                <div>
                    <label>
                        Kind:
                        <select ref="kind" defaultValue={claim.kind}>
                            <option value="SALON">Salon</option>
                            <option value="HOME">Home</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }
});

var MapForm = React.createClass({
    render: function () {
        var gps = this.props.businessClaim.gps || {};

        return (
            <div>
                <div>
                    <label>
                        Latitude:
                        <input ref="lat" defaultValue={gps.lat} />
                    </label>
                </div>
                <div>
                    <label>
                        Longitude:
                        <input ref="lng" defaultValue={gps.lng} />
                    </label>
                </div>
            </div>
        );
    }
});

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [EditedBusinessClaimStore]
    },
    getStateFromStores: function () {
        return {
            businessClaim: this.getStore(EditedBusinessClaimStore).getBusinessClaim()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <div>
                <GeneralForm ref="generalForm" businessClaim={this.state.businessClaim} />
                <AddressForm ref="addressForm" businessClaim={this.state.businessClaim} />
                <MapForm ref="mapForm" businessClaim={this.state.businessClaim} />
                <button onClick={this.save}>save</button>
            </div>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    save: function (e) {
        e.preventDefault();

        var update = React.addons.update;

        var claim = update(this.state.businessClaim);
        var claim = update(claim, {$merge: this.refs.generalForm.getValues()});
        var claim = update(claim, {$merge: this.refs.addressForm.getValues()});
        var claim = update(claim, {$merge: this.refs.map.getValues()});

        this.executeAction(submitBusinessClaimAction, {
            businessClaim: claim
        });
    }
});
