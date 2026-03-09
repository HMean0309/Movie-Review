const Review = require('../models/Review');
const Movie = require('../models/Movie');

const createReview = async (req, res) => {
    try {
        const { reviewBody, rating, imdbId } = req.body;
        const userId = req.user.id;

        const review = new Review({
            body: reviewBody,
            ratings: rating,
            user: userId,
            imdbId: imdbId
        });
        const savedReview = await review.save();

        await Movie.findOneAndUpdate(
            { imdbId: imdbId },
            { $push: { reviews: savedReview._id } }
        );

        const populatedReview = await savedReview.populate('user', 'username');
        res.status(201).json(populatedReview);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const getReviewsByMovie = async (req, res) => {
    try {
        const { imdbId } = req.params;
        const reviews = await Review.find({ imdbId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        
        res.status(200).json(reviews);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy bình luận' });
        }
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này' });
        }
        await Review.findByIdAndDelete(id);
        res.status(200).json({ message: 'Xóa bình luận thành công' });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    createReview,
    getReviewsByMovie,
    deleteReview
}