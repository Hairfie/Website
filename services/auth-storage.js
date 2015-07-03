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

    return cookieValue ? JSON.parse(cookieValue) : undefined;
}

function getCookie()
{
	//if (document.cookie)
		console.log("steak");
}

module.exports = {
    setToken: setToken,
    clearToken: clearToken,
    getToken: getToken
};