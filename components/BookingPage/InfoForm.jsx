'use strict';

var React = require('react');
var _ = require('lodash');
var NotificationActions = require('../../actions/NotificationActions');
var ReactTooltip = require('react-tooltip');

var UserConstants = require('../../constants/UserConstants');

var Button = require('react-bootstrap').Button;
var BSInput = require('react-bootstrap').Input;

var FacebookButton = require('../Auth/FacebookButton.jsx');
var FormConnect = require('../Auth/FormConnect.jsx');
var formValidation = require('../../lib/formValidation');
var validation = require('react-validation-mixin');
var strategy = require('react-validatorjs-strategy');
var classNames = require('classnames');

var InfoForm = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    propTypes: {
        modifyTimeslot: React.PropTypes.func,
        onSubmit: React.PropTypes.func,
        errors: React.PropTypes.object,
        validate: React.PropTypes.func,
        isValid: React.PropTypes.func,
        handleValidation: React.PropTypes.func,
        getValidationMessages: React.PropTypes.func,
        clearValidations: React.PropTypes.func
    },
    getValidatorData() {
        return {
            userGender: this.state.userGender,
            userFirstName: this.refs.userFirstName.value,
            userLastName: this.refs.userLastName.value,
            userEmail: this.refs.userEmail.value,
            userPhoneNumber: this.refs.userPhoneNumber.value,
            service: this.refs.service.value,
            cgu: this.state.cgu
        };
    },
    getDefaultProps: function () {
        return {
            modifyTimeslot: _.noop,
            onSubmit: _.noop
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (!nextProps.currentUser)
            return;
        this.setState({
            firstName: nextProps.currentUser.firstName ? nextProps.currentUser.firstName : "",
            lastName: nextProps.currentUser.lastName ? nextProps.currentUser.lastName : "",
            email: nextProps.currentUser.email ? nextProps.currentUser.email : "",
            phoneNumber: nextProps.currentUser.phoneNumber ? nextProps.currentUser.phoneNumber : this.state.phoneNumber,
            userGender: nextProps.currentUser.gender ? nextProps.currentUser.gender : ""
        });
    },
    getInitialState: function() {
        this.validatorTypes = strategy.createSchema(
        {
            userGender: 'required',
            userFirstName: 'required',
            userLastName: 'required',
            userEmail: 'email|required',
            userPhoneNumber: 'required',
            service: 'required',
            cgu: 'accepted'
        },
        {
            "required.userGender": "Vous devez choisir votre genre",
            "required.userFirstName": "Vous devez saisir votre prénom",
            "required.userLastName": "Vous devez saisir votre nom",
            "required.userEmail": "Vous devez saisir un email",
            "email.userEmail": "L'email saisi est incorrect",
            "required.userPhoneNumber": "Vous devez saisir un n° de téléphone portable",
            "required.service": "Vous devez indiquer la prestation souhaitée",
            "accepted.cgu": "Vous devez accepter les CGU"
        },
        function (validator) {
            validator.lang = 'fr';
        })
        if (!this.props.currentUser) {
            return {
                formConnect: false,
                cgu: 1,
                newsletter: true,
                firstTimeCustomer: true,
                userGender: UserConstants.Genders.FEMALE,
                hairLength: UserConstants.Hairs.SHORT
            };
        }
        
        return {
            formConnect: false,
            cgu: 1,
            firstTimeCustomer: true,
            firstName: this.props.currentUser.firstName ? this.props.currentUser.firstName : "",
            lastName: this.props.currentUser.lastName ? this.props.currentUser.lastName : "",
            email: this.props.currentUser.email ? this.props.currentUser.email : "",
            phoneNumber: this.props.currentUser.phoneNumber ? this.props.currentUser.phoneNumber : "",
            userGender: this.props.currentUser.gender ? this.props.currentUser.gender : UserConstants.Genders.FEMALE,
            hairLength: UserConstants.Hairs.SHORT

        };
    },
    render : function() {
        return (
            <div className="info-form">
                <div className="customer-infos col-sm-6 col-xs-12">
                    <div className="title">
                        Mes informations
                        <span>
                            {this.renderIfNotConnected()}
                        </span>
                    </div>
                    {this.renderConnectForm()}
                    <div className="gender-radio">
                        <BSInput className="radio">
                            <label className="radio-inline" style={{marginLeft: '0px'}}>
                                <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                                Femme
                            </label>
                            <label className="radio-inline">
                                <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
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
                            onBlur={this.props.handleValidation('userFirstName')}/>
                    </div>
                    <div className={this.getClasses('userLastName')}>
                        <input 
                            ref="userLastName" 
                            name="userLastName" 
                            type="text" 
                            className="form-control"
                            placeholder="Nom*" 
                            value={this.state.lastName} 
                            onChange={this.handleLastNameChanged} 
                            onBlur={this.props.handleValidation('userLastName')}/>
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
                            onBlur={this.props.handleValidation('userEmail')}/>
                    </div>
                    <div className={this.getClasses('userPhoneNumber')}>
                        <input 
                            ref="userPhoneNumber" 
                            name="userPhoneNumber" 
                            type="text"
                            className="form-control" 
                            placeholder="Téléphone portable*" 
                            value={this.state.phoneNumber} 
                            onChange={this.handlePhoneNumberChanged} 
                            onBlur={this.props.handleValidation('userPhoneNumber')}/>
                    </div>
                </div>
                <div className="cut-infos col-sm-6 col-xs-12">
                    <div className="title">
                        Informations sur la prestation
                    </div>
                    <p>Longueur de vos cheveux * </p>
                    <BSInput className="radio">
                        <div className="radio-group">
                            <div className="text-center ">
                                <input data-tip="Au-dessus des épaules" type="radio" name="hairLength" checked={this.state.hairLength === UserConstants.Hairs.SHORT} onChange={this.handleHairLengthChanged} value={UserConstants.Hairs.SHORT} />
                                <p data-tip="Au-dessus des épaules">Courts</p>
                            </div>
                            <div className="text-center ">
                                <input data-tip="Au niveau des épaules" type="radio" name="hairLength" checked={this.state.hairLength === UserConstants.Hairs.MID_SHORT} onChange={this.handleHairLengthChanged} value={UserConstants.Hairs.MID_SHORT} />
                                <p data-tip="Au niveau des épaules">Mi-Longs</p>
                            </div>
                            <div className="text-center ">
                                <input data-tip="Au niveau des omoplates" type="radio" name="hairLength" checked={this.state.hairLength === UserConstants.Hairs.LONG} onChange={this.handleHairLengthChanged} value={UserConstants.Hairs.LONG} />
                                <p data-tip="Au niveau des omoplates">Longs</p>
                            </div>
                            <div className="text-center ">
                                <input data-tip="Au niveau du bas du dos" type="radio" name="hairLength" checked={this.state.hairLength === UserConstants.Hairs.VERY_LONG} onChange={this.handleHairLengthChanged} value={UserConstants.Hairs.VERY_LONG} />
                                <p data-tip="Au niveau du bas du dos">Très longs</p>
                            </div>
                        </div>
                    </BSInput>
                    <div className={this.getClasses('service')}>
                        <input 
                        ref="service" 
                        name="service" 
                        type="text" 
                        className="form-control"
                        placeholder="Prestation demandée *" 
                        onBlur={this.props.handleValidation('service')}/>
                    </div>
                    <BSInput ref="userComment" name="userComment" type="text" placeholder="Demande particulière (ex : coiffeur habituel)" />
                    <BSInput className="radio">
                        <div className="first-time">Première visite ?</div>
                        <label className="radio-inline">
                            <input type="radio" name="firstTimeCustomer" checked={this.state.firstTimeCustomer === true} onChange={this.handleFirstTimeChanged}/>
                            Oui
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="firstTimeCustomer" checked={this.state.firstTimeCustomer === false} onChange={this.handleFirstTimeChanged}/>
                            Non
                        </label>
                    </BSInput>
                </div>
                {this.renderErrorMessages()}
                <div className="form-end col-xs-12">
                    {this.renderNewsletter()}
                    <label>
                        <input type="checkbox" ref="cgu" name='cgu' defaultChecked={true} onChange={this.handleCGUChanged}/>
                        Je reconnais avoir pris connaissance des <a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank" style={{textDecoration: "underline"}}>conditions générales d'{/* ' */}utilisation</a> de hairfie.
                    </label>
                </div>
                <div className="col-xs-12">
                    <a role="button" onClick={this.submit} className="btn btn-red">Confirmer ma demande</a>
                </div>    
            </div>
        );
    },
    renderErrorMessages: function() {
        if (_.isEmpty(this.props.getValidationMessages())) return;
        return (
            <div className="validation-errors alert col-xs-12 col-sm-offset-2 col-sm-8">
                {this.props.getValidationMessages()}
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
    renderNewsletter: function () {
        if (!this.props.currentUser)
            return (
                    <label>
                        <input type="checkbox" name='newsletter' checked={this.state.newsletter === true} onChange={this.handleNewsletterChanged}/>
                        <span></span>
                        J'accepte de recevoir les newsletters.
                    </label>
                );
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
    getClasses(field) {
        return classNames({
            'form-group': true,
            'has-error': !this.props.isValid(field)
        });
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
            userGender: e.currentTarget.value
        });
    },
    handleHairLengthChanged: function (e) {
        this.setState({
            hairLength: e.currentTarget.value
        });
    },
    handleCGUChanged: function (e) {
        this.setState({
            cgu: e.currentTarget.checked ? 1 : 0
        });
    },
    handleNewsletterChanged: function (e) {
        this.setState({
            newsletter: e.currentTarget.checked
        });
    },
    handleFirstTimeChanged: function(e) {
        this.setState({
            firstTimeCustomer: !this.state.firstTimeCustomer
        });  
    },
    handleFormConnectChanged: function () {
            this.setState({
               formConnect: !this.state.formConnect
            });
    },
    modifyTimeslot: function (e) {
        e.preventDefault();
        this.props.modifyTimeslot();
    },
    getBookingInfo: function() {
        debugger;
        return {
            businessId  : this.props.business.id,
            gender      : this.state.userGender,
            firstName   : this.refs.userFirstName.value,
            lastName    : this.refs.userLastName.value,
            email       : this.refs.userEmail.value,
            phoneNumber : this.refs.userPhoneNumber.value,
            hairLength  : this.state.hairLength,
            service     : this.refs.service.value,
            comment     : this.refs.userComment.value,
            timeslot    : this.props.timeslotSelected,
            discount    : this.props.discount,
            newsletter  : this.state.newsletter,
            firstTimeCustomer : this.state.firstTimeCustomer
        };
    },
    getCGUStatus: function() {
        return this.state.cgu;
    },
    submit: function (e) {
        e.preventDefault();
        this.props.validate(function(error) {
            if (error) {
                return;
            } else {
                this.props.onSubmit(this.getBookingInfo());
            }
        }.bind(this));
    }
});

module.exports = validation(strategy)(InfoForm);