/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var FluxibleMixin = require('fluxible').Mixin;
var BusinessReviewRequestStore = require('../stores/BusinessReviewRequestStore');
var Layout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Alert = require('react-bootstrap/Alert');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var BusinessReviewActions = require('../actions/BusinessReview');
var _ = require('lodash');

var RequiredAsterisk = React.createClass({
    render: function () {
        return <span className="required-asterisk">*</span>;
    }
});

var RatingInput = React.createClass({
    getInitialState: function () {
        return {
            value       : this.props.defaultValue || 0,
            mouseValue  : null
        };
    },
    render: function () {
        return (
            <Input {...this.props}>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(function (n) { return this.renderStar(n); }.bind(this))}
                </div>
            </Input>
        );
    },
    renderStar: function (n) {
        var value = null == this.state.mouseValue ? this.state.value : this.state.mouseValue,
            on    = value > this._starLowerBound(n);

        var className = React.addons.classSet({
            star: true,
            on  : on,
            off : !on
        });

        return <a href="#" className={className} onClick={this._selectStar.bind(this, n)} onMouseEnter={this._mouseEnterStar.bind(this, n)} onMouseLeave={this._mouseLeaveStar.bind(this, n)}></a>;
    },
    getValue: function () {
        return this.state.value;
    },
    _mouseEnterStar: function (n) {
        this.setState({mouseValue: this._starValue(n)});
    },
    _mouseLeaveStar: function (n) {
        this.setState({mouseValue: null});
    },
    _selectStar: function (n, e) {
        e.preventDefault();
        this.setState({value: this._starValue(n)});
    },
    _starLowerBound: function (n) {
        return this._starValue(n) - 19;
    },
    _starValue: function (n) {
        return n * 20;
    }
});

var ReviewForm = React.createClass({
    getInitialState: function () {
        return {
            errors: []
        };
    },
    render: function () {
        var errorsNode;
        if (this.state.errors.length) {
            errorsNode = (
                <Alert bsStyle="danger">
                    <ul className="list-unstyled">
                        {this.state.errors.map(function (error) {
                            return <li key={error}>{error}</li>;
                        })}
                    </ul>
                </Alert>
            );
        }

        return (
            <div>
                {errorsNode}
                <Row>
                    <Col md={6}>
                        <Input ref="firstName" type="text" label={<div>Votre prénom <RequiredAsterisk /></div>} />
                    </Col>
                    <Col md={6}>
                        <Input ref="lastName" type="text" label={<div>Votre nom <RequiredAsterisk /> <small>(cette information n'apparaitra pas)</small></div>} />
                    </Col>
                </Row>
                <hr />
                <p>Veuillez attribuer une note à chacun des critères suivants :</p>
                <br />
                <Row>
                    <Col md={3}>
                        <RatingInput ref="welcome" label="Accueil" />
                        <RatingInput ref="discussion" label="Discussions" />
                    </Col>
                    <Col md={3}>
                        <RatingInput ref="decoration" label="Décoration" />
                        <RatingInput ref="hygiene" label="Hygiène" />
                    </Col>
                    <Col md={3}>
                        <RatingInput ref="treatment" label="Soins" />
                        <RatingInput ref="resultQuality" label="Qualité du résultat" />
                    </Col>
                    <Col md={3}>
                        <RatingInput ref="availability" label="Disponibilité" />
                    </Col>
                </Row>
                <hr />
                <Input ref="comment" type="textarea" label="Votre commentaire" />
                <Button onClick={this.submit}>Déposer l'avis</Button>
                <hr />
                <p><RequiredAsterisk /> Indique les champs requis.</p>
            </div>
        );
    },
    getReview: function () {
        return {
            firstName   : this.refs.firstName.getValue().trim(),
            lastName    : this.refs.lastName.getValue().trim(),
            criteria    : {
                welcome             : this.refs.welcome.getValue(),
                discussion          : this.refs.discussion.getValue(),
                decoration          : this.refs.decoration.getValue(),
                hygiene             : this.refs.hygiene.getValue(),
                treatment           : this.refs.treatment.getValue(),
                resultQuality       : this.refs.resultQuality.getValue(),
                availability        : this.refs.availability.getValue()
            },
            comment     : this.refs.comment.getValue().trim()
        }
    },
    submit: function () {
        var review = this.getReview(),
            errors = [];

        if ('' == review.firstName) errors.push('Veuillez saisir votre prénom.');
        if ('' == review.lastName) errors.push('Veuillez saisir votre nom.');
        if (_.some(_.values(review.criteria), function (v) { return !v })) errors.push('Veuillez attribuer une note à chacun des critères.');

        this.setState({errors: errors});

        if (!errors.length) this.props.onSubmit(review);
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessReviewRequestStore]
    },
    getStateFromStores: function () {
        var businessReviewRequestId = this.props.route.params.businessReviewRequestId,
            businessReviewRequest   = this.getStore(BusinessReviewRequestStore).getById(businessReviewRequestId);

        return {
            businessReviewRequest: businessReviewRequest
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return <Layout context={this.props.context}>{this.renderBody()}</Layout>;
    },
    renderBody: function () {
        var brr = this.state.businessReviewRequest;

        if (_.isUndefined(brr)) return <p>Chargement des informations...</p>;
        if (!brr) return <p>La page que vous avez demandée est introuvable.</p>;
        if (brr.used) return <p>Votre avis a bien été envoyé.</p>;
        if (!brr.canWrite) return <p>Il semble que vous ne puissiez pas soumettre d'avis pour le moment.</p>;

        return (
            <div>
                <p>Vous êtes récemment passé(e) chez <strong>{brr.business.name}</strong>.</p>
                <p>Que vous soyez content(e) ou déçu(e), que vous soyez chauve ou chevelu(e), que vous ayez les cheveux lisses ou crépus, (et même s’ils ont disparus), votre avis compte pour la communauté, alors dites nous avec vérité, ce que vous en pensez !</p>
                <br />
                <ReviewForm businessReviewRequest={brr} onSubmit={this.submitReview} />
            </div>
        );
    },

    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    submitReview: function (review) {
        this.executeAction(BusinessReviewActions.SaveVerified, {
            businessReviewRequest: this.state.businessReviewRequest,
            businessReview       : review
        });
    }
});
