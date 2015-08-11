'use strict';

var React = require('react');
var connectToStores = require('../../lib/connectToStores');
var UserProfilePicture = require('../Partial/UserProfilePicture.jsx');
var AuthActions = require('../../actions/AuthActions');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

var User = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function() {
        if (this.props.currentUser)
            return this.isConnected();
        if (this.props.mobile == true)
            return this.renderMobile();
        return (
                <li>
                    <Link route="registration_page">Inscription</Link>
                    <span> / </span>
                    <Link route="connect_page">Connexion</Link>
                </li>
                );
    },
    renderMobile: function() {
        return (
            <li className="user">
                <div className="dropdown">
                    <a id="dLabel" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
                        <Picture picture={{url: '/img/profile-picture/icon-user.png'}} />
                        <span className="caret" />
                    </a>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                        <li>
                            <Link route="registration_page">Inscription</Link>
                        </li>
                        <li>
                            <Link route="connect_page">Connexion</Link>
                        </li>
                    </ul>
                </div>
            </li>
        );
    },
    isConnected: function() {
        var options={
            width: 340,
            height: 340,
            crop: 'thumb',
            gravity: 'faces'
        };
        var firstname = (!this.props.mobile ? this.props.currentUser.firstName : '');
        return (
            <li className="user">
                <div className="dropdown">
                    <a id="dLabel" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
                        <UserProfilePicture picture={this.props.currentUser.picture} options={options} gender={this.props.currentUser.gender}/>
                        {firstname}
                        <span className="caret" />
                    </a>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel">
                        <li>
                            <Link route="user_hairfies" params={{userId: this.props.currentUser.id}}>Mon profil</Link>
                        </li>
                        <li>
                            <a role="button" onClick={this.disconnect}>Déconnexion</a>
                        </li>
                    </ul>
                </div>
            </li>
        );
    },
    disconnect: function() {
        this.context.executeAction(AuthActions.disconnect, this.props.token);
    }
});

User = connectToStores(User, [
    'AuthStore',
    'UserStore'
], function (stores, props) {
    var token = stores.AuthStore.getToken();
    return {
        token: token,
        currentUser: stores.UserStore.getById(token.userId)
    };
});

module.exports = User;