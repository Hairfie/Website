/** @jsx React.DOM */

var React = require('react');

var signupAction = require('../actions/signup');

var NavLink = require('flux-router-component').NavLink;
var ProLayout = require('./ProLayout.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <ProLayout context={this.props.context}>
                <h2>Claim your business</h2>
                <NavLink context={this.props.context} routeName="show_business" navParams={{id: '542a6546c06f16d14a546980'}}>Plop</NavLink>
                <div>
                    <label>
                        Gender:
                        <select ref="gender">
                            <option value="MALE">M</option>
                            <option value="FEMALE">Mme</option>
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
            </ProLayout>
        );
    },
    submit: function (e) {
        e.preventDefault();
        this.props.context.executeAction(signupAction, {
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
