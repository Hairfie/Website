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

function setHasClosedPopup(context) {
    context.setCookie("HAS_CLOSED_POPUP", true);
}

function getClosedPopup(context) {
    context.getCookie("HAS_CLOSED_POPUP");
}

module.exports = {
    setToken: setToken,
    clearToken: clearToken,
    getToken: getToken,
    setHasClosedPopup: setHasClosedPopup,
    getClosedPopup: getClosedPopup
};