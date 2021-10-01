const router = require('express').Router();
const Game = require('../models/Game');
const withAuth = require('../utils/auth');
const axios = require('axios');
require('dotenv').config();

router.get('/', async (req, res) => {
  res.render('homepage');
});

router.get('/infopage', (req, res) => {
  res.render('infopage');
});

router.get('/game/:title', async (req, res) => {
  try {
    const gameData = await Game.findOne({ where: { slug: req.params.title } });

    const game = gameData.get({ plain: true });

    res.render('infopage', game);
  } catch (err) {
    const gameData = await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': `${process.env.client_id}`,
        Authorization: `Bearer ${process.env.token}`,
      },
      data: `fields age_ratings, cover, name, slug, summary, genres; where slug = "${req.params.title}";`,
    })
      .then(async (response) => {
        //working here trying to make a second api call to get the cover_id
        res.status(200).json(response.data);
        //create new game with this data
        const newGame = 
          //title as is
          //genres loaded
          //summary as is
          //age_ratings loaded
          //cover and width loaded
          axios({
            url: "https://api.igdb.com/v4/covers",
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Client-ID': `${process.env.client_id}`,
              Authorization: `Bearer ${process.env.token}`,
            },
            data: `fields image_id,width; where id = ${response.data.cover}`
          })
            .then(coverRes => {
                res.status(200).json(coverRes)
            })
            .catch(err => {
                console.error(err);
            });

          ////images.igdb.com/igdb/image/upload/t_thumb/co2s5t.jpg
          //slug as is
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  }
});

module.exports = router;
