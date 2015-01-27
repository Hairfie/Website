/** @jsx React.DOM */

var React = require('react');
var debug = require('debug')('Component:UserStatus');
var StoreMixin = require('fluxible').StoreMixin;
var NavLink = require('flux-router-component').NavLink;
var AuthStore = require('../stores/AuthStore');
var AuthActions = require('../actions/Auth');
var UserManagedBusinessStore = require('../stores/UserManagedBusinessStore');
var FacebookActions = require('../actions/Facebook');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var UserProfilePicture = require('./Partial/UserProfilePicture.jsx');
var facebookConfig = require('../configs/facebook');
var Facebook = require('../services/facebook');

module.exports = React.createClass({
    mixins: [StoreMixin],
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
                <a className="dropdown-toggle" href="#">Login in progress...</a>
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
                    <li><a href="#" onClick={this.logOut}><i className="fa fa-sign-out"></i> Sign-out</a></li>
                    <li className="divider"></li>
                    <li><NavLink context={this.props.context} routeName="pro_dashboard"><i className="fa fa-cog"></i> Dashboard</NavLink></li>
                    <li className="divider"></li>
                    {managedBusinesses}
                    <li className="divider"></li>
                    <li>
                        <NavLink context={this.props.context} routeName="pro_business_new">
                            + claim a business
                        </NavLink>
                    </li>
                </ul>
            </li>
        );
    },
    renderNotLoggedIn: function () {
        return (
            <li className="dropdown" id="menuLogin">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown" id="navLogin">Login</a>
                <div className="dropdown-menu">
                    <form className="form" id="formLogin">
                        <Input ref="email" type="email"  placeholder="email" />
                        <Input ref="password" type="password" placeholder="Password" onSubmit={this.logIn} />
                        <Button className="btn-block btn-primary" type="submit" onClick={this.logIn}>
                            Login
                        </Button>
                        <hr />
                        <Button className="btn-block btn-social btn-facebook" onClick={this.logInWithFacebook}>
                            <i className="fa fa-facebook" />
                            Login with facebook
                        </Button>
                    </form>
                </div>
            </li>
        );
    },
    logOut: function () {
        this.props.context.executeAction(AuthActions.Logout);
    },
    logIn: function (e) {
        e.preventDefault();
        this.props.context.executeAction(AuthActions.Login, {
            email   : this.refs.email.getValue(),
            password: this.refs.password.getValue()
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
            this.props.context.executeAction(FacebookActions.HandleLoginResponse, {
                response: response
            });
        }.bind(this), {scopes: facebookConfig.SCOPE});
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
