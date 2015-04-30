'use strict';

var React = require('react/addons');
var connectToStores = require('fluxible/addons/connectToStores');
var Layout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Alert = require('react-bootstrap/Alert');
var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var BusinessReviewActions = require('../actions/BusinessReviewActions');
var _ = require('lodash');
var moment = require('moment');

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
                <div className="stars">
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
            full: on,
            on  : on,
            off : !on
        });

        return <a href="#" className={className} style={{margin: 0}} onClick={this._selectStar.bind(this, n)} onMouseEnter={this._mouseEnterStar.bind(this, n)} onMouseLeave={this._mouseLeaveStar.bind(this, n)}></a>;
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
                    <Col sm={6}>
                        <Input ref="firstName" type="text"
                            defaultValue={this.props.businessReviewRequest.booking && this.props.businessReviewRequest.booking.firstName}
                            label={<div>Votre prénom <RequiredAsterisk /></div>}
                        />
                    </Col>
                    <Col sm={6}>
                        <Input ref="lastName" type="text"
                            defaultValue={this.props.businessReviewRequest.booking && this.props.businessReviewRequest.booking.lastName}
                            label={<div>Votre nom <RequiredAsterisk /> <small>(cette information n'apparaitra pas)</small></div>}
                        />
                    </Col>
                </Row>
                <hr />
                <p>Veuillez attribuer une note à chacun des critères suivants :</p>
                <br />
                <Row>
                    <Col xs={6} md={4}>
                        <RatingInput ref="welcome" label="Accueil" />
                    </Col>
                    <Col xs={6} md={4}>
                        <RatingInput ref="discussion" label="Discussions" />
                    </Col>
                    <Col xs={6} md={4}>
                        <RatingInput ref="decoration" label="Décoration" />
                    </Col>
                    <Col xs={6} md={4}>
                        <RatingInput ref="hygiene" label="Hygiène" />
                    </Col>
                    <Col xs={6} md={4}>
                        <RatingInput ref="treatment" label="Soins" />
                    </Col>
                    <Col xs={6} md={4}>
                        <RatingInput ref="resultQuality" label="Qualité du résultat" />
                    </Col>
                    <Col xs={6} md={4}>
                        <RatingInput ref="availability" label="Disponibilité" />
                    </Col>
                </Row>
                <hr />
                <Input ref="comment" type="textarea" label="Un commentaire ?" />
                <Button onClick={this.submit} className="btn btn-red full">Déposer l'avis</Button>
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

var WriteVerifiedBusinessReviewPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function () {
        return <Layout context={this.props.context}>{this.renderBody()}</Layout>;
    },
    renderBody: function () {
        var brr = this.props.businessReviewRequest;

        if (!brr) return <p>La page que vous avez demandée est introuvable.</p>;
        if (brr.used) return (
            <div className="container write-review" id="content" style={{minHeight: '100%'}}>
                <h1>Merci !</h1>
                <p>Votre avis a bien été envoyé.</p>
            </div>
        );
        if (!brr.canWrite) return <p>Il semble que vous ne puissiez pas soumettre d'avis pour le moment.{/*'*/}</p>;

        var title = 'Votre avis sur ' + brr.business.name;
        var bookingNode;

        if(brr.booking) {
            bookingNode = <p>Vous êtes allé le <strong>{moment(brr.booking.timeslot).format("dddd D MMMM YYYY")}</strong> chez <strong>{brr.business.name}</strong>.</p>
        } else {
            bookingNode = <p>Vous êtes récemment passé(e) chez <strong>{brr.business.name}</strong>.</p>
        }

        return (
            <div className="container write-review" id="content">
                <h1>{title}</h1>
                {bookingNode}
                <p>Que vous soyez content(e) ou déçu(e), que vous soyez chauve ou chevelu(e), que vous ayez les cheveux lisses ou crépus, (et même s’ils ont disparus), votre avis compte pour la communauté, alors dites nous avec vérité, ce que vous en pensez !</p>
                <br />
                <ReviewForm businessReviewRequest={brr} onSubmit={this.submitReview} />
            </div>
        );
    },
    submitReview: function (review) {
        this.context.executeAction(BusinessReviewActions.submitVerified, {
            businessReviewRequest: this.props.businessReviewRequest,
            businessReview       : review
        });
    }
});

WriteVerifiedBusinessReviewPage = connectToStores(WriteVerifiedBusinessReviewPage, [
    'BusinessReviewRequestStore'
], function (stores, props) {
    return {
        businessReviewRequest: stores.BusinessReviewRequestStore.getById(props.route.params.businessReviewRequestId)
    };
});

module.exports = WriteVerifiedBusinessReviewPage;
