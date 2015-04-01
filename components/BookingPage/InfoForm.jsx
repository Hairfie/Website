/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');

var UserConstants = require('../../constants/UserConstants');

var Button = require('react-bootstrap/Button');
var Input = require('react-bootstrap/Input');

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
    getInitialState: function() {
        return {};
    },
    render: function() {
        var promoNode;
        if(this.props.discount) promoNode = <p className="promo">{this.props.discount + ' % sur toutes les prestations'}</p>

        return (
            <div>
                <div className="legend conf">
                    <p className="green">{"Finalisez votre réservation chez  " + this.props.business.name}</p>
                    <p dangerouslySetInnerHTML={{__html:this.props.timeslotSelected.format("[pour le <u>] D/MM/YYYY [</u> à <u>] HH:mm [</u>]")}} />
                    {promoNode}
                </div>
                <a href="#" className="pull-right" onClick={this.modifyTimeslot} >Modifier ma réservation</a>
                <div className="clearfix"></div>
                <hr />
                <div >
                    <div className="col-sm-8 confirm-bloc-form">
                        <div className="form-group">
                            <form role="form" className="form">
                                <Input className="radio">
                                    <label className="radio-inline">
                                      <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
                                      Homme
                                    </label>
                                    <label className="radio-inline">
                                      <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                                      Femme
                                    </label>
                                </Input>
                                <Input ref="userFirstName" type="text"  placeholder="Prénom *" required />
                                <Input ref="userLastName" type="text" placeholder="Nom *" />
                                <Input ref="userEmail" type="email" placeholder="Email *" />
                                <Input ref="userPhoneNumber" type="text" placeholder="Numéro de téléphone *" />
                                <Input ref="userComment" type="text" placeholder="Une précision à ajouter ? Une demande particulière ?" />
                            </form>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <hr />
                    <label className='col-xs-12' for="cgu">
                        <input type="checkbox" name='cgu'/>
                        <span></span>
                        Je reconnais avoir prix connaissance des <a href="#">conditions générales d'{/* ' */}utilisation</a> de hairfie.
                    </label>
                    <a href="#" onClick={this.submit} className="btn btn-red">Terminer la réservation</a>
                </div>
            </div>
        );
    },
    handleGenderChanged: function (e) {
        this.setState({
            userGender: e.currentTarget.value
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
            discount    : this.props.discount
        };
    },
    submit: function (e) {
        e.preventDefault();
        this.props.onSubmit();
    }
});