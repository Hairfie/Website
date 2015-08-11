'use strict';

var React = require('react');
var _ = require('lodash');

var UserConstants = require('../../constants/UserConstants');

var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;

var FacebookButton = require('../Auth/FacebookButton.jsx');
var FormConnect = require('../Auth/FormConnect.jsx');

module.exports = React.createClass({
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
                cgu: false,
                newsletter: true
                };
        }
        return {
            formConnect: false,
            cgu: false,
            firstName: this.props.currentUser.firstName ? this.props.currentUser.firstName : "",
            lastName: this.props.currentUser.lastName ? this.props.currentUser.lastName : "",
            email: this.props.currentUser.email ? this.props.currentUser.email : "",
            phoneNumber: this.props.currentUser.phoneNumber ? this.props.currentUser.phoneNumber : "",
            userGender: this.props.currentUser.gender ? this.props.currentUser.gender : ""
        };
    },
    render: function() {
        var promoNode;
        if(this.props.discount)
            promoNode = <p className="promo">{this.props.discount + ' % sur toutes les prestations'}</p>;
        return (
            <div>
                <div className="legend conf">
                    <p className="green">{"Finalisez votre réservation chez  " + this.props.business.name}</p>
                    <p dangerouslySetInnerHTML={{__html:this.props.timeslotSelected.format("[pour le <u>] dddd D MMMM YYYY [</u> à <u>] HH:mm [</u>]")}} />
                    {promoNode}
                </div>
                <a href="#" className="pull-right" onClick={this.modifyTimeslot} >Modifier ma réservation</a>
                <div className="clearfix"></div>
                <hr />
                {this.renderIfNotConnected()}
                <div>
                    <div className="col-sm-8 confirm-bloc-form">
                        <div className="form-group">
                            <form role="form" className="form">
                                <Input className="radio">
                                    <label className="radio-inline">
                                      <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
                                      Homme
                                    </label>
                                    <label className="radio-inline" style={{marginLeft: '0px'}}>
                                      <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                                      Femme
                                    </label>
                                </Input>
                                <Input ref="userFirstName" name="userFirstName" type="text"  placeholder="Prénom *" value={this.state.firstName} onChange={this.handleFirstNameChanged} />
                                <Input ref="userLastName" name="userLastName" type="text" placeholder="Nom *" value={this.state.lastName} onChange={this.handleLastNameChanged} />
                                <Input ref="userEmail" name="userEmail" type="email" placeholder="Email *" value={this.state.email} onChange={this.handleEmailChanged} />
                                <Input ref="userPhoneNumber" name="userPhoneNumber" type="text" placeholder="Numéro de portable (un code validation vous sera envoyé par SMS) *" value={this.state.phoneNumber} onChange={this.handlePhoneNumberChanged}/>
                                <Input ref="userComment" name="userComment" type="text" placeholder="Quelle prestation désirez-vous ? Une demande particulière ?" />
                            </form>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <hr />
                    {this.renderNewsletter()}
                    <label for="cgu" style={{paddingLeft: '15px'}}>
                        <input type="checkbox" name='cgu' onChange={this.handleCGUChanged}/>
                        <span></span>
                        Je reconnais avoir prix connaissance des <a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank">conditions générales d'{/* ' */}utilisation</a> de hairfie.
                    </label>
                    <a role="button" onClick={this.submit} className="btn btn-red">Terminer la réservation</a>
                </div>
            </div>
        );
    },
    renderIfNotConnected: function() {
        if (!this.props.currentUser)
            return (
                <div>
                    <a className="green" onClick={this.handleFormConnectChanged} role="button">
                        Vous avez déjà un compte ? Cliquez ici
                    </a>
                    {this.renderConnectForm()}
                    <hr />
                </div>
            );
    },
    renderNewsletter: function () {
        if (!this.props.currentUser)
            return (
                    <label for="newsletter" style={{paddingLeft: '15px'}}>
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
            <div>
                <FacebookButton withNavigate={false}/>
                <FormConnect withNavigate={false}/>
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
            userGender: e.currentTarget.value
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
            comment     : this.refs.userComment.getValue(),
            timeslot    : this.props.timeslotSelected,
            discount    : this.props.discount,
            newsletter  : this.state.newsletter
        };
    },
    getCGUStatus: function() {
        return this.state.cgu;
    },
    submit: function (e) {
        e.preventDefault();
        this.props.onSubmit();
    }
});
