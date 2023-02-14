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



/////// SPELLS ////////

// CREATE ROUTES : Spells-creator routes
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


// READ ROUTES:
//GET route to see the list of ALL spells:
router.get('/spells-list', (req, res, next) => {
    Spell.find()
      .then(allSpells => { console.log('Retrieved spells from DB:', allSpells); res.render("profile/spells-list", { 
                 spells: allSpells,
                 user: req.session.user,
                 layout: "../views/layouts/profile-layout.ejs" });
      })
      .catch(error => {
        console.log(error);
      });
  });


// GET route to see only the details of a specific spell
  router.get('/spell-details/:spellId', async (req, res) => {
    const spellFound = await Spell.findById(req.params.spellId).populate('owner')
    console.log( "spell Found here:", req.session.user )
    res.render('profile/spell-details', { user: req.session.user, spellFound })
  })

// router.get('/:id', (req, res, next) => {
//     const { id } = req.params
//     Spell.findById(id)
//     .then( (oneSpell) => res.render('spell-details', { oneSpell, user: req.session.user }))
//     .catch( (err) => next(err));
//   })



// UPDATE ROUTES
 // GET '/spells/:id/edit' route to show the movie edit form to the user
router.get('/spells-list/:spellId/update', async (req, res) => {
    const spell = await Spell.findById(req.params.spellId)
    console.log(req.session.user)
    res.render('profile/spells-edit', { spell, update: true, user: req.session.user })
  })

  
  // POST '/spells/:id/edit' route to edit the spell
  router.post('/spells-list/:spellId/update', async (req, res) => {
console.log("We're in the post")
    try{
        await Spell.findByIdAndUpdate(req.params.spellId, {
            ...req.body,
        })
        res.redirect(`/profile/spells-list`)
    } catch(err){
        console.log(err)
    }
  
   
  })




//DELETE route 
router.post('/:spellId/delete', async (req, res) => {
    await Spell.findByIdAndDelete(req.params.spellId)
    res.redirect('/profile/spells-list')
  })

module.exports = router;
