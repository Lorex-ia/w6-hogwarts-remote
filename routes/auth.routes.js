const express = require('express');
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')
const router = require("express").Router();


//signup page
router.get("/signup", isLoggedOut, (req, res) => {
    res.render("auth/signup", { user: undefined });
});


router.post('/signup', isLoggedOut, async (req, res) => {
    const body = {...req.body};

    if (body.password.length < 6) {
        res.render('auth/signup', { errorMessage: 
            "Password must be at least 6 characters long", body: req.body });
    }
    else {
        const salt = await bcrypt.genSalt(13);
        const passwordHash = bcrypt.hashSync(body.password, salt);

        delete body.password;
        body.passwordHash = passwordHash;

        console.log(body);

        try {
            let newUser = await User.create(body);
            req.session.user = newUser;
            res.redirect('/hatquiz');
        }
        catch (error) {
            if (error.code === 11000) {
                console.log('Duplicate');
                res.render('auth/signup', { 
                    errorMessage: "User already exists", 
                    userData: req.body,
                });
            } 
            else {
                res.render('auth/signup', { 
                    errorMessage: "Something went wrong", 
                    userData: req.body,
                });
            }
        
        }
    }

});



router.get('/signup-profile', isLoggedIn, (req, res) => {
    res.render('auth/signup-profile', { user: req.session.user });

    console.log('SESSION =====> ', req.session);

    
})



//Login page
router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login', { user: undefined });
})

router.post('/login', isLoggedOut, async (req, res) => {
    console.log('SESSION =====> ', req.session); /////////////// console log  session

    const body = {...req.body};

    const userMatch = await User.find({username: body.username}); // find -> array
    console.log(userMatch);
    console.log("it s a match")

    if (userMatch.length) {   // find has an element (match)
        // user found
        const currentUser = userMatch[0];

        if (bcrypt.compareSync(body.password, currentUser.passwordHash)) { 
            console.log("correct password");
            
            req.session.user = currentUser; 
            res.redirect('/profile'); 
            
        } else {
            // incorrect password
            console.log("incorrect password");
            res.render('auth/login', { 
                errorMessage: "Incorrect password", 
                userData: req.body,
            });
        }
    } else { 
        // user not found
        console.log("user not found");
        res.render('auth/login', { 
            errorMessage: "User not found", 
            userData: req.body,
        });

    }

});


// Get to display the profile page
router.get("/profile", (req, res, next) => {
    res.render("profile/profile-home", { user: req.session.user, 
    layout: "../views/profile/profile-layout.ejs" });
});

// logout page
router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(err => {
        if (err) next(err)
        res.redirect('/')
    })
});

// //Routes for the Quizz part

// router.get('/hatquizz', (req, res) => {
//     res.render('hatquizz', { user: req.session.user })
// })

//Dianes' code

// router.get('/hatquiz', isLoggedIn, (req, res) => {
//     res.render('hatquiz/hatquizz', { user: req.session.user })
// });


// router.post('/hatquizz', async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.session.user._id, { house: req.body.maxHouse }, { new: true });
//         req.session.user = user;
//         res.redirect('/profile/profile-home');
//     } catch (error) {
//         console.error(error);
//         res.render('error', { error });
//     }
// });

module.exports = router;