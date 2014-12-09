/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var HairdresserActions = require('../actions/Hairdresser');
var Layout = require('./ProLayout.jsx');
var Uuid = require('uuid');
var _ = require('lodash');
var Button = require('react-bootstrap/Button');

var HairdresserRow = React.createClass({
    render: function () {
        var hairdresser = this.props.hairdresser || {};

        return (
            <tr>
                <td><input ref="firstName" type="text" defaultValue={hairdresser.firstName} /></td>
                <td><input ref="lastName" type="text" defaultValue={hairdresser.lastName} /></td>
                <td><input ref="email" type="email" defaultValue={hairdresser.email} /></td>
                <td><input ref="active" type="checkbox" defaultChecked={hairdresser.active} /></td>
            </tr>
        )
    },
    getValues: function () {
        return {
            firstName: this.refs.firstName.getDOMNode().value,
            lastName: this.refs.lastName.getDOMNode().value,
            email: this.refs.email.getDOMNode().value,
            active: this.refs.active.getDOMNode().checked,
        };
    }
});

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore]
    },
    getStateFromStores: function () {
        return {
            business            : this.getStore(BusinessStore).getBusiness(),
            existingHairdressers: this.getStore(BusinessStore).getHairdressers(),
        };
    },
    getInitialState: function () {
        var state = this.getStateFromStores();
        state.newHairdressers = []; // TODO: should it be part of a store?
        return state;
    },
    render: function () {
        var existingHairdresserRows = this.state.existingHairdressers.map(function (hairdresser) {
            return <HairdresserRow ref={hairdresser.id} key={hairdresser.id} hairdresser={hairdresser} />
        });

        var newHairdresserRows = this.state.newHairdressers.map(function (hairdresser) {
            return <HairdresserRow ref={hairdresser.id} key={hairdresser.id} hairdresser={hairdresser} />
        });

        return (
            <Layout context={this.props.context} business={this.state.business}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Adresse email</th>
                            <th>Actif ?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {existingHairdresserRows}
                        {newHairdresserRows}
                    </tbody>
                </table>

                <p>
                    <Button onClick={this.addHairdresser}>Ajouter un coiffeur</Button>
                </p>

                <p>
                    <Button onClick={this.saveHairdressers}>Sauver les modifications</Button>
                </p>
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    addHairdresser: function () {
        var newHairdressers = this.state.newHairdressers;
        newHairdressers.push({id: Uuid.v4()});
        this.setState({newHairdressers: newHairdressers});
    },
    saveHairdressers: function () {
        // TODO: rework me
        var hairdressers = [];

        _.map(this.state.existingHairdressers, function (hairdresser) {
            var values = this.refs[hairdresser.id].getValues();
            this._saveHairdresser(hairdresser, values, false);
        }, this);

        _.map(this.state.newHairdressers, function (hairdresser) {
            var values = this.refs[hairdresser.id].getValues();
            this._saveHairdresser(hairdresser, values, true);
        }, this);
    },
    _saveHairdresser: function (originalHairdresser, newValues, isNew) {
        var hairdresser = _.assign(_.cloneDeep(originalHairdresser), newValues);

        if (isNew) {
            this.setState({
                newHairdressers: this._getNewHairdressersExcept(hairdresser.id)
            });
            hairdresser.id = undefined;
            hairdresser.business = this.state.business;
        }

        this.props.context.executeAction(HairdresserActions.Save, {hairdresser: hairdresser});
    },
    _getNewHairdressersExcept: function (id) {
        return _.filter(this.state.newHairdressers, function (h) { return h.id != id; });
    }
});
