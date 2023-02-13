const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();
const User = require("../models/User.model");


  //Routes for the Quizz part
  // the / would still be /hatquizz because it is defined in the boucer in app.js
router.get('/', isLoggedIn, (req, res) => {
    res.render('hatquiz/hatquizz', { user: req.session.user })
})

router.post('/', isLoggedIn, async (req, res) => {
// console.log("made it here", req.body)
        var gryffindor = {house : "gryffindor", count : 0}
        var slytherin = {house : "slytherin", count : 0};
        var hufflepuff = {house : "hufflepuf", count : 0};
        var ravenclaw = {house : "ravenclaw", count : 0};

        for(let question in req.body){
            console.log(req.body[question])

            if (req.body[question] === "gryffindor" ){
                gryffindor.count += 1
            }
            else if (req.body[question] === "slytherin" ){
                slytherin.count += 1
            } 
            else if (req.body[question] === "ravenclaw" ){
                ravenclaw.count += 1
            }
            else if (req.body[question] === "hufflepuff" ){
                hufflepuff.count += 1
            } 
        }
//Console log the points
    console.log(gryffindor, slytherin, hufflepuff, ravenclaw)

    const hogwarts = [gryffindor, slytherin, hufflepuff, ravenclaw]
    hogwarts.sort((a,b) =>{
        if(a.count>b.count){
            return -1;
        }else if(b.count>a.count){
            return 1;
        } else {
            return 0;
        }
    })

    const myHouse = hogwarts[0].house.toUpperCase()
    console.log("pizza:", hogwarts)


      // Checking which one is bigger
    //   var maxHouse = "gryffindor";
    //   var maxScore = gryffindor;

    //   if (slytherin > maxScore) {
    //     maxHouse = "slytherin";
    //     maxScore = slytherin;
    //     } else if (hufflepuff > maxScore) {
    //         maxHouse = "hufflepuff";
    //         maxScore = hufflepuff;
    //     } else if (ravenclaw > maxScore) {
    //         maxHouse = "ravenclaw";
    //         maxScore = ravenclaw;
    //     } else if (gryffindor === slytherin) {
    //         maxHouse = "gryffindor";
    //     } else if (gryffindor === ravenclaw) {
    //         maxHouse = "gryffindor";
    //     } else if (gryffindor === hufflepuff) {
    //         maxHouse = "gryffindor";
    //     } else if (slytherin === hufflepuff) {
    //         maxHouse = "pizza";
    //     } else if (slytherin === ravenclaw) {
    //         maxHouse = "slytherin";
    //     } else if (hufflepuff === ravenclaw) {
    //         maxHouse = "hufflepuff";
    //     }


    console.log("this is your house:", myHouse, req.session)


    try {
        let quizUser = await User.findByIdAndUpdate(req.session.user._id, { house: myHouse }, { new: true });
        req.session.user = quizUser;
        console.log("hey profile")
        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.render('error', { error });
    }
});

// router.get("/auth/signup-profile", isLoggedIn,  (req, res, next) => {
//     res.render("auth/signup-profile", { user: req.session.user });
// });

module.exports = router;