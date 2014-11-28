/** @jsx React.DOM */

var React = require('react');

var AuthActions = require('../actions/Auth');
var UserConstants = require('../constants/UserConstants');

var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <PublicLayout context={this.props.context} withLogin={true}>
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
