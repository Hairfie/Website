var moment = require('moment');

module.exports = {
    moment: function(input, lang) {
        return  moment(new Date(input)).locale(lang).fromNow();
    },
    day: function(input, lang) {
        moment.locale(lang);
        var dayInt;
        switch(input){
            case 'MON':
                dayInt = 1;
                break;
            case 'TUE':
                dayInt = 2;
                break;
            case 'WED':
                dayInt = 3;
                break;
            case 'THU':
                dayInt = 4;
                break;
            case 'FRI':
                dayInt = 5;
                break;
            case 'SAT':
                dayInt = 6;
                break;
            case 'SUN':
                dayInt = 0;
                break;
        }

        return moment.weekdays(dayInt).substring(0,3);
    }
}