/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('./UserStatus.jsx');

module.exports = React.createClass({
    render: function () {
        var loginForm;
        if (this.props.withLogin) {
            loginForm = (<UserStatus context={this.props.context} />);
        } else {
            loginForm = null;
        }
        return (
            <nav className="navbar navbar-default navbar-static-top header" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <NavLink context={this.props.context} className="navbar-brand" href="/"><img id="logo" src="/img/logo@2x.png" alt="Hairfie"/></NavLink>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li><NavLink context={this.props.context} href="/">Home</NavLink></li>
                            <li><NavLink context={this.props.context} href="/pro">For Hairdresser Partners</NavLink></li>
                            { loginForm }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});