
const express = require('express');
const methodOverride = require('method-override');
const session = require("express-session");
const MongoStore = require("connect-mongo");
require('dotenv').config();

// CONTROLLER IMPORTS
const controllers = require('./controllers')

const app = express();
const PORT = process.env.PORT
app.set('view engine', 'ejs');

// MIDDLEWARE
app.use(express.static('public'));
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
app.use('/posts', controllers.posts);
app.use('/', controllers.users);


//  home route
app.get('/', (req, res) => {
    res.redirect(`/posts`)
});

// 404 Wildcard Route
app.route('/*').all((req, res) => {
    if(req.session){
        console.log(req.session)
        const session = req.session;
        context = { session: session}
    }
    res.render('404',context)
});

// SERVER
app.listen(PORT, () => console.log('starting server at port:', PORT));
