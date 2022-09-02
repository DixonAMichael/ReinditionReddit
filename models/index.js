const User = require("./User");

require("../config/db.connections");

module.exports = {
    Posts: require('./Post'),
    User: require('./User'),
    Comment: require('./Comment'),
    Image: require('./Images')
};