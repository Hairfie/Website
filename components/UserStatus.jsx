'use strict';

var React = require('react');
var debug = require('debug')('Component:UserStatus');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var NavLink = require('flux-router-component').NavLink;
var AuthStore = require('../stores/AuthStore');
var AuthActions = require('../actions/Auth');
var UserManagedBusinessStore = require('../stores/UserManagedBusinessStore');
var FacebookActions = require('../actions/Facebook');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var UserProfilePicture = require('./Partial/UserProfilePicture.jsx');
var facebookConfig = require('../configs/facebook');
var Facebook = require('../services/facebook');

var PasswordLostModal = React.createClass({
    mixins: [FluxibleMixin],
    render: function () {
        return (
            <Modal {...this.props} title="Réinitialiser votre mot de passe">
                <div className="modal-body">
                    <p>Entrez l'{/*'*/}adresse e-mail associée à votre compte, et nous vous enverrons par e-mail un lien pour réinitialiser votre mot de passe.</p>
                    <Input ref="email" type="email"  placeholder="Email" />
                </div>
                <div className="modal-footer">
                    <Button className="btn-primary" type="submit" onClick={this.submit}>
                        Envoyer le lien de réinitialisation
                    </Button>
                </div>
            </Modal>
        );
    },
    submit: function () {
        var email = this.refs.email.getValue();

        if (!email) return;

        this.executeAction(AuthActions.ReportLostPassword, {
            email: this.refs.email.getValue()
        });
        this.props.onRequestHide();
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [AuthStore, UserManagedBusinessStore]
    },
    componentWillMount: function () {
        // we need to be sure Facebook is loaded (@see logInWithFacebook)
        Facebook.load();
    },
    getStateFromStores: function () {
        var user = this.getStore(AuthStore).getUser();
        return {
            user                : user,
            managedBusinesses   : user && this.getStore(UserManagedBusinessStore).getManagedBusinessesByUser(user),
            loading             : this.getStore(AuthStore).isLoginInProgress()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        if (this.state.loading) return this.renderLoading();
        if (this.state.user) return this.renderLoggedIn();
        return this.renderNotLoggedIn();
    },
    renderLoading: function () {
        return (
            <li>
                <a className="dropdown-toggle" href="#">Connexion en cours...</a>
            </li>
        );
    },
    renderLoggedIn: function () {
        var context = this.props.context;
        var pictureSrc = this.state.user.picture ? this.state.user.picture.url : '/img/profile-picture/default-'+('MALE' == this.state.user.gender ? 'man' : 'woman')+'.png';

        var managedBusinesses = (this.state.managedBusinesses || []).map(function (business) {
            return (
                <li key={business.id}>
                    <NavLink context={context} routeName="pro_business" navParams={{businessId: business.id}}>
                        {business.name}
                    </NavLink>
                </li>
            );
        });

        return (
            <li className="dropdown">
                <a href="#" className="dropdown-toggle profile-image" data-toggle="dropdown">
                <UserProfilePicture user={this.state.user} width={100} height={100} className="img-circle profile" /> {this.state.user.firstName} {this.state.user.lastName} { this.props.currentBusiness ?  ' @ ' + this.props.currentBusiness.name : ''}<b className="caret"></b></a>
                <ul className="dropdown-menu account">
                    <li><a href="#" onClick={this.logOut}><i className="fa fa-sign-out"></i> Se déconnecter</a></li>
                    <li className="divider"></li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_new">
                            + déclarer une nouvelle activité
                        </NavLink>
                    </li>
                    <li className="divider"></li>
                    <li><NavLink context={this.props.context} routeName="pro_dashboard"><i className="fa fa-cog"></i> Tableau de bord</NavLink></li>
                    <li className="divider"></li>
                    {managedBusinesses}
                </ul>
            </li>
        );
    },
    renderNotLoggedIn: function () {
        return (
            <li className="dropdown" id="menuLogin">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown" id="navLogin">
                    Connexion<b className="caret"></b>
                </a>
                <ul className="dropdown-menu login">
                    <form className="form" id="formLogin">
                        <Input ref="email" type="email"  placeholder="Email" />
                        <Input ref="password" type="password" placeholder="Mot de passe" onSubmit={this.logIn} />
                        <Button className="btn-block" bsStyle="primary" type="submit" onClick={this.logIn}>
                            Se connecter
                        </Button>
                        <ModalTrigger modal={<PasswordLostModal context={this.props.context} />}>
                            <Button className="btn-block" bsStyle="link">Mot de passe oublié ?</Button>
                        </ModalTrigger>
                        <hr />
                        <Button className="btn-block btn-social btn-facebook" onClick={this.logInWithFacebook}>
                            <i className="fa fa-facebook" />
                            Se connecter via Facebook
                        </Button>
                    </form>
                </ul>
            </li>
        );
    },
    logOut: function () {
        this.executeAction(AuthActions.Logout);
    },
    logIn: function (e) {
        e.preventDefault();
        this.executeAction(AuthActions.Login, {
            email       : this.refs.email.getValue(),
            password    : this.refs.password.getValue(),
            successUrl  : this.props.loginSuccessUrl
        });
    },
    logInWithFacebook: function (e) {
        e.preventDefault();

        if (typeof window.FB == "undefined") {
            debug('Facebook not loaded');
            return;
        }

        // NOTE: we are breaking the flux architecture here, this si necessary
        //       to make the Facebook's login popup work on some browsers
        window.FB.login(function (response) {
            this.executeAction(FacebookActions.HandleLoginResponse, {
                response    : response,
                successUrl  : this.props.loginSuccessUrl
            });
        }.bind(this), {scope: facebookConfig.SCOPE});
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
