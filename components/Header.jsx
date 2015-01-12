/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('./UserStatus.jsx');

module.exports = React.createClass({
    render: function () {
        var custom;
        if (this.props.withLogin) {
            custom = (<UserStatus context={this.props.context} />);
        } else {
            custom = (<li><NavLink context={this.props.context} href="/pro">Vous êtes coiffeur ?</NavLink></li>);
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
                            <li><NavLink context={this.props.context} routeName="search">Trouver son coiffeur</NavLink></li>
                            { custom }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});