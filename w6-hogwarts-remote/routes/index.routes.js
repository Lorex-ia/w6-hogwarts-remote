const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.user || undefined  });
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log('SESSION =====> ', req.session);
      if (!req.session.user) {
          res.redirect("/auth/login");
        }
  res.render("profile", { user: req.session.user });
});






module.exports = router;
