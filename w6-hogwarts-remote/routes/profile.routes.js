const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/profile-home", isLoggedIn, (req, res, next) => {
    res.render("profile/profile-home", { user: req.session.user });
    console.log('SESSION =====> ', req.session);
        if (!req.session.user) {
            res.redirect("/auth/login");
        }
});


module.exports = router;
