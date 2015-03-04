/** @jsx React.DOM */

var facebookConfig = require('../configs/facebook');

// TODO : remove and make it really global
if (typeof global.Intl == 'undefined') {
    global.Intl = require('intl');
}

var React = require('react');
var _ = require('lodash');

var FluxibleMixin = require('fluxible').Mixin;
var ReactIntlMixin = require('react-intl');
var NavLink = require('flux-router-component').NavLink;

var HairfieStore = require('../stores/HairfieStore');

var PublicLayout = require('./PublicLayout.jsx');

var Carousel = require('react-bootstrap/Carousel');
var CarouselItem = require('react-bootstrap/CarouselItem');
var UserProfilePicture = require('./Partial/UserProfilePicture.jsx');

module.exports = React.createClass({
    mixins: [FluxibleMixin, ReactIntlMixin],
    statics: {
        storeListeners: [HairfieStore],
        isNotFound: function (context) {
            return _.isNull(this.state.hairfie);
        }
    },
    getStateFromStores: function () {
        return {
            hairfie: this.getStore(HairfieStore).getById(this.props.route.params.hairfieId),
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    componentDidMount: function () {
        new Share(".share-button", {
            image: "{{ this.state.hairfie.picture.url }}",
            title: "{{ this.state.hairfie.descriptions.facebook }}",
            networks: {
                facebook: {
                  app_id: "{{ facebookConfig.FB_APP_ID }}",
                  load_sdk: false
                },
                twitter: {
                    description: "{{ this.state.hairfie.descriptions.twitter }}"
                }
            }
        });
    },
    render: function () {
        if(!this.state.hairfie) {
            return (
                <PublicLayout>
                    <div>Loading Hairfie in progress</div>
                </PublicLayout>
            );
        } else {
            var businessNode,
                context = this.props.context;
            if(this.state.hairfie.business) {
                var business = this.state.hairfie.business;
                businessNode = (
                    <div className="business">
                        <NavLink routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}}>
                            { 'Réalisé chez ' + this.state.hairfie.business.name }
                        </NavLink>
                    </div>
                )
            } else {
                businessNode = null;
            }

            return (
                <PublicLayout>
                    <div className="row hairfie">
                        <div className="col-md-6 col-md-offset-1 col-sm-6 col-sm-offset-1 col-xs-10 col-xs-offset-1 hairfie-picture">
                            {this.renderHairfiePicture()}
                        </div>

                        <div className="col-md-4 col-sm-4 col-sm-offset-0 col-xs-10 col-xs-offset-1 hairfie-legend-container">
                            <div className="legend">
                                <div className="avatar">
                                    <UserProfilePicture user={this.state.hairfie.author} className="img-circle" />
                                </div>
                                <div className="author">
                                    <span className="name">{ this.state.hairfie.author.firstName } { this.state.hairfie.author.lastName.substring(0,1) }.</span>
                                    <span className="date"> - { this.formatRelative(this.state.hairfie.createdAt) }</span>
                                </div>
                                <div className="clearfix"></div>
                                <div className="description">
                                    { _.map(this.state.hairfie.tags, function(tag) {
                                        return (<span key={tag.id} className="label label-default">{tag.name}</span>)
                                    }) }
                                </div>
                                <div className="clearfix"></div>
                                {businessNode}
                            </div>
                        </div>
                    </div>
                </PublicLayout>
            );
        }
    },
    renderHairfiePicture: function() {
        var price;
        if(this.state.hairfie.price) {
            price = (<div className="circle">{ this.state.hairfie.price.amount } { this.state.hairfie.price.currency == "EUR" ? "€" : "" }</div>)
        }



        return (
            <div className="img-container">
                <Carousel>
                    {_.map(this.state.hairfie.pictures, function(picture) {
                        return (
                            <CarouselItem key={picture.url}>
                                <img src={picture.url} alt={ this.state.hairfie.descriptions.display }/>
                            </CarouselItem>
                        );
                    }, this)}
                </Carousel>
                { price }
                <div className="share-button"></div>
            </div>
        );
    }
});
