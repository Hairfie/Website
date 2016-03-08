'use strict';

var React = require('react');
var _ = require('lodash');
var NotificationActions = require('../../actions/NotificationActions');
var ReactTooltip = require('react-tooltip');

var UserConstants = require('../../constants/UserConstants');

var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;

var FacebookButton = require('../Auth/FacebookButton.jsx');
var FormConnect = require('../Auth/FormConnect.jsx');
var formValidation = require('../../lib/formValidation');

module.exports = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    propTypes: {
        modifyTimeslot: React.PropTypes.func,
        onSubmit: React.PropTypes.func
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
            phoneNumber: nextProps.currentUser.phoneNumber ? nextProps.currentUser.phoneNumber : "",
            userGender: nextProps.currentUser.gender ? nextProps.currentUser.gender : ""
        });
    },
    getInitialState: function() {
        if (!this.props.currentUser) {
            return {
                formConnect: false,
                cgu: true,
                newsletter: true,
                firstTimeCustomer: true
            };
        }
        return {
            formConnect: false,
            cgu: true,
            firstTimeCustomer: true,
            firstName: this.props.currentUser.firstName ? this.props.currentUser.firstName : "",
            lastName: this.props.currentUser.lastName ? this.props.currentUser.lastName : "",
            email: this.props.currentUser.email ? this.props.currentUser.email : "",
            phoneNumber: this.props.currentUser.phoneNumber ? this.props.currentUser.phoneNumber : "",
            userGender: this.props.currentUser.gender ? this.props.currentUser.gender : ""
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
                    <Input className="radio">
                        <label className="radio-inline" style={{marginLeft: '0px'}}>
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                            Femme
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
                            Homme
                        </label>
                    </Input>
                    <Input ref="userFirstName" name="userFirstName" type="text"  placeholder="Prénom*" value={this.state.firstName} onChange={this.handleFirstNameChanged} onFocus={formValidation.required} />
                    <Input ref="userLastName" name="userLastName" type="text" placeholder="Nom*" value={this.state.lastName} onChange={this.handleLastNameChanged} onFocus={formValidation.required} />
                    <Input ref="userEmail" name="userEmail" type="email" placeholder="Email*" value={this.state.email} onChange={this.handleEmailChanged} onFocus={formValidation.email} />
                    <Input ref="userPhoneNumber" name="userPhoneNumber" type="text" placeholder="Téléphone*" value={this.state.phoneNumber} onChange={this.handlePhoneNumberChanged} onFocus={formValidation.phoneNumber}/>
                </div>
                <div className="cut-infos col-sm-6 col-xs-12">
                    <div className="title">
                        Informations sur la prestation
                    </div>
                    <p>Longueur de vos cheveux * </p>
                    <Input className="radio">
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
                    </Input>
                    <Input ref="service" name="service" type="text" placeholder="Prestation demandée *" onChange={formValidation.required} onFocus={formValidation.required}/>
                    <Input ref="userComment" name="userComment" type="text" placeholder="Demande particulière (ex : coiffeur habituel)" />
                    <Input className="radio">
                        <div className="first-time">Première visite ?</div>
                        <label className="radio-inline">
                            <input type="radio" name="firstTimeCustomer" checked={this.state.firstTimeCustomer === true} onChange={this.handleFirstTimeChanged}/>
                            Oui
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="firstTimeCustomer" checked={this.state.firstTimeCustomer === false} onChange={this.handleFirstTimeChanged}/>
                            Non
                        </label>
                    </Input>
                </div>
                <div className="form-end col-xs-12">
                    {this.renderNewsletter()}
                    <label>
                        <input type="checkbox" name='cgu' defaultChecked={true} onChange={this.handleCGUChanged}/>
                        Je reconnais avoir pris connaissance des <a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank" style={{textDecoration: "underline"}}>conditions générales d'{/* ' */}utilisation</a> de hairfie.
                    </label>
                </div>
                <div className="col-xs-12">
                    <a role="button" onClick={this.submit} className="btn btn-red">Terminer la réservation</a>
                </div>    
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
        if (!this.state.formConnect)
            return;
        return (
            <div className="connect-bloc">
                <FacebookButton withNavigate={false}/>
                <FormConnect withNavigate={false}/>
            </div>
        );
    },
    handleFirstNameChanged: function (e) {
        formValidation.required(e);
        this.setState({
            firstName: e.currentTarget.value
        });
    },
    handleLastNameChanged: function (e) {
        formValidation.required(e);
        this.setState({
            lastName: e.currentTarget.value
        });
    },
    handleEmailChanged: function (e) {
        formValidation.email(e);
        this.setState({
            email: e.currentTarget.value
        });
    },
    handlePhoneNumberChanged: function (e) {
        formValidation.phoneNumber(e);
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
            cgu: e.currentTarget.checked
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
        if (this.state.formConnect == true)
            this.setState({
               formConnect: false
            });
        else
            this.setState({
                formConnect: true
            });
    },
    modifyTimeslot: function (e) {
        e.preventDefault();
        this.props.modifyTimeslot();
    },
    getBookingInfo: function() {
        return {
            businessId  : this.props.business.id,
            gender      : this.state.userGender,
            firstName   : this.refs.userFirstName.getValue(),
            lastName    : this.refs.userLastName.getValue(),
            email       : this.refs.userEmail.getValue(),
            phoneNumber : this.refs.userPhoneNumber.getValue(),
            hairLength  : this.state.hairLength,
            service     : this.refs.service.getValue(),
            comment     : this.refs.userComment.getValue(),
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
        if (
            !this.refs.userFirstName.getValue() ||
            !this.refs.userLastName.getValue() ||
            !this.refs.userEmail.getValue() ||
            !this.refs.userPhoneNumber.getValue() ||
            !this.state.hairLength ||
            !this.refs.service.getValue()
            ) {
            return this.context.executeAction(
                NotificationActions.notifyWarning,
                {
                    title: 'Information',
                    message: "Certains champs obligatoires n'ont pas été remplis"
                }
            );
        }
        else if (!this.state.cgu) {
            return this.context.executeAction(
                NotificationActions.notifyWarning,
                {
                    title: "Conditions Générales D'utilisation",
                    message: "Vous devez accepter les conditions générales d'utilisation"
                }
            );
        }
        e.preventDefault();
        this.props.onSubmit();
    }
});
