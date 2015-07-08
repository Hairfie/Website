'use strict';
var _ = require('lodash');
var cookie = require('fluxible-plugin-cookie');

function setToken(context, token) {
    context.setCookie("AUTH_TOKEN", JSON.stringify(token));
}

function clearToken(context) {
    context.setCookie("AUTH_TOKEN", null);
}

function getToken(context) {
    return JSON.parse(context.getCookie("AUTH_TOKEN"));
}

module.exports = {
    setToken: setToken,
    clearToken: clearToken,
    getToken: getToken
};