'use strict';

var env = process.env.REAL_ENV || process.env.NODE_ENV || 'development';
var _ = require('lodash');

console.log("env", env);

module.exports = {
    resolve: resolve
}

/**
 * Resolves a configuration object
 *
 * 1. Take default values
 * 2. Apply environment specific values
 * 3. Apply values from environment variables
 *
 * {
 *      namespace: 'FOO',
 *      defaults: {
 *          CACHE   : true,
 *          TTL     : 3600
 *      },
 *      development: {
 *          CACHE   : false
 *      }
 * }
 *
 * @todo is the third step useful?
 *
 * @params Object config
 *
 * @return Object
 *
 */
function resolve(config) {
    return _.transform(config.defaults, function (result, value, key) {
        // try override with environment variable

        // try apply environment specific value
        var environmentSpecific = (config[env] || {})[key];

        if (undefined !== environmentSpecific) {
            result[key] = environmentSpecific;
            return;
        }

        var environmentVariable = valueFromEnvironmentVariable(config.namespace, key);
        if (undefined !== environmentVariable) {
            result[key] = environmentVariable;
            return;
        }
        result[key] = value;
    });
}

function valueFromEnvironmentVariable(namespace, key) {
    var envKey = key;
    if (namespace) {
        envKey = namespace + '_' + envKey;
    }
    return process.env[envKey];
}
