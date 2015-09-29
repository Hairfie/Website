'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('./Link.jsx');
var PublicLayout = require('./PublicLayout.jsx');
var Picture = require('./Partial/Picture.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var UserActions = require('../actions/UserActions');
var HairfieActions = require('../actions/HairfieActions');

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }

var PAGE_SIZE = 12;

var moment = require('moment');
require('moment/locale/fr');
moment.locale('fr');

var ShareButton = React.createClass({
    componentDidMount: function () {
        new window.Share('.share-hairfie', {
            ui: {
              button_text: "Partager",
              flyout: "bottom center"
              }});
    },
    render: function () {
        return (
                <div style={{display: 'inline-block'}}>
                    <div className="share-hairfie">
                    </div>
                </div>
            );
    }
});

var Carousel = React.createClass({
    getInitialState: function () {
        return {
            displayIndex: 0
        };
    },
    componentWillReceiveProps: function () {
        this.setState({displayIndex: 0});
    },
    render: function () {
        var pictures = this.props.hairfie.pictures.slice(0, 2);

        return (
            <div id="carousel-hairfie" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner" role="listbox">
                    {_.map(pictures, function (picture, i) {
                        return (
                            <div key={i+'-'+picture.url} className={'item '+(this.state.displayIndex == i ? ' active' : '')}>
                                <div className="outer-img">
                                    <Picture picture={picture}/>
                                    {this.renderPrice()}
                                </div>
                            </div>
                        );
                    }, this)}
                </div>
                {this.renderControl('left', 0, 'Précédent')}
                {this.renderControl('right', 1, 'Suivant')}
            </div>
        );
    },
    renderPrice: function () {
        if (!this.props.hairfie.price) return;
        return (
                <div className="pricetag">
                    {this.props.hairfie.price.amount+'€'}
                </div>
            );

    },
    renderControl: function (position, index, label) {
        if (this.props.hairfie.pictures.length < 2) return;

        return (
            <a className={position+' carousel-control'} href="#" role="button" onClick={this.show.bind(this, index)}>
                <span className={'arrow arrow-'+position} aria-hidden="true" />
                <span className="sr-only">{label}</span>
            </a>
        );
    },
    show: function (i) {
        this.setState({displayIndex: i});
    }
});

var HairfieSingle = React.createClass({
    render: function () {
        return (
            <div className="col-xs-12 col-sm-6">
                <Carousel hairfie={this.props.hairfie} />
                {this.renderBookingButton()}
            </div>
       );
    },
    renderBookingButton: function () {
        if (!this.props.hairfie.business) return;

        return (
            <div className="like-group">
                <div className="like-btn" onClick={this.props.likeHairfie.func}>
                    <a>
                        <span className={"glyphicon glyphicon-heart" + (this.props.likeHairfie.state ? " red" : "")}></span>
                    </a>
                </div>
                <div className="cta">
                    <Link className="btn btn-book full" route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                        Prendre RDV
                    </Link>
                </div>
            </div>
        );
    }
});

var RightColumn = React.createClass({
    render: function() {
        if (!this.props.hairfie.business) return <div />;
        var hairdresserNode;
        if (this.props.hairfie.hairdresser) {
            hairdresserNode = (
                <p>Réalisé par :
                    <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                        {this.props.hairfie.hairdresser.firstName}
                    </Link>
                </p>
            );
        }

        return (
            <div className="col-xs-12 col-sm-6">
                <div className="salon-infos">
                    <div className="row">
                        <div className="col-xs-3">
                            <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                                <Picture picture={this.props.hairfie.business.pictures[0]} resolution={220} />
                            </Link>
                        </div>
                        <div className="col-xs-9 address-bloc">
                            <h2>
                                <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                                    {this.props.hairfie.business.name}
                                </Link>
                            </h2>
                            {hairdresserNode}
                        </div>
                        <div className="col-xs-9 tags">
                            { _.map(this.props.hairfie.tags, function(tag) {
                                return (<span className="tag" key={tag.id}><Link route="hairfie_search" params={{ address: 'Paris--France'}} query={{tags: tag.name}}>{tag.name}</Link></span>)
                            }) }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">
                        </div>
                        <div className="col-xs-9 likes">
                          <p>
                            <a className="col-xs-3" role="button" onClick={this.props.likeHairfie.func}>{this.props.likeHairfie.state ? "Je n'aime plus" : "J'aime"}</a>
                            -
                            <a className="col-xs-3">{this.props.hairfie.numLikes} j'aime</a>
                          </p>
                        </div>
                    </div>
                </div>
                <div className="salon-description" style={{paddingTop: '20px'}}>
                    <ShareButton hairfie={this.props.hairfie} />
                </div>
            </div>
        );
    }
});

