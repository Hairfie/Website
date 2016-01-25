'use strict';

var React = require('react');
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
            <PublicLayout>
                <div className="container hairfie-singleView" id="content">
                    <div className="hairfie-newsletter">
                        <Newsletter />
                    </div>
                    <div className="single-view row">
                        <HairfieSingle hairfie={this.props.hairfie} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                        <RightColumn hairfie={this.props.hairfie} currentUser={this.props.currentUser} likeHairfie={{func: this.likeHairfie, state: this.props.hairfieLiked}}/>
                    </div>
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

PopupHairfie = connectToStores(PopupHairfie, [
    'HairfieStore',
    'UserStore',
    'AuthStore'
], function (context, props) {
    var hairfie = props.hairfie;
    var token = context.getStore('AuthStore').getToken();
    var user = context.getStore('UserStore').getById(token.userId);
    if (user && user.likedHairfie)
        var liked = user.likedHairfie[hairfie.id] || false;
    else
        var liked = false;

    _.assign({}, props, {
        hairfie: hairfie,
        hairfieLiked: liked
    });
});

module.exports = PopupHairfie;
