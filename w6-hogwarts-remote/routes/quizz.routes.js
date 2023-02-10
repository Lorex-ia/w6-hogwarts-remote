const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();


  //Routes for the Quizz part
  // the / would still be /hatquizz because it is defined in the boucer in app.js
router.get('/', (req, res) => {
    res.render('hatquizz', { user: req.session.user })
})


router.post('/', async (req, res) => {
console.log("made it here", req.body)

        var gryffindor =0;
        var slytherin =0;
        var hufflepuff =0;
        var ravenclaw =0;
      // the above code (unfinished) is the same as doing it with a for loop:
        var questions = ['animal', 'garden', 'death', 'road', 'night'];
      
        for (var i = 0; i < questions.length; i++) {
            var q = document.querySelector('input[name="' + questions[i] + '"]:checked').value;
      
            if (q == "gryffindor") {
                gryffindor += 1;
            } else if (q == "slytherin") {
                slytherin += 1;
            } else if (q == "hufflepuff") {
                hufflepuff += 1;
            } else if (q == "ravenclaw") {
                ravenclaw += 1;
            }
        }
      
        var maxHouse = "gryffindor";
        var maxScore = gryffindor;
      
        if (slytherin > maxScore) {
            maxHouse = "slytherin";
            maxScore = slytherin;
        }
      
        if (hufflepuff > maxScore) {
            maxHouse = "hufflepuff";
            maxScore = hufflepuff;
        }
      
        if (ravenclaw > maxScore) {
            maxHouse = "ravenclaw";
            maxScore = ravenclaw;
        }
      
        user.save(function(err) {
          if (err) {
            console.log(err);
            alert("There was an error saving the user's house.");
          } else {
            alert("gryffindor: "+ gryffindor + "\n slytherin: "+ slytherin + "\n hufflepuff: "+ hufflepuff + "\n ravenclaw: "+ ravenclaw + "\n\nThe house with the highest score is " + maxHouse + " with " + maxScore + " points.\nYour house has been saved.");
          }
        });

      console.log(maxHouse)

    try {
        const user = await User.findByIdAndUpdate(req.session.user._id, { house: req.body.maxHouse }, { new: true });
        req.session.user = user;
        res.redirect('/profile/profile-home');
    } catch (error) {
        console.error(error);
        res.render('error', { error });
    }
});




  module.exports = router;