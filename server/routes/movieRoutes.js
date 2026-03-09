const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/home-content', movieController.getHomeMovies);
router.get('/', movieController.getMovies);
router.get('/:imdbId', movieController.getSingleMovie);

module.exports = router;