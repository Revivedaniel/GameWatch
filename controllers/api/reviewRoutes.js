const router = require('express').Router();
const Review = require('../../models/Review');
const withAuth = require('../../utils/auth')
//Creating a review if the user is logged in
router.post('/', withAuth, async (req, res) => {
  try {
    req.body.user_id = req.session.user_id;
    const review = {
      user_id: req.session.user_id,
      ...req.body,
    };

    const reviewData = await Review.create(review);
    res.status(200).json(reviewData);
    console.log(reviewData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});
//updating a review if logged in
router.put('/:id', withAuth, async (req, res) => {
    try{
        const reviewData = await Review.findByPk(req.params.id);
        const review = reviewData.get({plain: true})
        console.log(review)
        //Verifying that the user created this review
        if (req.session.user_id == review.user_id) {
            console.log("Success")
            try {
              const review = await Review.update(
                {
                  stars: req.body.stars,
                  review: req.body.review,
                },
                { where: { id: req.params.id } }
              );
              res.status(200).json(review);
            } catch (err) {
              res.status(500).json(err);
            }
        }
    } catch (err) {
        console.log(err)
    }

});
//deleting a review if logged in
router.delete('/:id', withAuth, async (req, res) => {
    try{
        const reviewData = await Review.findByPk(req.params.id);
        const review = reviewData.get({plain: true})
        console.log(review)
        //Verifying that the user created this review
        if (req.session.user_id == review.user_id) {
            console.log("Success")
            try {
              const review = await Review.destroy(
                { where: { id: req.params.id } }
              );
              res.status(200).json(review);
            } catch (err) {
              res.status(500).json(err);
            }
        }
    } catch (err) {
        console.log(err)
    }

});

module.exports = router;
