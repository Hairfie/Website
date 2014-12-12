/** @jsx React.DOM */

'use strict';

var React = require('react');
var Picture = require('./Picture.jsx');
var UserGenders = require('../../constants/UserConstants').Genders;

var SRC_DEFAULT_MAN = '/img/profile-picture/default-man.png';
var SRC_DEFAULT_WOMAN = '/img/profile-picture/default-woman.png';

module.exports = React.createClass({
    render: function () {
        var user    = this.props.user || {},
            picture = user.picture;

        if (!picture) {
            switch (user.gender) {
                case UserGenders.MALE:
                    picture = {url: SRC_DEFAULT_MAN};
                    break;

                default:
                    picture = {url: SRC_DEFAULT_WOMAN};
            }
        }

        return <Picture {...this.props} picture={picture} />
    }
});
