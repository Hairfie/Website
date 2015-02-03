'use strict';

var Promise = require('q');
var LoginStatus = require('../../constants/FacebookConstants').LoginStatus;
var config = require('../../configs/facebook');
var _ = require('lodash');

module.exports = {
    handleLoginResponse: handleLoginResponse
};

function handleLoginResponse(response) {
    if (LoginStatus.CONNECTED == response.status) {
        return Promise.resolve(response.authResponse.accessToken);
    } else {
        return Promise.reject(new Error('Not granted by user'));
    }
}
