'use strict';

var env = process.env.NODE_ENV || 'development';
var _ = require('lodash');

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
    console.log("config", config);
    console.log("env", env);
    return _.transform(config.defaults, function (result, value, key) {
        // try override with environment variable

        // try apply environment specific value
        var environmentSpecific = (config[env] || {})[key];
        console.log("environmentSpecific", environmentSpecific);

        if (undefined !== environmentSpecific) {
            result[key] = environmentSpecific;
            return;
        }

        var environmentVariable = valueFromEnvironmentVariable(config.namespace, key);
        console.log("environmentVariable", environmentVariable);
        if (undefined !== environmentVariable) {
            result[key] = environmentVariable;
            return;
        }
        result[key] = value;
        console.log("key = " + key + " / Value = " + value );
    });
}

function valueFromEnvironmentVariable(namespace, key) {
    var envKey = key;
    if (namespace) {
        envKey = namespace + '_' + envKey;
    }
    return process.env[envKey];
}
