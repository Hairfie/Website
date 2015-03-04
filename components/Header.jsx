/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('./UserStatus.jsx');

var MenuItem = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: ['RouteStore']
    },
    getStateFromStores: function () {
        var route = this.getStore('RouteStore').getCurrentRoute();

        return {
            current: this.props.routeName == route.name || this.props.href == route.path
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        var className;
        if (this.state.current) className = 'active';

        return (
            <li className={className}>
                <NavLink {...this.props} />
            </li>
        );
    },
    onChange: function () {
        if (this.isMounted()) {
            this.setState(this.getStateFromStores());
        }
    }
});

module.exports = React.createClass({
    render: function () {
        var custom;
        if (this.props.withLogin) {
            custom = (<UserStatus context={this.props.context} />);
        } else {
            custom = (<MenuItem context={this.props.context} routeName="pro_home">Vous êtes coiffeur ?</MenuItem>);
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
                        <NavLink context={this.props.context} className="navbar-brand" routeName="home"><img id="logo" src="/img/logo@2x.png" alt="Hairfie"/></NavLink>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav top-nav navbar-right">
                            <MenuItem context={this.props.context} routeName="home">Home</MenuItem>
                            <MenuItem context={this.props.context} routeName="search">Trouver son coiffeur</MenuItem>
                            <li><a href="http://blog.hairfie.com" target="_blank">Blog</a></li>
                            { custom }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});
