const express = require('express');
const router = express.Router();
const User = require("../models/User.model");
const Spell = require("../models/Spell.model");
const { isLoggedIn, isLoggedOut, isCreator } = require('../middleware/route-guard')

const axios = require('axios');

/* GET Hogwarts home page */
// router.get("/", isLoggedIn, (req, res, next) => {
//     res.render("profile/profile-home", { 
//         user: req. session.user,
//         layout: "../views/layouts/profile-layout.ejs"
//      }
//     );
    
//     console.log('SESSION =====> ', req.session);

//     if (!req.session.user) {
//             res.redirect("/auth/login");
//     }
// });

//New route to update the backgrounds depending on the house the user is in
router.get("/", isLoggedIn, (req, res, next) => {
    const house = req.session.user.house;
    res.render("profile/profile-home", {
      user: req.session.user,
      house: req.session.user.house,
    });
    
    console.log('SESSION =====> ', req.session);

    if (!req.session.user) {
        res.redirect("/auth/login");
    }
});



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
  // router.get("/profile-info", isLoggedIn, (req, res, next) => {
//     res.render("profile/profile-info", { 
//         user: req.session.user,
//         layout: "../views/layouts/profile-layout.ejs" });
// });



// ROUTE FOR      SYLLABUS
router.get("/syllabus", isLoggedIn, (req, res, next) => {
    res.render("profile/syllabus", { 
        user: req.session.user,
        layout: "../views/layouts/profile-layout.ejs" });
});

// ROUTES FOR     HOUSE LOUNGE    -- WHOOP WHOOP PARTEEEY :

//FIRST FOR       GET      LOUNGE
router.get("/lounge", isLoggedIn, (req, res, next) => {
    console.log("made it to the lounge get");

    res.render("profile/lounge", { 
        user: req.session.user, 
        layout: "../views/layouts/profile-layout.ejs" })
});

//SECOND FOR      POST      LOUNGE
router.post("/lounge", isLoggedIn, (req, res, next) => {
    console.log("made it to the lounge post, this is the req body:");
    console.log(req.body);
    let body = req.body;

    let typedPassword = body.typedHousePassword;
    console.log(typedPassword);
    
    let userHouse = req.session.user.house;
    console.log("user house is " + userHouse);

    // START OF    SWITCH     CASE //
    switch(typedPassword) {
        // 1st case: doesnt type anything
        case "undefined": 
                res.render("profile/lounge", { 
                    errorMessage: "Please enter your password",
                    user: req.session.user, 
                    layout: "../views/layouts/profile-layout.ejs" })
                break;
        // 2nd case: password is empty
        case "": 
                res.render("profile/lounge", { 
                    errorMessage: "Please enter your password",
                    user: req.session.user, 
                    layout: "../views/layouts/profile-layout.ejs" })
                break;
        // 3rd case: password is Gryffindor
        case "Knock, knock! Who's there? Dumb! Dumb who? Dumb-door's password": 
                if  (userHouse === "Gryffindor") {
                    console.log("made it to the matching passwords and houses case");

                    res.render("profile/lounges/gryff-lounge", { 
                        user: req.session.user,
                        layout: "../views/layouts/profile-layout.ejs" })
                } else {
                    res.render("profile/lounge", { 
                        errorMessage: "You sneaky little wizard, try to enter YOUR own House Lounge",
                        user: req.session.user, 
                        layout: "../views/layouts/profile-layout.ejs" })
                }
                break;
        // 4th case: password is Hufflepuff
        case "If you're not in Hufflepuff, you're a huff-n-puff": 
                if  (userHouse === "Hufflepuff") {
                        res.render("profile/lounges/huff-lounge", { 
                            user: req.session.user,
                            layout: "../views/layouts/profile-layout.ejs" })

                } else {            
                    res.render("profile/lounge", { 
                        errorMessage: "You sneaky little wizard, try to enter YOUR own House Lounge",
                        user: req.session.user, 
                        layout: "../views/layouts/profile-layout.ejs" })
                }
                break;
        // 5h case: password is Ravenclaw
        case "The Last Horcrux is my ex": 
                if  (userHouse === "Ravenclaw") {
                    res.render("profile/lounges/rave-lounge", { 
                        user: req.session.user, 
                        layout: "../views/layouts/profile-layout.ejs" })
                } else {
                    res.render("profile/lounge", { 
                        errorMessage: "You sneaky little wizard, try to enter YOUR own House Lounge",
                        user: req.session.user, 
                        layout: "../views/layouts/profile-layout.ejs" })
                }
                break;
        // 6th case: password is Slytherin
        case "Slytherin to your terminal like a boss":
                if  (userHouse === "Slytherin") {
                    res.render("profile/lounges/slyth-lounge", { 
                        user: req.session.user, 
                        layout: "../views/layouts/profile-layout.ejs" })
                } else {
                    res.render("profile/lounge", { 
                        errorMessage: "You sneaky little wizard, try to enter YOUR own House Lounge and don't you snitch on this house password",
                        user: req.session.user, 
                        layout: "../views/layouts/profile-layout.ejs" })
                }
                break;
        
    }
    // END OF     SWTICH     CASE // 
});

// - profile/lounges/  -- I DID ANOTHER FOLDER FOR    EACH HOUSE LOUNGE    (gryff huff rave slyth)

// routes for every house lounge (Gryffindor, Hufflepuff, Ravenclaw, Slytherin) 
router.get("/lounges/gryff", isLoggedIn, (req, res, next) => {
    res.render("profile/lounges/gryff-lounge", { 
        user: req.session.user, 
        layout: "../views/layouts/profile-layout.ejs" })
});

router.get("/lounges/huff", isLoggedIn, (req, res, next) => {
    res.render("profile/lounges/huff-lounge", { 
        user: req.session.user, 
        layout: "../views/layouts/profile-layout.ejs" })
});

router.get("/lounges/rave", isLoggedIn, (req, res, next) => {
    res.render("profile/lounges/rave-lounge", { 
        user: req.session.user, 
        layout: "../views/layouts/profile-layout.ejs" })
});

router.get("/lounges/slyth", isLoggedIn, (req, res) => {
    res.render("profile/lounges/slyth-lounge", { 
        user: req.session.user, 
        layout: "../views/layouts/profile-layout.ejs" })
});

//  ROUTER FOR      LOGOUT
router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(err => {
        if (err) next(err)
        res.redirect('/');
    })
})

//route for    CHARACTERS    page
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

//route for    CHARACTERS    DETAILS page
router.get("/house-characters/:id", isLoggedIn, async (req, res, next) => {
    let characters = await axios.get(`https://hp-api.onrender.com/api/characters  `);

    //find the character by id in API
    let character = characters.data.find(character => character.id == req.params.id);

    //remove the keys with empty values and also remove the keys that i dont feel like displaying (they are a lot of keys in the API as you can see..) 
    let keysWithoutEmptyFields = Object.keys(character).filter(key => 
                character[key] !== "" && 
                character[key] !== null && 
                character[key] !== undefined &&  
                character[key].length !== 0 &&
                key !== "id" && 
                key !== "alternate_names" && 
                key !== "species" && 
                key !== "gender" && 
                key !== "wizard" &&
                key !== "alternate_actors" && 
                key !== "alive"
    );

    res.render("profile/house-characters-details", { 
        user: req.session.user, 
        character: character,
        keys: keysWithoutEmptyFields,
        layout: "../views/layouts/profile-layout.ejs" 
    });
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