var SimilarHairfies = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function() {
        if (_.isUndefined(this.props.page) || this.props.page < 0)
            return this.renderLoader();

        return (
            <div className="hairfies">
                <div className="row">
                    {this.props.similarHairfies.length > 0 ? <h3 className="col-xs-12 text-center">Hairfies Similaires</h3> : ''}
                    {_.map(this.props.similarHairfies, function (hairfie) {
                        var hairdresser = <p>&nbsp;</p>;
                        if (hairfie.hairdresser) {
                            hairdresser = <p>Coiffé par <span>{displayName(hairfie.hairdresser)}</span></p>;
                        }
                        var price;
                        if (hairfie.price) {
                            price = <div className="pricetag">{hairfie.price.amount}€</div>;
                        }

                        return (
                            <div key={hairfie.id} className="col-xs-6 col-sm-3 col-lg-2 single-hairfie">
                                <figure>
                                    <Link route="hairfie" params={{ hairfieId: hairfie.id }}>
                                        <Picture picture={_.last(hairfie.pictures)}
                                                resolution={{width: 640, height: 640}}
                                                placeholder="/images/placeholder-640.png"
                                                alt="" />
                                        <figcaption>
                                            {hairdresser}
                                            <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                            {price}
                                        </figcaption>
                                    </Link>
                                </figure>
                            </div>
                        );
                    }, this)}
                </div>
                {this.renderMoreButton()}
            </div>
            );
    },
    renderLoader: function () {
        return (
            <div className="hairfies">
                <div className="row">
                    <div className="loading" />
                </div>
            </div>
        );
    },
    renderMoreButton: function () {
        if (this.props.page * PAGE_SIZE > this.props.similarHairfies.length) return;

        return <a role="button" onClick={this.loadMore} className="btn btn-red">Voir plus de Hairfies</a>;
    },
    loadMore: function (e) {
        if (e) e.preventDefault();
        this.context.executeAction(HairfieActions.loadSimilarHairfies, {
            hairfie: this.props.hairfie,
            page: (this.props.page || 0) + 1,
            pageSize: PAGE_SIZE
        });
    }
});

var HairfiePage = React.createClass({
    contextTypes: {
        config: React.PropTypes.object,
        executeAction: React.PropTypes.func
    },
    getInitialState: function() {
        this.context.executeAction(UserActions.isLikedHairfie, this.props.hairfie);
        return {};
    },
    render: function () {
        if (!this.props.hairfie) return this.renderLoading();
        return (
            <PublicLayout>
                <div className="container hairfie-singleView" id="content" >
                    <div className="single-view row">
                        <HairfieSingle hairfie={this.props.hairfie} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                        <RightColumn hairfie={this.props.hairfie} currentUser={this.props.currentUser} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                    </div>
                    <SimilarHairfies hairfie={this.props.hairfie} similarHairfies={this.props.similarHairfies} page={this.props.similarHairfiesPage}/>
                </div>
            </PublicLayout>
        );
    },
    renderLoading: function () {
        return (
            <PublicLayout>
                <div className="container hairfie-singleView" id="content" >
                    <div className="loading" />
                </div>
            </PublicLayout>
        );
    },
    likeHairfie: function() {
        if (!this.props.hairfieLiked)
            this.context.executeAction(UserActions.hairfieLike, this.props.hairfie);
        else
            this.context.executeAction(UserActions.hairfieUnlike, this.props.hairfie);
    }
});

HairfiePage = connectToStores(HairfiePage, [
    'HairfieStore',
    'UserStore',
    'AuthStore'
], function (context, props) {
    var hairfie = context.getStore('HairfieStore').getById(props.route.params.hairfieId);
    var token = context.getStore('AuthStore').getToken();
    var user = context.getStore('UserStore').getById(token.userId);
    if (user && user.likeHairfie && user.likeHairfie[hairfie.id] && user.likeHairfie[hairfie.id].isLiked)
        user = user.likeHairfie[hairfie.id].isLiked;
    else
        user = false;

    return {
        hairfie: hairfie,
        similarHairfies: context.getStore('HairfieStore').getSimilarHairfies(hairfie.id),
        similarHairfiesPage: context.getStore('HairfieStore').getSimilarHairfiesPage(hairfie.id),
        hairfieLiked: user
    };
});

module.exports = HairfiePage;
