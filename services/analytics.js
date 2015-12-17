'use strict';

// var config = require('../configs/analytics');
// var newConfig = require('../config');

// console.log("config.GA_TRACKING_CODE", config.GA_TRACKING_CODE);
// console.log("config", newConfig);

// if(typeof window !== 'undefined' && typeof config.GA_TRACKING_CODE !== 'undefined') {
//     (function(window, document, script, url, r, tag, firstScriptTag) {
//         window['GoogleAnalyticsObject']=r;
//         window[r] = window[r] || function() {
//             (window[r].q = window[r].q || []).push(arguments)
//         };
//         window[r].l = 1*new Date();
//         tag = document.createElement(script),
//         firstScriptTag = document.getElementsByTagName(script)[0];
//         tag.async = 1;
//         tag.src = url;
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//     })(
//         window,
//         document,
//         'script',
//         '//www.google-analytics.com/analytics.js',
//         'ga'
//     );

if(typeof window !== 'undefined' && typeof window.ga !== 'undefined') {
    var ga = window.ga;

    // ga('create', config.GA_TRACKING_CODE, 'auto');

    // ga('send', 'pageview');

    module.exports = function() {
        return window.ga.apply(window.ga, arguments);
    };

} else {
    module.exports = function() {console.log(arguments)};
}
