'use strict';

var _ = require('lodash');
var moment = require('moment');
moment.locale('fr');

module.exports = {
  parseTimetable: parseTimetable,
  parseTimeslots: parseTimeslots
};

function parseTimetable(t) { //RESOLVE INTERVAL CONFLICT
  var i, i2;
  for (i = 0; i < t.length; i++) {
    for (i2 = 0; i2 < t.length; i2++) {
      if (i != i2 && ((t[i].startTime <= t[i2].startTime && t[i2].startTime <= t[i].endTime) || (t[i].startTime <= t[i2].endTime && t[i2].endTime <= t[i].endTime))) {
        if (t[i2].startTime <= t[i].startTime && t[i].startTime <= t[i2].endTime) {
          t[i].startTime = t[i2].startTime;
        }
        if (t[i2].startTime <= t[i].endTime && t[i].endTime <= t[i2].endTime) {
          t[i].endTime = t[i2].endTime;
        }
        t.splice(i2, 1);
        if (i2 > 0) i2--;
      }
    }
  }

  return t;
}

function parseTimeslots(t) {
  var i, i2;
  for (i = 0; i < t.length; i++) {
    for (i2 = i + 1; i2 < t.length; i2++) {
      if (t[i].startTime == t[i2].startTime && t[i].endTime == t[i2].endTime) {
        if (t[i2].discount != null && !(t[i].discount) || (parseFloat(t[i2].discount) > parseFloat(t[i].discount))) {
          t[i].discount = t[i2].discount;
        }
        t.splice(i2, 1);
        i2--;
      }
    }
  }

  return _.sortBy(t, function(timeslot) {
    return moment(timeslot.startTime, 'hh:mm');
  });
}