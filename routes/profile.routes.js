const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET Hogwarts home page */
router.get("/", isLoggedIn, (req, res, next) => {
    res.render("profile/profile-home", { 
        user: req. session.user,
        layout: "../views/layouts/profile-layout.ejs" }
    );
    
    console.log('SESSION =====> ', req.session);

    if (!req.session.user) {
            res.redirect("/auth/login");
    }
});

router.get("/profile-info", isLoggedIn, (req, res, next) => {
    res.render("profile/profile-info", { 
        user: req.session.user,
        layout: "../views/layouts/profile-layout.ejs" });
});

router.get("/lounge", isLoggedIn, (req, res, next) => {
    res.render("profile/lounge", { user: req.session.user, layout: "../views/layouts/profile-layout.ejs" })
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(err => {
        if (err) next(err)
        res.redirect('/');
    })
})

//route for characters page
router.get("/house-characters", isLoggedIn, (req, res, next) => {
    fetch(`https://hp-api.onrender.com/api/characters`)
    .then(response => response.json())
    .then(characters => {
        res.render("profile/house-characters", { 
            user: req.session.user, 
            characters: characters,
            layout: "../views/layouts/profile-layout.ejs" })
    })
    .catch( (err) => console.log(err) )
});


module.exports = router;
