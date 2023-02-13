const express = require('express');
const router = express.Router();
const User = require("../models/User.model");
const Spell = require("../models/Spell.model");
const { isLoggedIn, isLoggedOut, isCreator } = require('../middleware/route-guard')


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



// Spells-creator routes
//GET route to create:
router.get("/spells-creator", isLoggedIn, (req, res, next) => {
    res.render("profile/spells-creator", { 
        user: req.session.user,
        layout: "../views/layouts/profile-layout.ejs" });
});


//POST route to create spells:
router.post("/spells-creator", isLoggedIn, async (req, res) => {
    const { spellname, description, difficulty } = req.body;
    console.log('I got here with the spell')
    const newSpell = {
        spellname,
        description,
        difficulty,
        owner: req.session.user._id
    };
    
    try {
       // Always use the .create() method on an object
        const spellFromDB = await Spell.create(newSpell);
        console.log(`New spell created: ${spellFromDB.spellname}.`);
         res.redirect('/profile/spells-list')
      

    } catch (error) {
        console.log(error)
    }
});


//GET route to see the list:

router.get('/spells-list', (req, res, next) => {
    Spell.find()
      .then(allSpells => { 
        console.log('Retrieved spells from DB:', allSpells);
        res.render("profile/spells-list", { 
                 spells: allSpells,
                 user: req.session.user,
                 layout: "../views/layouts/profile-layout.ejs" });
      })
      .catch(error => {
        console.log('Error while getting the spells from the DB: ', error);
      });
  });







module.exports = router;
