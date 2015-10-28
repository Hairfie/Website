'use strict';

var React = require('react');
var PublicLayout = require('./PublicLayout.jsx');
var connectToStores = require('fluxible-addons-react/connectToStores');
var UserActions = require('../actions/UserActions');
var RightColumn = require('./HairfiePage/RightColumn.jsx');
var HairfieSingle = require('./HairfiePage/HairfieSingle.jsx');
var SimilarHairfies = require('./HairfiePage/SimilarHairfies.jsx');

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
