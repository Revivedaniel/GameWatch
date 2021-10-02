const router = require('express').Router();
const Review = require('../../models/Review');

router.post('/', async (req, res) => {
    try {
        req.body.user_id = req.session.user_id
        const review = {
            user_id: req.session.user_id,
            ...req.body
        }

        const reviewData = await Review.create(review)
        res.status(200).json(reviewData);
        console.log(reviewData)
    } catch (err) {
        res.status(400).json(err);
        console.log(err)
      }
})


module.exports = router;