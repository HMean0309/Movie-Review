const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

    imdbId: { type: String, required: true, unique: true },
    
    title: { type: String, required: true },
    originalTitle: { type: String },
    
    releaseDate: { type: String },
    trailerLink: { type: String },
    poster: { type: String },
    backdrops: [String],
    genres: [String],
    
    // --- THÔNG TIN CHI TIẾT ---
    overview: { type: String },
    runtime: { type: Number },
    revenue: { type: Number },
    budget: { type: Number },
    
    // --- Ê-KÍP (Lấy từ credits) ---
    director: { type: String },
    writers: [String],
    actors: [String],

    // --- ĐIỂM SỐ ---
    rating: { type: Number, default: 0 },
    voteCount: { type: Number },

    reviewIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);