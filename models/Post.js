const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Must enter a title."]
        },
        community: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        image: {type: String},
        username: {type: String},
        // comments: [{type: String}]
        // todo
        name: String,
        desc: String,
        img:
        {
        data: Buffer,
        contentType: String
        }
    },
    { timestamps: true },
    
);

const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts;