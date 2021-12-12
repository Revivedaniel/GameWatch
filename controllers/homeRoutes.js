const router = require('express').Router();
const Game = require('../models/Game');
const axios = require('axios');
const Review = require('../models/Review');
const User = require('../models/User');
const sequelize = require('../config/connection');
require('dotenv').config();
//this is the root route for the website
router.get('/', async (req, res) => {
  //This will gather the first 50 games in the DB to display on the homepage
  try {
    const gameData = await Game.findAll({
      order: [['id', 'DESC']],
    });
    const games = gameData.map((g) => g.get({ plain: true }));
    for (const key in games) {
      const element = games[key];
      element.genres = JSON.parse(element.genres);
    }
    //Rendering homepage with the games data and sending the session.logged_in status
    res.render('homepage', {
      games,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
  }
});
//These routes help other routes redirect to /login with the auth middleware
router.get('/infopage', (req, res) => {
  res.render('infopage');
});

router.get('/login', (req, res) => {
  res.render('login');
});
router.put('/login', (req, res) => {
  res.render('login');
});
router.delete('/login', (req, res) => {
  res.render('login');
});

router.get('/game', (req, res) => {
  res.redirect('/');
});

//This is the route where the game is searched in the database and rendered to infopage.
router.get('/game/:title', async (req, res) => {
  try {
    const gameData = await Game.findOne({ where: { slug: req.params.title } });
    const game = gameData.get({ plain: true });
    game.genres = JSON.parse(game.genres);
    game.age_ratings = JSON.parse(game.age_ratings);

    const reviewData = await Review.findAll({ where: { game_id: game.id } });
    const reviews = reviewData.map((r) => r.get({ plain: true }));
    for (const key in reviews) {
      const element = reviews[key];
      if (element.user_id == req.session.user_id) {
        element.owner = true;
      }
      //Finding username for the review
      const userData = await User.findByPk(element.user_id);
      const user = userData.get({ plain: true });

      element.user = user.name;
    }
    console.log(reviews);
    game.reviews = reviews;

    res.render('infopage', {
      ...game,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    //If the game didnt exist in our DB we are calling the IGDB api to see if it is in theirs.
    await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': `${process.env.client_id}`,
        Authorization: `Bearer ${process.env.token}`,
      },
      data: `fields age_ratings.category, age_ratings.rating, cover.image_id, genres.name, name, slug, summary; where slug = "${req.params.title}";`,
    })
      // If the game is in IGDB then we save a copy in our DB and render it to infopage
      .then((response) => {
        const newGameData = response.data[0];
        newGameData.new_age_ratings = [];
        newGameData.new_genres = [];

        //switch to change age_ratings from a number to the actual written rating
        for (const key in newGameData.age_ratings) {
          const element = newGameData.age_ratings[key];
          switch (element.rating) {
            case 1:
              newGameData.new_age_ratings.push('Three');
              break;
            case 2:
              newGameData.new_age_ratings.push('Seven');
              break;
            case 3:
              newGameData.new_age_ratings.push('Twelve');
              break;
            case 4:
              newGameData.new_age_ratings.push('Sixteen');
              break;
            case 5:
              newGameData.new_age_ratings.push('Eighteen');
              break;
            case 6:
              newGameData.new_age_ratings.push('RP');
              break;
            case 7:
              newGameData.new_age_ratings.push('EC');
              break;
            case 8:
              newGameData.new_age_ratings.push('E');
              break;
            case 9:
              newGameData.new_age_ratings.push('E10');
              break;
            case 10:
              newGameData.new_age_ratings.push('T');
              break;
            case 11:
              newGameData.new_age_ratings.push('M');
              break;
            case 12:
              newGameData.new_age_ratings.push('AO');
              break;

            default:
              break;
          }
        }
        //Pushing the name of the genre only to new_genres
        for (const key in newGameData.genres) {
          const element = newGameData.genres[key];
          newGameData.new_genres.push(element.name);
        }

        //create new game
        Game.create({
          //title
          title: newGameData.name,
          //genres stringified
          genres: JSON.stringify(newGameData.new_genres),
          //summary
          summary: newGameData.summary,
          //age_ratings stringified
          age_ratings: JSON.stringify(newGameData.new_age_ratings),
          //cover
          cover: newGameData.cover.image_id,
          //slug
          slug: newGameData.slug,
        }).then((gameData) => {
          const newGame = gameData.get({ plain: true });
          //Parsing the stringified values
          newGame.genres = JSON.parse(newGame.genres);
          newGame.age_ratings = JSON.parse(newGame.age_ratings);

          res.render('infopage', newGame);
        });
      })
      .catch(async (err) => {
        // Initializing games array
        let games = [];

        // Searching for game
        let response = await axios({
          url: 'https://api.igdb.com/v4/games',
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Client-ID': `${process.env.client_id}`,
            Authorization: `Bearer ${process.env.token}`,
          },
          data: `search "${req.params.title}";`,
        });

        // looping over all the game ids returned to search for the game data
        for (let i = 0; i < response.data.length; i++) {
          const id = response.data[i].id;

          let gameResponse = await axios({
            url: 'https://api.igdb.com/v4/games',
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Client-ID': `${process.env.client_id}`,
              Authorization: `Bearer ${process.env.token}`,
            },
            data: `fields age_ratings.category, age_ratings.rating, cover.image_id, genres.name, name, slug, summary; where id = ${id};`,
          });

          let game = gameResponse.data[0];
          let new_age_ratings = [];
          let new_genres = [];

          if (game.age_ratings) {
            //switch to change age_ratings from a number to the actual written rating
            for (let i = 0; i < game.age_ratings.length; i++) {
              const element = game.age_ratings[i];
              switch (element.rating) {
                case 1:
                  new_age_ratings.push('Three');
                  break;
                case 2:
                  new_age_ratings.push('Seven');
                  break;
                case 3:
                  new_age_ratings.push('Twelve');
                  break;
                case 4:
                  new_age_ratings.push('Sixteen');
                  break;
                case 5:
                  new_age_ratings.push('Eighteen');
                  break;
                case 6:
                  new_age_ratings.push('RP');
                  break;
                case 7:
                  new_age_ratings.push('EC');
                  break;
                case 8:
                  new_age_ratings.push('E');
                  break;
                case 9:
                  new_age_ratings.push('E10');
                  break;
                case 10:
                  new_age_ratings.push('T');
                  break;
                case 11:
                  new_age_ratings.push('M');
                  break;
                case 12:
                  new_age_ratings.push('AO');
                  break;

                default:
                  break;
              }
            }
          }

          //Pushing the name of the genre only to new_genres
          for (const key in game.genres) {
            const element = game.genres[key];
            new_genres.push(element.name);
          }
          //setting genres
          game.genres = new_genres;
          //setting age_ratings
          game.age_ratings = new_age_ratings;
          //setting cover
          game.cover = game.cover.image_id;
          //setting title
          game.title = game.name;
          //pushing game to games array
          games.push(game);
        }
        //If there are no games in the response then render the 404 page for now
        if (games.length <= 0) {
          res.render('404');
        } else {
          //render the search results page with the games
          res.render('search', {
            games,
          });
        }
      });
  }
});

module.exports = router;
