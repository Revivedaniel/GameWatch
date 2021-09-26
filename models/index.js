const User = require('./User');
const path = require('path')
const hbs = require('hbs');
const express = require('express');
const Game = require('./Game');
const Review = require('./Review')
const app = express()

app.set('views', path.join(__dirname))
app.set('views engine', 'hbs')

app.get('/', function(req, res) {
    res.render('Home', {
        array: ['One', 'Two', 'Three'],
        message: 'Hello'
    })
})
 
app.listen(3000, function(error) {
    if(error) throw error
    console.log("Server says hi")
})

Game.hasMany(Review, {
    foreignKey: "game_id",
    onDelete: "CASCADE"
});

Review.belongsTo(Game, {
    foreignKey: "game_id"
});

User.hasMany(Review, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
});

Review.belongsTo(User, {
    foreignKey: "user_id",
});
