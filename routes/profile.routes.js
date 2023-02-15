const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const axios = require('axios');

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

// ROUTE FOR      SYLLABUS
router.get("/syllabus", isLoggedIn, (req, res, next) => {
    res.render("profile/syllabus", { 
        user: req.session.user,
        layout: "../views/layouts/profile-layout.ejs" });
});

// ROUTES FOR     HOUSE LOUNGE    -- WHOOP WHOOP PARTEEEY

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

module.exports = router;
