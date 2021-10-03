const router = require('express').Router();
const Game = require('../models/Game');
const withAuth = require('../utils/auth');
const axios = require('axios');
const Review = require('../models/Review');
require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    const gameData = await Game.findAll();
    const games = gameData.map(g => g.get({plain: true}));
    for (const key in games) {
        const element = games[key];
        element.genres = JSON.parse(element.genres)
    }
    res.render('homepage', {games});
} catch (err) {
}
});

router.get('/infopage', (req, res) => {
  res.render("infopage");
});

router.get('/login', (req, res) => {
  res.render('login')
})
router.put('/login', (req, res) => {
  res.render('login')
})
router.delete('/login', (req, res) => {
  res.render('login')
})

router.get('/game/:title', async (req, res) => {
  try {
      const gameData = await Game.findOne({where: {slug: req.params.title}});
      const game = gameData.get({plain: true});
      game.genres = JSON.parse(game.genres)

      const reviewData = await Review.findAll({where: {game_id: game.id}})
      const reviews = reviewData.map(r => r.get({plain: true}));
      game.reviews = reviews;


    res.render('infopage', game);
  } catch (err) {
    const gameData = await axios({
      url: "https://api.igdb.com/v4/games",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': `${process.env.client_id}`,
        'Authorization': `Bearer ${process.env.token}`,
      },
      data: `fields age_ratings.category, age_ratings.rating, cover.image_id, genres.name, name, slug, summary; where slug = "${req.params.title}";`
    })
      .then(response => {
        const newGameData = response.data[0]
        newGameData.new_age_ratings = [];
        newGameData.new_genres = [];


        for (const key in newGameData.age_ratings) {
            const element = newGameData.age_ratings[key];
            switch (element.rating) {
              case 1:
                  newGameData.new_age_ratings.push("Three")
                break;
              case 2:
                  newGameData.new_age_ratings.push("Seven")
                break;
              case 3:
                  newGameData.new_age_ratings.push("Twelve")
                break;
              case 4:
                  newGameData.new_age_ratings.push("Sixteen")
                break;
              case 5:
                  newGameData.new_age_ratings.push("Eighteen")
                break;
              case 6:
                  newGameData.new_age_ratings.push("RP")
                break;
              case 7:
                  newGameData.new_age_ratings.push("EC")
                break;
              case 8:
                  newGameData.new_age_ratings.push("E")
                break;
              case 9:
                  newGameData.new_age_ratings.push("E10")
                break;
              case 10:
                  newGameData.new_age_ratings.push("T")
                break;
              case 11:
                  newGameData.new_age_ratings.push("M")
                break;
              case 12:
                  newGameData.new_age_ratings.push("AO")
                break;
            
              default:
                break;
            }
            // newGameData.new_age_ratings.push(element.rating)
          }

        for (const key in newGameData.genres) {
            const element = newGameData.genres[key];
            newGameData.new_genres.push(element.name)
          }

        //create new game
        Game.create({
          //title
          title: newGameData.name,
          //genres
          genres: JSON.stringify(newGameData.new_genres),
          //summary
          summary: newGameData.summary,
          //age_ratings
          age_ratings: JSON.stringify(newGameData.new_age_ratings),
          //cover
          cover: newGameData.cover.image_id,
          //slug
          slug: newGameData.slug
        })
          .then((gameData) => {
            const newGame = gameData.get({ plain: true });
            newGame.genres = JSON.parse(newGame.genres)
            res.render('infopage', newGame);
          })
      })
      .catch(err => {
        // res.render()
      });

  }
});


module.exports = router;
