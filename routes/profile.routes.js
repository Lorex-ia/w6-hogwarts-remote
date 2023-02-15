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

// router.get("/profile-info", isLoggedIn, (req, res, next) => {
//     res.render("profile/profile-info", { 
//         user: req.session.user,
//         layout: "../views/layouts/profile-layout.ejs" });
// });

//new profile info route to count the number of spells
router.get("/profile-info", isLoggedIn, async (req, res, next) => {
    try {
      const userId = req.session.user._id;
      const spells = await Spell.find({ owner: userId });
      const numSpells = spells.length;
      res.render("profile/profile-info", { 
        user: req.session.user,
        numSpells: numSpells,
        layout: "../views/layouts/profile-layout.ejs"
      });
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
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
// router.get('/spells-list', (req, res, next) => {
//     Spell.find({}).populate('owner')
//       .then(allSpells => { console.log('Retrieved spells from DB:', allSpells); res.render("profile/spells-list", { 
//                  spells: allSpells,
//                  user: req.session.user,
//                  layout: "../views/layouts/profile-layout.ejs" });
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   });

// Route that allows the filtering:
router.get('/spells-list', (req, res, next) => {
    const difficulty = req.query.difficulty;
    let query = {};
    if (difficulty) {
      query.difficulty = difficulty;
    }
    Spell.find(query).populate('owner')
      .then(allSpells => { console.log('Retrieved spells from DB:', allSpells); res.render("profile/spells-list", { 
                 spells: allSpells,
                 user: req.session.user,
                 layout: "../views/layouts/profile-layout.ejs" });
      })
      .catch(error => {
        console.log(error);
      });
});


router.get('/spells-list/difficulty/:difficulty', async (req, res, next) => {
    const difficulty = req.params.difficulty;
    console.log(difficulty);
    try {
        const spells = await Spell.find({ difficulty: difficulty }).populate('owner');
        console.log(`Retrieved spells with difficulty level ${difficulty} from DB:`, spells);
        res.render('profile/spells-list', {
            spells,
            user: req.session.user,
            layout: '../views/layouts/profile-layout.ejs'
        });
    } catch (error) {
        console.log(error);
    }
});

// Route to show spells with difficulty level 1
// router.get('/spells-list/difficulty/:levels', (req, res, next) => {
//     console.log("getting here!")
//     Spell.find({ difficulty: 1 }).populate('owner')
//       .then(spells => {
//         console.log('Diff 1', spells);
//         res.render('profile/spells-list', {
//           spells,
//           user: req.session.user,
//           layout: '../views/layouts/profile-layout.ejs'
//         });
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   });






// GET route to see only the details of a specific spell
  router.get('/spell-details/:spellId', async (req, res) => {
    const spellFound = await Spell.findById(req.params.spellId).populate('owner')
    console.log( "spell Found here:", req.session.user )
    res.render('profile/spell-details', { user: req.session.user, spellFound })
  })



// UPDATE ROUTES
 // GET '/spells/:id/edit' route to show the movie edit form to the user
router.get('/spells-list/:spellId/update', async (req, res) => {
    const spell = await Spell.findById(req.params.spellId)
    console.log(req.session.user)
    res.render('profile/spells-edit', { spell, update: true, user: req.session.user })
  });

  


  // POST '/spells/:id/edit' route to edit the spell
  router.post('/spells-list/:spellId/update', async (req, res) => {
    console.log("We're in the post")
    try{
        await Spell.findByIdAndUpdate(req.params.spellId, {
            ...req.body,
        })
        res.redirect(`/profile/user-spells`)
    } catch(err){
        console.log(err)
    }
  })







//DELETE route 
router.post('/:spellId/delete', async (req, res) => {
    await Spell.findByIdAndDelete(req.params.spellId)
    res.redirect('/profile/user-spells')
  })




// User spells route 
router.get("/user-spells", isLoggedIn, (req, res, next) => {
    Spell.find({ owner: req.session.user._id }) // Filter spells that belong to the logged-in user
      .then(userSpells => {
        console.log('Retrieved user spells:', userSpells);
        res.render("profile/user-spells", { 
          spells: userSpells, // Pass the filtered spells to the view
          user: req.session.user,
          layout: "../views/layouts/profile-layout.ejs"
        });
      })
      .catch(error => {
        console.log(error);
      });
  });




module.exports = router;
