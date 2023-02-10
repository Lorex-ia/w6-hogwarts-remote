const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.user || undefined  });
});

router.get("/my-profile", isLoggedIn,  (req, res, next) => {
  res.render("auth/signup-profile", { user: req.session.user });
});

/* GET & render hat quizz */
router.get("/hatquiz", (req, res, next) => {
  res.render("hatquiz/hatquizz", { user: req.session.user });
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.session.destroy(err => {
      if (err) next(err)
      res.redirect('/')
  })
})

module.exports = router;
