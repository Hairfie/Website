/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;

var getHairfieAction = require('../actions/getHairfie');
var HairfieStore = require('../stores/HairfieStore');

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [HairfieStore]
    },
    getStateFromStores: function () {
        return {
            hairfie: this.getStore(HairfieStore).getHairfie(),
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <div className="hairfie">
                <h3>Show Hairfie</h3>
                {this.state.hairfie}
            </div>
        );
    }
});