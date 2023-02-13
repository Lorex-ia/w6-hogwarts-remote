const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  
    res.render("index", { user: req.session.user || undefined  });
  
});

// This is the page that should be rendered after doing the quizz
router.get("/my-profile", isLoggedIn,  (req, res, next) => {
  res.render("auth/signup-profile", { user: req.session.user });
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log('SESSION =====> ', req.session);
      if (!req.session.user) {
          res.redirect("/auth/login");
        }
  res.render("profile", { user: req.session.user });
});

/* GET & render hat quizz */
router.get("/hatquizz", (req, res, next) => {
  res.render("hatquizz");
});


router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
      if (err) next(err)
      res.redirect('/')
  })
})



module.exports = router;
