const express = require('express');
const session = require('express-session');
const { Posts } = require('../models');
const router = express.Router();

// MIDDLEWARE
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// MODEL IMPORT
const db = require('../models');

// INDEX / GET - localhost:4000/posts
router.get('/', async (req, res) => {
    try {
        const posts = await db.Posts.find();
        let context = { posts: posts };
        if (req.session) {
            console.log(req.session);
            const session = req.session;
            context = { posts: posts, session: session }
        }
        res.render('index.ejs', context);
    } catch (err) {
        console.log(err);
    }
});
// NEW / GET- localhost:4000/posts/new
router.get('/new', (req, res) => {
    try {

        if(req.session){
            console.log(req.session)
            const session = req.session;
            context = { session: session}
        }
        res.render('new.ejs', context)
    } catch (err) {
        console.log(err);
    }
});

// CREATE / POST - localhost:4000/posts/create
router.post('/', async (req, res, next) => {
    const createdPost = req.body;
    try {
        const newPost = await db.Posts.create(createdPost);
        console.log(newPost);
        res.redirect('/posts');
    } catch (err) {
        console.log(err);
        next();
    }
});

// SHOW / GET - localhost:4000/posts/_id
router.get('/:id', async (req, res) => {
    try {

        const foundPost = await db.Posts.findById(req.params.id)
        const postInfo = await db.Posts.find({ post: foundPost._id })
        let context = { posts: foundPost, id: foundPost._id}
        if(req.session){
            console.log(req.session)
            const session = req.session;
            context = { posts: foundPost, id: foundPost._id, session: session}
        }
        res.render('show.ejs', context)

    } catch (err) {
        console.log(err);
    }
});
// DESTROY / DELETE  - localhost:4000/posts/<_id>
router.delete('/:id', async (req, res) => {
    try {
        const deletePost = await db.Posts.findByIdAndDelete(req.params.id);
        return res.redirect('/posts');
    } catch (error) {
        req.error = error;
        console.log(error);
        res.redirect('/404');
    }
});
// EDIT / GET - localhost:4000/posts/<_id>/edit
router.get('/:id/edit', async (req, res) => {
    try {

        const editPost = await db.Posts.findById(req.params.id)
        let context = { post: editPost, id: editPost._id }
        if(req.session){
            console.log(req.session)
            const session = req.session;
            context = { post: editPost, id: editPost._id, session: session}
        }
        res.render('edit.ejs', context)


    } catch (err) {
        console.log(err);
    }
});


// UPDATE / PUT- localhost:4000/posts/<_id>
// update route
router.put("/:id", async (req, res, next) => {
    console.log("we made it");
    try {
        const updatedPost = req.body;
        await db.Posts.findByIdAndUpdate(req.params.id, updatedPost, { new: true });

        res.redirect(`/posts/${req.params.id}`);
    } catch (err) {
        console.log(err)
        next()
    }
});

module.exports = router;