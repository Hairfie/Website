'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var connectToStores = require('../../lib/connectToStores');
var AuthActions = require('../../actions/AuthActions');
var _ = require('lodash');

var Header = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    render: function () {
        var headerClassName = this.props.headerClassName ? this.props.headerClassName : 'white';
        headerClassName += ' hidden-xs';
        var proLinkNode;
        var withProLink = _.isBoolean(this.props.withProLink) ? this.props.withProLink : true;
        
        if(withProLink) {
            proLinkNode = (<li><Link route="home_pro">Vous êtes coiffeur ?</Link></li>);
        }

        return (
            <header className={headerClassName}>
                <div className="row">
                    <div className="col-md-12">
                        <Link className="logo col-md-4" route="home" />
                        <nav className='col-md-8 pull-right'>
                            <ul>
                                {this.loginLogout()}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        );
    },
    loginLogout: function() {
        if (!this.props.token.id)
            return (
                <li>
                    <Link route="registration_page">Inscription</Link>
                    <span> / </span>
                    <Link route="connect_page">Connexion</Link>
                </li>
                );
        return (
            <li>
                <Link href="#" onClick={this.disconnect}>Déconnexion</Link>
            </li>
                );

    },
    disconnect: function() {
        this.context.executeAction(AuthActions.disconnect);
    }
});

Header = connectToStores(Header, [
    'AuthStore'
], function (stores, props) {
    return {
        token: stores.AuthStore.getToken()
    };
});

module.exports = Header;