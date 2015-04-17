'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var NavLink = require('flux-router-component').NavLink;
var UserStatus = require('../UserStatus.jsx');

module.exports = React.createClass({
    render: function () {
        var custom;
        if (this.props.withLogin) {
            custom = (<UserStatus loginSuccessUrl={this.props.loginSuccessUrl} />);
        } else {
            custom = (<li><NavLink routeName="pro_home" className="">Vous êtes coiffeur ?</NavLink></li>);
        }
        var headerClassName = this.props.headerClassName ? this.props.headerClassName : 'white';
        headerClassName += ' hidden-xs';

        return (
            <header className={headerClassName}>
                <div className="row">
                    <div className="col-md-12">
                        <NavLink className="logo col-md-4" routeName="home" />
                        <nav className='col-md-8 pull-right'>
                            <ul>
                                {custom}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
});
