'use strict';

var T = require('react').PropTypes;

module.exports = {
    makePath            : T.func,
    makeUrl             : T.func,
    navigateTo          : T.func,
    getGoogleMapsScript : T.func,
    getAssetUrl         : T.func,
    config              : T.object
};
