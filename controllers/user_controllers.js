// importing statements
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// MIDDLEWARE
router.use(express.json());

// built in method to recognize incoming request object as strings or arrays
router.use(express.urlencoded({ extended: true }));

// MODEL IMPORT
const { User } = require('../models');
console.log(User);

// GET LOGIN ROUTE 
router.get('/login', (req, res) => {
    if(req.session){
        console.log(req.session)
        const session = req.session;
        context = { session: session}
    }
    res.render('users/login.ejs',context);
});

// GET REGISTER ROUTE
router.get('/register', (req, res) => {
    if(req.session){
        console.log(req.session)
        const session = req.session;
        context = { session: session}
    }
    res.render('users/register.ejs',context);
});

// POST LOGIN ROUTE
router.post('/login', async (req, res, next) => {
    try {
        let formData = req.body;
        // this checks the boolean if the user exists
        let foundUser = await User.findOne({ email: formData.email });
        if (!foundUser) {
            return res.redirect('/register');
        } else {
            const match = await bcrypt.compare(formData.password, foundUser.password);
            if (!match) return res.send(`email or password doesn't match`);
            req.session.currentUser = {
                id: foundUser._id,
                username: foundUser.username,
            }
            return res.redirect('/posts');
        }
    } catch (error) {
        console.log(error);
        next("this is broken");
    }
});




// POST REGISTER
router.post('/register', async (req, res, next) => {

    try {
        let formData = req.body;
        console.log(`created ${formData}`);
        let foundUser = await User.exists({ email: formData.email });
        if (foundUser) {
            return res.redirect('/login');
        } else {
            let rounds = parseInt(process.env.SALT_ROUNDS);
            let salt = await bcrypt.genSalt(rounds);
            let hash = await bcrypt.hash(formData.password, salt);
            formData.password = hash;

            const newUser = await User.create(formData);
            console.log(`create ${newUser}`);
            return res.redirect('/login');
        }


    } catch (error) {
        console.log(error);
        next("this is broken");
    }
});

// GET LOGOUT
router.get("/logout", async function (req, res) {
    try {
        await req.session.destroy();
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});





// EXPORT
module.exports = router;