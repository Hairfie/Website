var moment = require('moment');

module.exports = {
    moment: function(input, lang) {
        return  moment(new Date(input)).lang(lang).fromNow();
    }
}