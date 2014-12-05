/** @jsx React.DOM */

var React = require('react');

var AuthActions = require('../actions/Auth');
var UserConstants = require('../constants/UserConstants');

var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <PublicLayout context={this.props.context} withLogin={true} customClass={'home-pro'}>
                <div className="row first">
                    <div className="col-sm-7 col-md-5 col-md-offset-1 left">
                        <h1>Augmentez votre visibilité et votre chiffre d'affaires</h1>
                        <hr />
                        <p className="list">
                            <ul>
                                <li><span>Gagnez en <strong>visibilité</strong> sur le web et les réseaux sociaux</span></li>
                                <li><span><strong>Différenciez-vous</strong> de vos concurrents</span></li>
                                <li><span>Augmentez votre <strong>chiffre d'affaires</strong></span></li>
                                <li><span>Gagnez du <strong>temps</strong> et concentrez vous sur votre métier</span></li>
                            </ul>
                        </p>

                        <p className="btn-app-store">
                            <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="btn btn-lg">
                                <img id="btn-apple" src="/img/btn-apple@2x.png" />
                            </a>
                        </p>
                    </div>

                    <div className="col-sm-5 col-md-4 col-md-offset-1">
                        <form role="form" className="claim">
                            <h3>Vous êtes un <strong>professionnel</strong> de la coiffure ?</h3>
                            <div className="form-group radio">
                                <label className="radio-inline">
                                  <input type="radio" name="gender" ref="gender" value={UserConstants.Genders.MALE} />
                                  Man
                                </label>
                                <label className="radio-inline">
                                  <input type="radio" name="gender" ref="gender" value={UserConstants.Genders.FEMALE} />
                                  Woman
                                </label>
                            </div>
                           <div className="form-group">
                                <input ref="businessName" type="text" className="form-control" placeholder="Business Name"/>
                            </div>
                            <div className="form-group">
                                <input ref="firstName" type="text" className="form-control" placeholder="First Name"/>
                            </div>
                            <div className="form-group">
                                <input ref="lastName" type="text" className="form-control" placeholder="Last Name"/>
                            </div>
                            <div className="form-group">
                                <input ref="email" type="email" className="form-control" placeholder="Email"/>
                            </div>
                            <div className="form-group">
                                <input ref="password" type="password" className="form-control" placeholder="Choose a password"/>
                            </div>
                            <div className="form-group">
                                <input ref="phoneNumber" type="text" className="form-control" placeholder="Phone Number"/>
                            </div>
                            <button type="button" className="btn btn-red btn-block" onClick={this.submit}>Start now !</button>
                        </form>
                    </div>
                </div>
            </PublicLayout>
        );
    },
    submit: function (e) {
        e.preventDefault();
        this.props.context.executeAction(AuthActions.Signup, {
            gender: this.refs.gender.getDOMNode().value,
            firstName: this.refs.firstName.getDOMNode().value,
            lastName: this.refs.lastName.getDOMNode().value,
            email: this.refs.email.getDOMNode().value,
            password: this.refs.password.getDOMNode().value,
            phoneNumber: this.refs.phoneNumber.getDOMNode().value,
            businessName: this.refs.businessName.getDOMNode().value
        });
    }
});
