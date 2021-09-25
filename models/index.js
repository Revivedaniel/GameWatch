const User = require('./User');
const path = require('path')
const hbs = require('hbs');
const express = require('express')
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

// User.hasMany(Project, {
//   foreignKey: 'user_id',
//   onDelete: 'CASCADE'
// });

// Project.belongsTo(User, {
//   foreignKey: 'user_id'
// });

// module.exports = { User};
