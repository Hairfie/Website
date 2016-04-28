'use strict';

var React = require('react');
var _ = require('lodash');
var BSInput = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var RatingInput = require('./RatingInput.jsx');
var UserConstants = require('../../constants/UserConstants');
var FacebookButton = require('../Auth/FacebookButton.jsx');
var FormConnect = require('../Auth/FormConnect.jsx');
var validation = require('react-validation-mixin');
var strategy = require('react-validatorjs-strategy');
var classNames = require('classnames');

var UserInfos = React.createClass ({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    propTypes: {
        onSubmit                : React.PropTypes.func,
        errors                  : React.PropTypes.object,
        validate                : React.PropTypes.func,
        isValid                 : React.PropTypes.func,
        handleValidation        : React.PropTypes.func,
        getValidationMessages   : React.PropTypes.func,
        clearValidations        : React.PropTypes.func
    },
    getValidatorData: function() {
        return {
            gender              : this.state.gender,
            userFirstName       : this.refs.userFirstName.value,
            userLastName        : this.refs.userLastName.value,
            userEmail           : this.refs.userEmail.value
        };
    },
    getDefaultProps: function () {
        return {

        };
    },
    getInitialState: function() {
        this.validatorTypes = strategy.createSchema(
        {
            gender              : 'required',
            userFirstName       : 'required',
            userLastName        : 'required',
            userEmail           : 'email|required'
        },
        {
            "required.gender": "Vous devez choisir votre genre",
            "required.userFirstName": "Vous devez saisir votre prénom",
            "required.userLastName": "Vous devez saisir votre nom",
            "required.userEmail": "Vous devez saisir un email",
            "email.userEmail": "L'email saisi est incorrect"
        },
        function (validator) {
            validator.lang = 'fr';
        })
        return {
            formConnect         : false,
            firstName           : this.props.review.firstName,
            lastName            : this.props.review.lastName,
            email               : this.props.review.email,
            phoneNumber         : this.props.review.phoneNumber,
            gender              : this.props.review.gender ? this.props.review.gender : UserConstants.Genders.FEMALE

        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (!nextProps.review)
            return;
        this.setState({
            firstName   : _.isEmpty(this.state.firstName) && nextProps.review.firstName ? nextProps.review.firstName : this.state.firstName,
            lastName    : _.isEmpty(this.state.lastName) && nextProps.review.lastName ? nextProps.review.lastName : this.state.lastName,
            email       : _.isEmpty(this.state.email) && nextProps.review.email ? nextProps.review.email : this.state.email,
            phoneNumber : _.isEmpty(this.state.phoneNumber) && nextProps.review.phoneNumber ? nextProps.review.phoneNumber : this.state.phoneNumber,
            gender      :  nextProps.review.gender ? nextProps.review.gender : this.state.gender
        });
    },
    render: function() {
        return (
            <div {...this.props}>
                <div className="title">
                    Vos informations
                    <span>
                        {this.renderIfNotConnected()}
                    </span>
                </div>
                {this.renderConnectForm()}
                 <div className="gender-radio">
                    <BSInput className="radio">
                        <label className="radio-inline" style={{marginLeft: '0px'}}>
                            <input type="radio" name="gender" checked={this.state.gender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                            Femme
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="gender" checked={this.state.gender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
                            Homme
                        </label>
                    </BSInput>
                </div>
                <div className={this.getClasses('userFirstName')}>
                    <input 
                        ref="userFirstName" 
                        name="userFirstName" 
                        type="text"  
                        className="form-control"
                        placeholder="Prénom*" 
                        value={this.state.firstName} 
                        onChange={this.handleFirstNameChanged}
                        onBlur={this.props.handleValidation('userFirstName')}
                        />
                </div>
                <div className={this.getClasses('userLastName')}>
                    <input 
                        ref="userLastName" 
                        name="userLastName" 
                        type="text" 
                        className="form-control"
                        placeholder="Nom* (ne sera pas affiché publiquement)" 
                        value={this.state.lastName} 
                        onChange={this.handleLastNameChanged} 
                        onBlur={this.props.handleValidation('userLastName')}
                        />
                </div>
                <div className={this.getClasses('userEmail')}>
                    <input 
                        ref="userEmail" 
                        name="userEmail" 
                        type="email" 
                        className="form-control"
                        placeholder="Email*" 
                        value={this.state.email} 
                        onChange={this.handleEmailChanged} 
                        onBlur={this.props.handleValidation('userEmail')}
                        />
                </div>
                <div className={this.getClasses('userPhoneNumber')}>
                    <input 
                        ref="userPhoneNumber" 
                        name="userPhoneNumber" 
                        type="text"
                        className="form-control" 
                        placeholder="Téléphone portable(facultatif)" 
                        value={this.state.phoneNumber} 
                        onChange={this.handlePhoneNumberChanged} 
                        onBlur={this.props.handleValidation('userPhoneNumber')}
                        />
                </div>
                {this.renderErrorMessages()}
                <div className="bottom-bar">
                    {this.props.dots()}
                    <Button className='btn btn-book' onClick={this.submit}>Poster mon avis</Button>
                </div>
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
    handleGenderChanged: function (e) {
        this.setState({
            gender: e.currentTarget.value
        });
    },
    renderConnectForm: function() {
        if (!this.state.formConnect || this.props.currentUser)
            return;
        return (
            <div className="connect-bloc">
                <FacebookButton withNavigate={false}/>
                <FormConnect withNavigate={false}/>
            </div>
        );
    },
    renderIfNotConnected: function() {
        if (!this.props.currentUser)
            return (
                <div>
                    <a className="connect" onClick={this.handleFormConnectChanged} role="button">
                        Se connecter
                    </a>
                </div>
            );
    },
    handleFormConnectChanged: function () {
            this.setState({
               formConnect: !this.state.formConnect
            });
    },
    renderErrorMessages: function() {
        if (_.isEmpty(this.props.getValidationMessages())) return;
        return (
            <div className="validation-errors alert">
                {this.props.getValidationMessages()}
            </div>
        );
    },
    getClasses: function(field) {
        return classNames({
            'form-group': true,
            'has-error': !this.props.isValid(field)
        });
    },
    getUserInfos: function() {
        return {
            firstName           : this.state.firstName,
            lastName            : this.state.lastName,
            email               : this.state.email,
            phoneNumber         : this.state.phoneNumber,
            gender              : this.state.gender
        };
    },
    submit: function (e) {
        e.preventDefault();
        this.props.validate(function(error) {
            if (error) {
                return;
            } else {
                this.props.onSubmit(this.getUserInfos());
            }
        }.bind(this));
    }

});

module.exports = validation(strategy)(UserInfos);