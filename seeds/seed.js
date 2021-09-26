const sequelize = require('../config/connection');
const User = require('../models/User')
const Game = require('../models/Game')
const Review = require('../models/Review')

const userData = require('./userData.json');  
const gameData = require('./gameData.json')
const reviewData = require('./reviewData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const games = await Game.bulkCreate(gameData);

  const reviews = await Review.bulkCreate(reviewData)

  process.exit(0);
};

seedDatabase();
