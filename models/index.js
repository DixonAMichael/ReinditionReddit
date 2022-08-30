const User = require("./User");

require("../config/db.connections");

module.exports = {
    Posts: require('./Post'),
    User: require('./User'),
    User_post: require('./User_posts')
}