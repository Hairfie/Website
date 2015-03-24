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

var Picture = require('./Partial/Picture.jsx');

var HairfieSingle = React.createClass({
    render: function () {
        return (
            <div className="col-xs-12 col-sm-6">
                <div id="carousel-hairfie" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators hide">
                        <li data-target="#carousel-hairfie" data-slide-to="0" className="active"></li>
                        <li data-target="#carousel-hairfie" data-slide-to="1"></li>
                    </ol>
                    <div className="carousel-inner" role="listbox">
                        <div className="item active">
                            <div className="outer-img">
                                <img src={_.first(this.props.hairfie.pictures).url} alt="..." />
                            </div>
                        </div>
                        <div className="item">
                            <div className="outer-img">
                                <img src={_.last(this.props.hairfie.pictures).url} alt="..." />
                            </div>
                        </div>
                    </div>
                    <a className="left carousel-control" href="#carousel-hairfie" role="button" data-slide="prev">
                        <span className="arrow arrow-left" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" href="#carousel-hairfie" role="button" data-slide="next">
                        <span className="arrow arrow-right" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
                <div className="like-group">
                    <div className="like-btn">
                        <a href="#">
                            <span className="glyphicon glyphicon-heart"></span>
                        </a>
                    </div>
                    <div className="cta">
                        <NavLink className="btn btn-red full" routeName="book_business" navParams={{businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug}} context={this.props.context}>
                            Réserver dans ce salon
                        </NavLink>
                    </div>
                </div>
            </div>
       );
    }
});

var RightColumn = React.createClass({
    render: function() {
        var hairdresserNode;
        if(this.props.hairfie.hairdresser) hairdresserNode = (<p>Réalisé par : <a href="#">{this.props.hairfie.hairdresser.firstName}</a></p>);

        return (
            <div className="col-xs-12 col-sm-6">
                <div className="salon-infos">
                    <div className="row">
                        <div className="col-xs-3">
                            <NavLink routeName="show_business" navParams={{businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug}} context={this.props.context}>
                                <Picture picture={this.props.hairfie.business.pictures[0]}
                                   width={220}
                                  height={220} />
                            </NavLink>
                        </div>
                        <div className="col-xs-9 address-bloc">
                            <h2>
                                <NavLink routeName="show_business" navParams={{businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug}} context={this.props.context}>
                                    Alexandre de Paris
                                </NavLink>
                            </h2>
                            {hairdresserNode}
                        </div>
                        <div className="col-xs-9 tags">
                            { _.map(this.props.hairfie.tags, function(tag) {
                                return (<span className="tag" key={tag.id}><a href="#">{tag.name}</a></span>)
                            }) }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">
                        </div>
                        <div className="col-xs-9 likes">
                          <p>
                            {/*<a href="#" className="col-xs-3 like">J'aime</a>
                            - */}
                            <span className="col-xs-3">{this.props.hairfie.numLikes}&nbsp;&nbsp;j'aime</span>
                          </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

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
        TweenMax.to('#content .single-view', 0.5, {marginTop:40,opacity:1,ease:Power2.easeIn});
        TweenMax.to('#content .related-hairfies', 0.5, {marginTop:0,opacity:1,ease:Power2.easeIn,delay:0.3});
        $('.like-btn').on('click',function(){
          $('.glyphicon-heart').toggleClass('full');
        });
        $('.like').on('click',function(){
          console.log("like");
        });
        $('#carousel-hairfie').carousel();
    },
    render: function () {
        if(!this.state.hairfie) {
            return (
                <PublicLayout context={this.props.context}>
                    <div>Loading Hairfie in progress</div>
                </PublicLayout>
            );
        } else {
            // var businessNode,
            //     context = this.props.context;
            // if(this.state.hairfie.business) {
            //     var business = this.state.hairfie.business;
            //     businessNode = (
            //         <div className="business">
            //             <NavLink routeName="show_business" navParams={{businessId: business.id, businessSlug: business.slug}} context={context}>
            //                 { 'Réalisé chez ' + this.state.hairfie.business.name }
            //             </NavLink>
            //         </div>
            //     )
            // } else {
            //     businessNode = null;
            // }

            return (
                <PublicLayout context={this.props.context}>
                    <div className="container hairfie-singleView" id="content" >
                        <a href="#">
                            <span className="arrow arrow-left" aria-hidden="true"></span>
                        </a>
                        <a href="#">
                            <span className="arrow arrow-right" aria-hidden="true"></span>
                        </a>
                        <div className="row single-view">
                            <HairfieSingle hairfie={this.state.hairfie} context={this.props.context} />
                            <RightColumn hairfie={this.state.hairfie} context={this.props.context} />
                        </div>
                        <div className="row related-hairfies hairfies">
                            <h3>Autres Hairfies similaires :</h3>
                            <div className="col-xs-6 col-sm-3 col-lg-2 single-hairfie">
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

// <div className="col-md-4 col-sm-4 col-sm-offset-0 col-xs-10 col-xs-offset-1 hairfie-legend-container">
//                             <div className="legend">
//                                 <div className="avatar">
//                                     <UserProfilePicture user={this.state.hairfie.author} className="img-circle" />
//                                 </div>
//                                 <div className="author">
//                                     <span className="name">{ this.state.hairfie.author.firstName } { this.state.hairfie.author.lastName.substring(0,1) }.</span>
//                                     <span className="date"> - { this.formatRelative(this.state.hairfie.createdAt) }</span>
//                                 </div>
//                                 <div className="clearfix"></div>
//                                 <div className="description">
//                                     { _.map(this.state.hairfie.tags, function(tag) {
//                                         return (<span key={tag.id} className="label label-default">{tag.name}</span>)
//                                     }) }
//                                 </div>
//                                 <div className="clearfix"></div>
//                                 {businessNode}
//                             </div>
//                         </div>
