const router = require('express').Router();
const Game = require("../../models/Game");

router.get("/", async (req, res) => {
    try {
        const gameData = await Game.findAll({limit: 50});
        res.status(200).json(gameData)
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router;