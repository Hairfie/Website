'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var connectToStores = require('../../lib/connectToStores');
var AuthActions = require('../../actions/AuthActions');
var _ = require('lodash');
var Picture = require('../Partial/Picture.jsx');

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
        if (!this.props.currentUser)
            return (
                <li>
                    <Link route="registration_page">Inscription</Link>
                    <span> / </span>
                    <Link route="connect_page">Connexion</Link>
                </li>
                );
        return (
            <li className="user">
                <div className="dropdown">
                    <Picture picture={this.props.currentUser.picture} />
                    <a href="#" id="dLabel" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">{this.props.currentUser.firstName}
                        <span className="caret" />
                    </a>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                        <li>
                        <a href="#" onClick={this.disconnect}>Déconnection</a>
                      </li>
                    </ul>
                </div>
            </li>
                );

    },
    disconnect: function() {
        this.context.executeAction(AuthActions.disconnect);
    }
});

Header = connectToStores(Header, [
    'AuthStore',
    'UserStore'
], function (stores, props) {
    var token = stores.AuthStore.getToken();
    return {
        currentUser: stores.UserStore.getUserInfo(token.userId)
    };
});

module.exports = Header;