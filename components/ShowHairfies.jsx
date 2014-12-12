/** @jsx React.DOM */

var React = require('react');

var StoreMixin = require('fluxible-app').StoreMixin;
var InfiniteScrollMixin = require('./mixins/infinite-scroll.js');

var NavLink = require('flux-router-component').NavLink;

var HairfieActions = require('../actions/Hairfie');
var HairfiesStore = require('../stores/HairfiesStore');

module.exports = React.createClass({
    mixins: [InfiniteScrollMixin, StoreMixin],
    statics: {
        storeListeners: [HairfiesStore]
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    getStateFromStores: function() {
        return {
            hairfies: this.getStore(HairfiesStore).getHairfiesForBusiness(this.props.businessId),
            endOfScroll: this.getStore(HairfiesStore).isEndOfScroll(this.props.businessId)
        }
    },
    fetchNextPage: function (page) {
        if(!this.state.endOfScroll) {
            this.props.context.executeAction(HairfieActions.List, {
                businessId: this.props.businessId,
                limit: 6,
                skip: page*6
            });
        }
    },
    render: function () {
        var hairfiesNodes = this.state.hairfies.map(this.renderHairfie);

        return (
            <div className="hairfies-list">
                {hairfiesNodes}
                <div className="clearfix" />
            </div>
        );
    },
    renderHairfie: function (hairfie) {
        var price;
        if(hairfie.price) {
            price = (<div className="circle">{hairfie.price.amount} {hairfie.price.currency == "EUR" ? "€" : ""}</div>)
        }
        return (
            <div className="hairfie-picture col-sm-3" key={hairfie.id}>
                <div className="img-container">
                    { price }
                    <NavLink routeName="show_hairfie" navParams={{id: hairfie.id}} context={this.props.context}>
                        <img src={hairfie.picture.url} alt=""/>
                    </NavLink>
                    <div className="share-button"></div>
                </div>
            </div>
        );
    }
});
