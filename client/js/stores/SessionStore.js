var Reflux = require('reflux');

var user = null;

function getUser() {
    return user;
}

module.exports = Reflux.createStore({
    getUser: getUser
});
