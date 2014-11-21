/** @jsx React.DOM */

var React = require('react');

var signupAction = require('../actions/signup');

module.exports = React.createClass({
    render: function () {
        return (
            <div>
                <h2>Claim your business</h2>
                <form>
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
                        <label>Phone number: <input ref="phoneNumber" type="text" /></label>
                    </div>
                    <div>
                        <label>Company: <input ref="companyName" type="text" /></label>
                    </div>
                    <button onClick={this.submit}>Submit</button>
                </form>
            </div>
        );
    },
    submit: function (e) {
        e.preventDefault();
        this.props.context.executeAction(signupAction, {
            gender: this.refs.gender.getDOMNode().value,
            firstName: this.refs.firstName.getDOMNode().value,
            lastName: this.refs.lastName.getDOMNode().value,
            email: this.refs.email.getDOMNode().value,
            phoneNumber: this.refs.phoneNumber.getDOMNode().value,
            companyName: this.refs.companyName.getDOMNode().value
        });
    }
});
