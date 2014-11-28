/** @jsx React.DOM */

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var ReactIntlMixin = require('react-intl');
var NavLink = require('flux-router-component').NavLink;

var HairfieStore = require('../stores/HairfieStore');

module.exports = React.createClass({
    mixins: [StoreMixin, ReactIntlMixin],
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
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        if(!this.state.hairfie) {
            return (
                <div>Loading Hairfie in progress</div>
            );
        } else {
            var business,
                context = this.props.context;

            if(this.state.hairfie.business) {
                business = (
                    <div className="business">
                        <NavLink routeName="show_business" navParams={{id: this.state.hairfie.business.id}} context={context}>
                            Made at { this.state.hairfie.business.name }
                        </NavLink>
                    </div>
                )
            } else {
                business = null;
            }
            return (
                <div className="row hairfie">
                    <div className="col-md-6 col-md-offset-1 col-sm-6 col-sm-offset-1 col-xs-10 col-xs-offset-1 hairfie-picture">
                        <img src={this.state.hairfie.picture.url} alt={ this.state.hairfie.descriptions.display }/>
                        <div className="share-button"></div>
                    </div>

                    <div className="col-md-4 col-sm-4 col-sm-offset-0 col-xs-10 col-xs-offset-1 hairfie-legend-container">
                        <div className="legend">
                            <div className="avatar">
                                <img src={this.state.hairfie.author.picture.url} className="img-circle" />
                            </div>
                            <div className="author">
                                <span className="name">{ this.state.hairfie.author.firstName } { this.state.hairfie.author.lastName.substring(0,1) }.</span>
                                <span className="date"> - { this.formatRelative(this.state.hairfie.createdAt) }</span>
                            </div>
                            <div className="clearfix"></div>
                            <div className="description">
                                { this.state.hairfie.descriptions.display }
                            </div>
                            <div className="clearfix"></div>
                            {business}
                        </div>
                    </div>
                </div>
            );
        }
    }
});
