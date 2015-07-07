'use strict';
var _ = require('lodash');
var setCookie = require('set-cookie');

var CookieNames = { AUTH_TOKEN: 'authToken' };

function setToken(token) {
    setCookie(CookieNames.AUTH_TOKEN.id, JSON.stringify(token));
}

function clearToken(token) {
    setCookie(CookieNames.AUTH_TOKEN, null);
}

function getToken(req) {
    var cookieValue = req.cookies[CookieNames.AUTH_TOKEN];

    return cookieValue ? JSON.parse(cookieValue) : undefined;
}

/*
function getCookie(name) {
    if(document.cookie.length == 0)
        return null;

    var regSepCookie = new RegExp('(; )', 'g');
    var cookies = document.cookie.split(regSepCookie);

    for(var i = 0; i < cookies.length; i++) {
    var regInfo = new RegExp('=', 'g');
    var infos = cookies[i].split(regInfo);
    if(infos[0] == name)
        return unescape(infos[1]);
    }
    return null;
}
*/

module.exports = {
    setToken: setToken,
    clearToken: clearToken,
    getToken: getToken
};