const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    body: {type: String, required: true},
    ratings: {type: Number, required: true, min: 1, max: 10},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imdbId: { type: String, required: true }
}, {timestamps: true});

module.exports = mongoose.model(`Review`, reviewSchema);