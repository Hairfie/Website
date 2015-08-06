'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var PublicLayout = require('./PublicLayout.jsx');
var Link = require('./Link.jsx');
var ImageField = require('./Partial/ImageField.jsx');
var Input = require('react-bootstrap/Input');
var UserConstants = require('../constants/UserConstants');
var UserActions = require('../actions/UserActions');

var UserEditPage = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func
    },
    getInitialState: function() {
    return {userGender: this.props.user.gender || ""};
    },
    render: function () {
        return(
            <PublicLayout>
                <div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                    <h2>Edition du profil</h2>
                    <form className="form">
                        <Input className="radio">
                          <label className="radio-inline">
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE}  />
                            Homme
                          </label>
                          <label className="radio-inline" style={{marginLeft: '0px'}}>
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                            Femme
                            </label>
                        </Input>
                            <Input type="text" ref="firstName" placeholder="Prénom *" defaultValue={this.props.user.firstName || ""} />
                            <Input type="text" ref="lastName" placeholder="Nom *" defaultValue={this.props.user.lastName || ""}/>
                            <Input type="email" ref="email" placeholder="Adresse Email *" defaultValue={this.props.user.email || ""}/>
                                <Input type="password" ref="password" placeholder="Mot de Passe *" />
                            <Input type="text" ref="phoneNumber" placeholder="Numéro de portable (facultatif)" defaultValue={this.props.user.phoneNumber || ""} />
                        <div className="form-group">
                          <ImageField ref="picture" defaultPicture={this.props.user.picture} container="users" text="(facultatif)"/>
                        </div>
                        <a role="button" onClick={this.submit} className="btn btn-red full">Valider</a>
                    </form>
                </div>
            </PublicLayout>
        );
    },
    handleGenderChanged: function (e) {
        this.setState({
            userGender: e.currentTarget.value
        });
    },
    submit: function(e) {
        e.preventDefault();

        var userInfo = {
            email: this.refs.email.getValue(),
            firstName: this.refs.firstName.getValue(),
            lastName: this.refs.lastName.getValue(),
            password: this.refs.password.getValue(),
            gender: this.state.userGender,
            phoneNumber: this.refs.phoneNumber.getValue(),
            picture: this.refs.picture.getImage()
        };
        if (!userInfo.password)
            delete userInfo.password;
        this.context.executeAction(UserActions.editUser, userInfo);
    }
});

UserEditPage = connectToStores(UserEditPage, [
    'AuthStore',
    'UserStore'
], function (stores, props) {
    var token = stores.AuthStore.getToken();
    return {
        user: stores.UserStore.getById(token.userId)
    };
});

module.exports = UserEditPage;