'use strict';

var React = require('react');
var Picture = require('./Picture.jsx');
var UserGenders = require('../../constants/UserConstants').Genders;

var SRC_DEFAULT_MAN = '/img/profile-picture/default-man.svg';
var SRC_DEFAULT_WOMAN = '/img/profile-picture/default-woman.svg';

module.exports = React.createClass({
    render: function () {
        var gender    = this.props.gender || {},
            picture = this.props.picture,
            svg = false;

        if (!picture) {
            svg = true;
            switch (gender) {
                case 'MALE':
                    picture = {url: SRC_DEFAULT_MAN};
                    break;

                default:
                    picture = {url: SRC_DEFAULT_WOMAN};
            }
        }

        return <Picture {...this.props} picture={picture} svg={svg} />
    }
});
