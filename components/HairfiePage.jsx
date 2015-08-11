'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('./Link.jsx');
var PublicLayout = require('./PublicLayout.jsx');
var Picture = require('./Partial/Picture.jsx');
var Loader = require('./Partial/Loader.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var UserActions = require('../actions/UserActions');
var NotificationActions = require('../actions/NotificationActions');
var NavigationActions = require('../actions/NavigationActions');
var Promise = require('q');

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
                                    <Picture picture={picture} />
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
                    <Link className="btn btn-red full" route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                        Réserver dans ce salon
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
    if (user.likeHairfie && user.likeHairfie[hairfie.id] && user.likeHairfie[hairfie.id].isLiked)
        user = user.likeHairfie[hairfie.id].isLiked;
    else
        user = false;

    return {
        hairfie: hairfie,
        hairfieLiked: user
    };
});

module.exports = HairfiePage;
