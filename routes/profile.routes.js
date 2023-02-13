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

//route for characters
router.get("/community", isLoggedIn, (req, res, next) => {
    res.render("profile/community", { user: req.session.user, layout: "../views/layouts/profile-layout.ejs" })
});


module.exports = router;
