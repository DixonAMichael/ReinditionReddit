
const express = require('express')
const methodOverride = require('method-override');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const navLinks = require('./navLinks');
require('dotenv').config();

// CONTROLLER IMPORTS
const controllers = require('./controllers');



const app = express()
const PORT = process.env.PORT

// MIDDLEWARE
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'));
app.use(
    session({
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
        secret: "super secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        },
    })
    );
    
    
    // MIDDLEWARE - code that runs for every request (before routes)
    app.use('/posts', controllers.posts)
    app.use('/users', controllers.users)
    /* SECTION Middleware */
    app.use(navLinks)
    app.use(function (req, res, next) {
        res.locals.user = req.session.currentUser;
        next();
      });
    
    
//  home route
app.get('/', (req, res) => {
    res.redirect(`/posts`)
})

// 404 Wildcard Route
app.route('/*').all((req,res)=>{
    res.render('404')
})

// SERVER
app.listen(PORT, () => console.log('starting server at port:', PORT))
