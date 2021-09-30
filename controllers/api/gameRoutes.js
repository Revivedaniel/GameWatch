const router = require('express').Router();
const Game = require("../../models/Game");

router.get("/", async (req, res) => {
    try {
        const gameData = await Game.findAll({limit: 5});
        res.status(200).json(gameData)
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get("/:title", async (req, res) => {
    try {
        //WORKING HERE recreate game model then continue here
        const gameData = await Game.findOne({where: {slug: req.params.title}});
        res.status(200).json(gameData)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;