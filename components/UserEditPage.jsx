'use strict';

var React = require('react');
var _ = require('lodash');
var connectToStores = require('../lib/connectToStores');
var PublicLayout = require('./PublicLayout.jsx');
var Link = require('./Link.jsx');
var ImageField = require('./Partial/ImageField.jsx');
var Input = require('react-bootstrap/Input');

var UserEditPage = React.createClass({
    render: function () {
        return(
            <PublicLayout>
                <div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                    <h2>Edition du profil</h2>
                    <form className="form">
                        <Input className="radio">
                          <label className="radio-inline">
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.MALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.MALE} />
                            Homme
                          </label>
                          <label className="radio-inline" style={{marginLeft: '0px'}}>
                            <input type="radio" name="gender" checked={this.state.userGender === UserConstants.Genders.FEMALE} onChange={this.handleGenderChanged} value={UserConstants.Genders.FEMALE} />
                            Femme
                            </label>
                        </Input>
                            <Input type="text" ref="firstName" placeholder="Prénom *"/>
                            <Input type="text" ref="lastName" placeholder="Nom *"/>
                            <Input type="email" ref="email" placeholder="Adresse Email *"/>
                                <Input type="password" ref="password" placeholder="Mot de Passe *" />
                            <Input type="text" ref="phoneNumber" placeholder="Numéro de portable (facultatif)" />
                        <div className="form-group">
                          <ImageField ref="picture" container="users" text="(facultatif)"/>
                        </div>
                    </form>
                </div>
            </PublicLayout>
        );
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