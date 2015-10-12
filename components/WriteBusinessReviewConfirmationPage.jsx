'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Layout = require('./PublicLayout.jsx');
var _ = require('lodash');
var LeftColumn = require('./BookingPage/LeftColumn.jsx');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var AuthActions = require('../actions/AuthActions');
var Link = require('./Link.jsx');

var WriteBusinessReviewConfirmationPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    componentWillReceiveProps: function(newProps) {
        this.props.review = newProps.review;
    },
    render: function () {
        if (!this.props.review) return null;
        var review = this.props.review;
        var business = review.business;
        return (
            <Layout context={this.props.context}>
                <div className="container review-confirmation" id="content" >
                    <div className="row">
                        <div className="main-content col-md-9 col-sm-12 pull-right">
                            <div className="legend conf">
                                <h3 className="green">Votre avis a bien été pris en compte</h3>
                                <p>
                                    Votre avis a bien été bien prise en compte,
                                    nous vous remercions d'avoir pris le temps de remplir notre formulaire.
                                    N'hésitez pas à télécharger l'application Hairfie ou
                                    à aller vous inspirer en regardant les Hairfies déjà postés par votre salon.
                                </p>
                            </div>
                            {this.renderRegistration()}
                            <div>
                                <div className="col-xs-6">
                                    <Link className="btn btn-red col-xs-12" route="business_reviews"
                                    params={{businessId: business.id, businessSlug: business.slug}}>
                                        Page d'avis
                                    </Link>
                                </div>
                                <div className="col-xs-6">
                                    <Link className="btn btn-red col-xs-12" route="home">Accueil</Link>
                                </div>
                            </div>
                        </div>
                        <LeftColumn context={this.props.context} business={this.props.review.business}/>
                    </div>
                </div>
            </Layout>
        );
    },
    renderRegistration: function() {
        if (!this.props.currentUser)
            return (
                <div>
                    <h3 className="orange">Complétez votre inscription</h3>
                    <div className="col-sm-8 col-xs-12">
                        <Input type="password" ref="password" placeholder="Choisissez un mot de passe" className="registration"/>
                    </div>
                    <div className="col-sm-4 col-xs-12">
                        <Button onClick={this.handleRegisterClick} className="btn-red pull-right registration">S'inscrire</Button>
                    </div>
                </div>
            );
    },
    handleRegisterClick: function(e) {
        e.preventDefault();

        var userInfo = {
            email: this.props.review.email,
            firstName: this.props.review.firstName,
            lastName: this.props.review.lastName,
            password: this.refs.password.getValue(),
            gender: this.refs.gender.getDOMNode().value
        };
        this.context.executeAction(AuthActions.register, userInfo);
    }
});

WriteBusinessReviewConfirmationPage = connectToStores(WriteBusinessReviewConfirmationPage, [
    'AuthStore',
    'UserStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    return {
        currentUser: context.getStore('UserStore').getById(token.userId),
        review: context.getStore('BusinessReviewStore').getById(props.route.params.reviewId)
    };
});

module.exports = WriteBusinessReviewConfirmationPage;
