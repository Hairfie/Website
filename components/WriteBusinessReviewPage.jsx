'use strict';

var React = require('react/addons');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Layout = require('./PublicLayout.jsx');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var BusinessReviewActions = require('../actions/BusinessReviewActions');
var _ = require('lodash');
var moment = require('moment');

var FacebookButton = require('./Auth/FacebookButton.jsx');
var FormConnect = require('./Auth/FormConnect.jsx');


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

        return <a role="button" className={className} style={{margin: '2px'}} onClick={this._selectStar.bind(this, n)} onMouseEnter={this._mouseEnterStar.bind(this, n)} onMouseLeave={this._mouseLeaveStar.bind(this, n)}></a>;
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
        if (this.props.businessReviewRequest && this.props.businessReviewRequest.booking) {
            return {
                firstName: this.props.businessReviewRequest.booking.firstName || (this.props.currentUser && this.props.currentUser.firstName) || "",
                lastName: this.props.businessReviewRequest.booking.lastName || (this.props.currentUser && this.props.currentUser.lastName) || "",
                email: this.props.businessReviewRequest.booking.email || (this.props.currentUser && this.props.currentUser.email) || "",
                phoneNumber: this.props.businessReviewRequest.booking.phoneNumber || (this.props.currentUser && this.props.currentUser.phoneNumber) || "",
                gender: this.props.businessReviewRequest.booking.gender || (this.props.currentUser && this.props.currentUser.gender) || "FEMALE",
                errors: []
            };
        }
        else if (this.props.currentUser) {
            return {
                firstName: this.props.currentUser.firstName || "",
                lastName: this.props.currentUser.lastName || "",
                gender: this.props.currentUser.gender || "FEMALE",
                email: this.props.currentUser.email || "",
                phoneNumber: this.props.currentUser.phoneNumber || "",
                errors: []
            }
        }
        return {
            errors: [],
            gender: "FEMALE"
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (!nextProps.currentUser)
            return;
        this.setState({
            firstName: nextProps.currentUser.firstName || "",
            lastName: nextProps.currentUser.lastName || "",
            email: nextProps.currentUser.email || "",
            phoneNumber: nextProps.currentUser.phoneNumber  || "",
            gender: nextProps.currentUser.gender || "FEMALE"
        });
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
                    <Col sm={3}>
                        <Input ref="firstName" type="text"
                            value={this.state.firstName}
                            onChange={this.handleFirstNameChanged}
                            label={<div>Votre prénom <RequiredAsterisk /></div>}
                        />
                    </Col>
                    <Col sm={5}>
                        <Input ref="lastName" type="text"
                            value={this.state.lastName}
                            onChange={this.handleLasttNameChanged}
                            label={<div>Votre nom <RequiredAsterisk /> <small>(cette information n'apparaitra pas)</small></div>}
                        />
                    </Col>
                    <Col sm={4}>
                        <div style={{fontWeight: 'bold'}}>Votre genre (Homme ou Femme) <RequiredAsterisk /></div>
                        <select ref="gender" value={this.state.gender} onChange={this.handleGender}>
                                <optgroup>
                                    <option value="MALE">Homme</option>
                                    <option value="FEMALE">Femme</option>
                                </optgroup>
                        </select>
                    </Col>
                    <Col sm={6}>
                        <Input ref="email" type="text"
                            value={this.state.email}
                            onChange={this.handleEmailChanged}
                            label={<div>Votre adresse email <RequiredAsterisk /> <small>(cette information n'apparaitra pas)</small></div>}
                        />
                    </Col>
                    <Col sm={6}>
                        <Input ref="phoneNumber" type="text"
                            value={this.state.phoneNumber}
                            onChange={this.handlePhoneNumberChanged}
                            label={<div>Votre numéro de téléphone <small>(cette information n'apparaitra pas)</small></div>}
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
                <Button onClick={this.submit} className="btn btn-book full">Je dépose mon avis</Button>
                <hr />
                <p><RequiredAsterisk /> Indique les champs requis.</p>
            </div>
        );
    },
    handleFirstNameChanged: function (e) {
        this.setState({
            firstName: e.currentTarget.value
        });
    },
    handleLastNameChanged: function (e) {
        this.setState({
            lastName: e.currentTarget.value
        });
    },
    handleEmailChanged: function (e) {
        this.setState({
            email: e.currentTarget.value
        });
    },
    handlePhoneNumberChanged: function (e) {
        this.setState({
            phoneNumber: e.currentTarget.value
        });
    },
    handleGender: function (e) {
        e.preventDefault();
        this.setState({gender: this.refs.gender.getDOMNode().value});
    },
    getReview: function () {
        return {
            businessId  : this.props.business.id,
            authorId    : this.props.currentUser ? this.props.currentUser.id : undefined,
            firstName   : this.refs.firstName.getValue().trim(),
            lastName    : this.refs.lastName.getValue().trim(),
            gender      : this.refs.gender.getDOMNode().value.trim(),
            email       : this.refs.email.getValue().trim(),
            phoneNumber : this.refs.email.getValue().trim(),
            criteria    : {
                welcome             : this.refs.welcome.getValue(),
                discussion          : this.refs.discussion.getValue(),
                decoration          : this.refs.decoration.getValue(),
                hygiene             : this.refs.hygiene.getValue(),
                treatment           : this.refs.treatment.getValue(),
                resultQuality       : this.refs.resultQuality.getValue(),
                availability        : this.refs.availability.getValue()
            },
            comment     : this.refs.comment.getValue().trim(),
            requestId   : this.props.businessReviewRequest && this.props.businessReviewRequest.id || undefined
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
    getInitialState: function() {
        if (!this.props.currentUser) {
            return {
                formConnect: false
            };
        }
        return null;
    },
    render: function () {
        return <Layout context={this.props.context}>{this.renderBody()}</Layout>;
    },
    renderBody: function () {
        var business = this.props.business;
        var brr = this.props.businessReviewRequest

        if (!business) return <p>La page que vous avez demandée est introuvable.</p>;

        var title = 'Votre avis sur ' + business.name;
        var bookingNode;

        if(brr.booking) {
            bookingNode = <p>Vous êtes allé le <strong>{moment(brr.booking.timeslot).format("dddd D MMMM YYYY")}</strong> chez <strong>{brr.business.name}</strong>.</p>
        } else {
            bookingNode = <p>Vous êtes récemment passé chez <strong>{business.name}</strong>.</p>
        }

        return (
            <div className="container write-review" id="content">
                <h1>{title}</h1>
                {bookingNode}
                <p>Que vous soyez content(e) ou déçu(e), que vous soyez chauve ou chevelu(e), que vous ayez les cheveux lisses ou crépus, votre avis compte pour la communauté, alors dites nous avec vérité, ce que vous en pensez !</p>
                <br />
                {this.renderIfNotConnected()}
                <ReviewForm businessReviewRequest={brr} currentUser={this.props.currentUser} business={this.props.business} onSubmit={this.submitReview} />
            </div>
        );
    },
    renderIfNotConnected: function() {
        if (!this.props.currentUser)
            return (
                <div>
                    <a className="color-hairfie" onClick={this.handleFormConnectChanged} role="button">
                        Déjà un compte ?
                    </a>
                    {this.renderConnectForm()}
                    <hr />
                </div>
            );
    },
    renderConnectForm: function() {
        if (!this.state.formConnect)
            return;
        return (
            <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 text-center" style={{marginBottom: '25px'}}>
                <FacebookButton withNavigate={false} style={{textAlign: 'left'}}/>
                <FormConnect withNavigate={false}/>
            </div>
        );
    },
    submitReview: function (review) {
        this.context.executeAction(BusinessReviewActions.submitReview, {
            review: review,
            token: this.props.token
        });
    },
    handleFormConnectChanged: function () {
        this.setState({
           formConnect: !this.state.formConnect
        });
    }
});

WriteVerifiedBusinessReviewPage = connectToStores(WriteVerifiedBusinessReviewPage, [
    'AuthStore',
    'UserStore',
    'BusinessStore',
    'BusinessReviewRequestStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    return {
        token: token,
        currentUser: context.getStore('UserStore').getById(token.userId),
        business: context.getStore('BusinessStore').getById(props.route.query.businessId),
        businessReviewRequest: context.getStore('BusinessReviewRequestStore').getById(props.route.query.requestId) || null
    };
});

module.exports = WriteVerifiedBusinessReviewPage;
