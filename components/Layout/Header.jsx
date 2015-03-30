/** @jsx React.DOM */

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('../UserStatus.jsx');

var MenuItem = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: ['RouteStore']
    },
    getStateFromStores: function () {
        var route = this.getStore('RouteStore').getCurrentRoute();


        return {
            current: route && (this.props.routeName == route.name || this.props.href == route.path)
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
            custom = (<li><NavLink context={this.props.context} routeName="pro_home" className="">Gérez votre salon</NavLink></li>);
        }
        var headerClassName = this.props.headerClassName ? this.props.headerClassName : 'white';
        headerClassName += ' hidden-xs';

        return (
            <header className={headerClassName}>
                <div className="row">
                    <div className="col-md-12">
                        <NavLink context={this.props.context} className="logo col-md-4" routeName="home" />
                        <nav className='col-md-8 pull-right'>
                            <ul>
                                {/*<li><a href="#">Inscription</a></li>
                                <li><a href="#">Connexion</a></li> */}
                                {custom}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
});
