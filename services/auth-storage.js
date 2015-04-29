'use strict';

var setCookie = require('set-cookie');

var CookieNames = { AUTH_TOKEN: 'authToken' };

function setToken(token) {
    setCookie(CookieNames.AUTH_TOKEN, JSON.stringify(token));
}

function clearToken(token) {
    setCookie(CookieNames.AUTH_TOKEN, null);
}

function getToken(req) {
    var cookieValue = req.cookies[CookieNames.AUTH_TOKEN];

    try {
        return cookieValue ? JSON.parse(cookieValue) : undefined;
    } catch (e) {
        return null;
    }
}

module.exports = {
    setToken: setToken,
    clearToken: clearToken,
    getToken: getToken
};
