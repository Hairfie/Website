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
            <div className="row hairfie">
                <div className="col-md-6 col-md-offset-1 col-sm-6 col-sm-offset-1 col-xs-10 col-xs-offset-1 hairfie-picture">
                    <img src={this.state.hairfie.picture.url} />
                </div>

                <div className="col-md-4 col-sm-4 col-sm-offset-0 col-xs-10 col-xs-offset-1 hairfie-legend-container">
                    <div className="legend">
                        <div className="avatar">
                            <img src={this.state.hairfie.author.picture.url} className="img-circle" />
                        </div>
                        <div className="author">
                            <span className="name">{ this.state.hairfie.author.firstName } { this.state.hairfie.author.lastName }.</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});