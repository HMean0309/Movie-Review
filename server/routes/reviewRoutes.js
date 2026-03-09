const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, reviewController.createReview);
router.get('/:imdbId', reviewController.getReviewsByMovie);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;