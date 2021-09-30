const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  res.render("homepage")
});

router.get('/infopage', (req, res) => {
  res.render('infopage');
});

router.get("/game/:title", async (req, res) => {
  try {
      //WORKING HERE recreate game model then continue here
      const gameData = await Game.findOne({where: {slug: req.params.title}});

      const game = gameData.get({plain: true});

      res.render('infopage', game)
  } catch (err) {
      res.status(500).json(err)
  }
})

module.exports = router;
