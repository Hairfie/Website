'use strict';

var React = require('react');
var connectToStores = require('fluxible-addons-react/connectToStores');
var UserProfilePicture = require('../Partial/UserProfilePicture.jsx');
var AuthActions = require('../../actions/AuthActions');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

var User = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    render: function() {
        if (this.props.mobile == true) {
            return this.renderMobile();
        }
        else {
            return this.renderDesktop();
        }
    },
    componentDidMount: function() {
        if(this.props.currentUser  && typeof heap !== "undefined") {
            heap.identify({name: this.props.currentUser.firstName + ' ' + this.props.currentUser.lastName,
                email: this.props.currentUser.email});
        }
    },
    renderMobile: function() {
        if (this.props.currentUser) {
            return (
                <a role="button" onClick={this.disconnect}>
                    <li className="users">Me déconnecter</li>
                </a>
            );
        }
        else {
            return (
                <Link route="connect_page">
                    <li className="users"  onClick={this.close}>Me connecter</li>
                </Link>
            );
        }
    },
    renderDesktop: function() {
        if (!this.props.currentUser) {
            return (
                <span>
                    <Link route="connect_page">Connexion</Link>
                    <Link route="registration_page">Inscrivez-vous</Link>
                </span>
            );
        }
        var options={
            width: 340,
            height: 340,
            crop: 'thumb',
            gravity: 'faces'
        };
        var firstname = (!this.props.mobile ? this.props.currentUser.firstName : '');
        var lastName = (!this.props.mobile ? this.props.currentUser.lastName : '');
        return (
            <div className="user">
                <div className="dropdown">
                    <a id="dLabel" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
                        {firstname} {lastName}
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
            </div>
        );
    },
    disconnect: function() {
        this.context.executeAction(AuthActions.disconnect, this.props.token);
    }
});

User = connectToStores(User, [
    'AuthStore',
    'UserStore'
], function (context, props) {
    var token = context.getStore('AuthStore').getToken();
    return {
        token: token,
        currentUser: context.getStore('UserStore').getById(token.userId)
    };
});

module.exports = User;