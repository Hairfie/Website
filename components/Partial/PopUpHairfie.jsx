'use strict';

var React = require('react');
var _ = require('lodash');
var RightColumn = require('../HairfiePage/RightColumn.jsx');
var HairfieSingle = require('../HairfiePage/HairfieSingle.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var UserActions = require('../../actions/UserActions');

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
                <span className="before" role="button" onClick={this.props.prev}/>
                <span className="quit" role="button" onClick={this.props.close}/>
                <div className="single-view row">
                    <HairfieSingle hairfie={this.props.hairfie} backgroundStyle={true} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                    <RightColumn hairfie={this.props.hairfie} currentUser={this.props.currentUser} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                </div>
                <span className="after" role="button" onClick={this.props.next} />
            </div>
        );
    },
    likeHairfie: function() {
        if (!this.props.hairfieLiked)
            this.context.executeAction(UserActions.hairfieLike, this.props.hairfie);
        else
            this.context.executeAction(UserActions.hairfieUnlike, this.props.hairfie);
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
