'use strict';

var define = require('../lib/constants/define');

module.exports = {
    Events: define('FACEBOOK', [
        'RECEIVE_LOGIN_STATUS',
        'RECEIVE_PERMISSIONS',
        'RECEIVE_MANAGED_PAGES'
    ]),
    LoginStatus: {
        'CONNECTED'     : 'connected',
        'NOT_AUTHORIZED': 'not_authorized',
        'UNKNOWN'       : 'unknown'
    },
    Permissions: {
        'MANAGE_PAGES'      : 'manage_pages',
        'PUBLISH_ACTIONS'   : 'publish_actions'
    },
    PermissionStatus: {
        'GRANTED'   : 'granted',
        'DECLINED'  : 'declined'
    },
    PagePerms: define([
        'CREATE_CONTENT'
    ])
};
