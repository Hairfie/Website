'use strict';

var React = require('react');
var _ = require('lodash');
var RightColumn = require('../HairfiePage/RightColumn.jsx');
var HairfieSingle = require('../HairfiePage/HairfieSingle.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var UserActions = require('../../actions/UserActions');
var Picture = require('./Picture.jsx');
var Link = require('../Link.jsx');

var PopupHairfie = React.createClass({
    contextTypes: {
        config: React.PropTypes.object,
        executeAction: React.PropTypes.func
    },
    getInitialState: function() {
        this.context.executeAction(UserActions.isLikedHairfie, this.props.hairfie);
        return {};
    },
    render: function () {
        if (!this.props.hairfie) return null;
        return (
            <div className="PopUpHairfie hairfie-singleView">
                {this.renderMobile()}
                {this.renderDesktop()}
            </div>
        );
    },
    renderMobile: function() {
        console.log('HAIRFIE', this.props.hairfie);
        return (
            <div className="mobile-popup hidden-md hidden-lg hidden-sm">
                <div className="single-view row">
                    <div className="business-box">
                        <Picture picture={this.props.hairfie.business.pictures[0]}
                           resolution={{width: 100, height: 100}}
                           placeholder="/img/placeholder-124.png" />
                        <div className="business-box-text-container">
                            <span className="title">Le salon de coiffure&nbsp;:</span>
                            <span className="name">{this.props.hairfie.business.name}</span>
                        </div>
                        <span className="quit" role="button" onClick={this.props.close} />    
                    </div>
                    <div className="hairfie-container">
                        <span className="before" role="button" onClick={this.props.prev}>
                            <Picture picture={{url: "/img/icons/left.svg"}} />
                        </span>
                        <span className="after" role="button" onClick={this.props.next} >
                            <Picture picture={{url: "/img/icons/right.svg"}} />
                        </span>
                        <HairfieSingle hairfie={this.props.hairfie} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                    </div>
                    <div className="tags">
                    {_.map(this.props.hairfie.tags, function(tag) {
                        return <span className="tag" hey={tag.id}>{tag.name}</span>
                    })}
                    </div>
                    <Link className="btn btn-book full" route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                        voir le salon
                    </Link>
                </div>
            </div>
        );
    },
    renderDesktop: function() {
        return (
            <div className="hidden-xs">
                <div className="single-view row">
                   <span className="before" role="button" onClick={this.props.prev}>
                        <Picture picture={{url: "/img/icons/left.svg"}} />
                    </span>
                    <span className="after" role="button" onClick={this.props.next} >
                        <Picture picture={{url: "/img/icons/right.svg"}} />
                    </span>
                    <span className="quit" role="button" onClick={this.props.close} />                    
                    <HairfieSingle hairfie={this.props.hairfie} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                    <RightColumn hairfie={this.props.hairfie} currentUser={this.props.currentUser} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                </div>
            </div>
        );
    },
    likeHairfie: function() {
        if (!this.props.hairfieLiked)
            this.context.executeAction(UserActions.hairfieLike, this.props.hairfie);
        else
            this.context.executeAction(UserActions.hairfieUnlike, this.props.hairfie);
    },
    componentWillUnmount: function() {
        document.removeEventListener('keydown', this.keyListener);

    },
    componentDidMount: function() {
        document.addEventListener('keydown', this.keyListener);
    },
    keyListener: function (e) {
        if(e.keyCode == 37) {
            e.preventDefault();
            this.props.prev();
        }
        else if(e.keyCode == 39) {
            e.preventDefault();
            this.props.next();
        }
        else if(e.keyCode == 27) {
            e.preventDefault();
            this.props.close();
        }
    }
});

PopupHairfie = connectToStores(PopupHairfie, [
    'HairfieStore',
    'UserStore',
    'AuthStore'
], function (context, props) {
    var hairfie = context.getStore('HairfieStore').getById(props.hairfieId);
    var token = context.getStore('AuthStore').getToken();
    var user = context.getStore('UserStore').getById(token.userId);
    if (hairfie && user && user.likedHairfie)
        var liked = user.likedHairfie[hairfie.id] || false;
    else
        var liked = false;

    return _.assign({}, props, {
        hairfie: hairfie,
        hairfieLiked: liked
    });
});

module.exports = PopupHairfie;
