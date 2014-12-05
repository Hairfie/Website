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
                    <div className="col-sm-7 col-md-5 col-md-offset-1">
                        <h1>Augmentez votre visibilité et votre chiffre d'affaires</h1>

                        <p>
                            <ul>
                                <li>Gagnez en <strong>visibilité</strong> sur le web et les réseaux sociaux</li>
                                <li><strong>Différenciez-vous</strong> de vos concurrents</li>
                                <li>Augmentez votre <strong>chiffre d'affaires</strong></li>
                                <li>Gagnez du <strong>temps</strong> et concentrez vous sur votre métier</li>
                            </ul>
                        </p>

                        <p className="btn-app-store">
                            <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="btn btn-lg">
                                <img id="btn-apple" src="/img/btn-apple@2x.png" />
                            </a>
                        </p>
                    </div>

                    <div className="col-sm-5 col-md-5 col-md-offset-1">

                        <h2>Claim your business</h2>
                        <div>
                            <label>
                                Gender:
                                <select ref="gender">
                                    <option value={UserConstants.Genders.MALE}>M</option>
                                    <option value={UserConstants.Genders.FEMALE}>Mme</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>First name: <input ref="firstName" type="text" /></label>
                        </div>
                        <div>
                            <label>Last name: <input ref="lastName" type="text" /></label>
                        </div>
                        <div>
                            <label>Email address: <input ref="email" type="email" /></label>
                        </div>
                        <div>
                            <label>Choose a password: <input ref="password" type="password" /></label>
                        </div>
                        <div>
                            <label>Phone number: <input ref="phoneNumber" type="text" /></label>
                        </div>
                        <div>
                            <label>Company: <input ref="businessName" type="text" /></label>
                        </div>
                        <button onClick={this.submit}>Submit</button>
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
