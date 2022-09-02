const express = require('express');
const session = require('express-session');
const { Posts } = require('../models');
const router = express.Router();
// todo
const fs = require('fs')
const path = require('path')
const multer = require('multer')

// todo
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
// todo
let upload = multer({ storage: storage });



// MIDDLEWARE
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// MODEL IMPORT
const db = require('../models');
const { debugPort } = require('process');


// INDEX / GET - localhost:4000/posts
router.get('/', async (req, res) => {
    try {
        const posts = await db.Posts.find();
        let context = { posts: posts };
        if (req.session) {
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
        if (req.session.currentUser) {

            const session = req.session;
            context = { session: session }
            res.render('new.ejs', context)
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
    }
});

// CREATE / POST - localhost:4000/posts/create
router.post('/', async (req, res, next) => {
    const createdPost = req.body;
    const newPost = await db.Posts.create(createdPost);
    try {
        res.redirect('/posts');
    } catch (err) {
        console.log(err);
        next();
    }
});

// todo
router.get("/", function (req, res) {

    // Sending index.html file as response to the client
    res.sendFile(__dirname + "/new.ejs");
});

// SHOW / GET - localhost:4000/posts/_id
router.get('/:id', async (req, res) => {
    try {
        let postID = req.params.id;
        const foundPost = await db.Posts.findById(req.params.id)
        const postInfo = await db.Posts.find({ post: foundPost._id })
        const postComment = await db.Comment.find({ postID })
        // console.log(postComment)
        let context = { posts: foundPost, id: foundPost._id, comment: postComment }

        if (req.session) {
            const session = req.session;
            context = { posts: foundPost, id: foundPost._id, comment: postComment, session: session }
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
        if (req.session.currentUser) {
            const session = req.session;
            context = { post: editPost, id: editPost._id, session: session }
            res.render('edit.ejs', context)
        } else {
            res.redirect('/login')
        }

    } catch (err) {
        console.log(err);
    }
});

// COMMENTS ROUTE
router.put('/:id/comments', async (req, res, next) => {
    try {
        let post = await db.Comment.create(req.body);
        res.redirect(`/posts/${req.params.id}`)
    } catch (err) {
        console.log(err)
        next()
    }
});

// UPDATE / PUT- localhost:4000/posts/<_id>
// update route
router.put("/:id", async (req, res, next) => {

    try {
        const updatedPost = req.body;
        await db.Posts.findByIdAndUpdate(req.params.id, updatedPost, { new: true });
        res.redirect(`/posts/${req.params.id}`);
    } catch (err) {
        console.log(err)
        next()
    }
});


// todo 
router.post('/', (req, res, next) => {
    let obj = upload + {
        img: {
            data: fs.readFileSync(path.join(__dirname + '/posts/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    
    db.Posts.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
            res.redirect('/posts');
        }
    });
});

module.exports = router;