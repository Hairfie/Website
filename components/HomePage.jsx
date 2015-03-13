/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');
var FluxibleMixin = require('fluxible').Mixin;
var TopHairfiesStore = require('../stores/TopHairfiesStore');
var TopDealsStore = require('../stores/TopDealsStore');
var CategoriesStore = require('../stores/CategoriesStore');

var _ = require('lodash');

var TopHairfies = React.createClass({
    render: function () {
        return <ol>{_.map(this.props.hairfies, this.renderHairfie)}</ol>;
    },
    renderHairfie: function (hairfie) {
        return <li>{hairfie.id}</li>;
    }
});

var TopDeals = React.createClass({
    render: function () {
        return <ol>{_.map(this.props.deals, this.renderDeal)}</ol>;
    },
    renderDeal: function (deal) {
        return <li>{deal.discount}% chez {deal.business.name}</li>;
    }
});

var Categories = React.createClass({
    render: function () {
        return <ol>{_.map(this.props.categories, this.renderCategory)}</ol>;
    },
    renderCategory: function (cat) {
        return <li>{cat.name}</li>;
    }
});

var PlaceAutocompleteInput = require('./Form/PlaceAutocompleteInput.jsx');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

var BusinessActions = require('../actions/Business');

var SearchBar = React.createClass({
    render: function () {
        return (
            <div>
                <PlaceAutocompleteInput ref="location" placeholder="Où ?" />
                <Button onClick={this.submit}>Go</Button>
            </div>
       );
    },
    submit: function (e) {
        e.preventDefault();

        this.props.context.executeAction(BusinessActions.SubmitSearch, {
            location: this.refs.location.getFormattedAddress()
        });
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [TopHairfiesStore, TopDealsStore, CategoriesStore]
    },
    getStateFromStores: function () {
        return {
            topHairfies: this.getStore(TopHairfiesStore).get(this.props.route.config.numTopHairfies),
            topDeals   : this.getStore(TopDealsStore).get(this.props.route.config.numTopDeals),
            categories : this.getStore(CategoriesStore).get()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <PublicLayout customClass={'home-bg'}>
                <SearchBar context={this.props.context} />
                <div className="row">
                    <h3>Top hairfies du moment</h3>
                    <TopHairfies context={this.props.context} hairfies={this.state.topHairfies} />
                </div>
                <div className="row">
                    <h3>Top promotions du moment</h3>
                    <TopDeals context={this.props.context} deals={this.state.topDeals} />
                </div>
                <div className="row">
                    <h3>Les catégories</h3>
                    <Categories context={this.props.context} categories={this.state.categories} />
                </div>
                <div className="row home">
                    <div className="col-sm-7 col-md-5 col-md-offset-1 left">
                        <h1>
                            Hairfie, l'application qui vous permet de trouver la coiffure et le coiffeur qui vous correspondent !
                        </h1>
                        <div className="trait"></div>
                        <p>
                            Grâce à Hairfie, choisissez le coiffeur qui vous correspond à partir de photos de coiffures et d'avis.
                            N’importe où. N’importe quand.Réservez simplement et bénéficiez de promotions ciblées !
                        </p>

                        <p className="btn-app-store">
                            <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="btn btn-lg">
                                <img id="btn-apple" src="/img/btn-apple@2x.png" />
                            </a>
                        </p>
                    </div>
                    <div className="col-sm-5 col-md-5 col-md-offset-1 iphone">
                        <img id="iphone" className="img-responsive" src="/img/iphone@2x.png" />
                    </div>
                </div>
            </PublicLayout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
