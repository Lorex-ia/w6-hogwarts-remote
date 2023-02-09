const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


/* GET & render hat quizz */
router.get("/hatquizz", (req, res, next) => {
  res.render("hatquizz");
});




module.exports = router;
