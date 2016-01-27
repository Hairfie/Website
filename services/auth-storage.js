'use strict';
var _ = require('lodash');
var cookie = require('fluxible-plugin-cookie');
var moment = require('moment');
moment.locale('fr');

function setToken(context, token) {
    context.setCookie("AUTH_TOKEN", JSON.stringify(token), {expires: moment().add(1, 'y').toDate(), path: '/'});
}

function clearToken(context) {
    context.setCookie("AUTH_TOKEN", false, {path: '/'});
}

function getToken(context) {
    return JSON.parse(context.getCookie("AUTH_TOKEN"));
}

function setHasClosedPopup(context) {
    context.setCookie("_has_closed_popup", true, {expires: moment().add(2, 'w').toDate(), path: '/'}); 
}

function getClosedPopup(context) {
    return context.getCookie("_has_closed_popup") || false;
}

function setHasClosedBanner(context) {
    context.setCookie("HAS_CLOSED_BANNER", true, {expires: moment().add(2, 'w').toDate(), path: '/'});
}

function getClosedBanner(context) {
    return context.getCookie("HAS_CLOSED_BANNER") || false;
}

module.exports = {
    setToken: setToken,
    clearToken: clearToken,
    getToken: getToken,
    setHasClosedPopup: setHasClosedPopup,
    getClosedPopup: getClosedPopup,
    setHasClosedBanner: setHasClosedBanner,
    getClosedBanner: getClosedBanner
};