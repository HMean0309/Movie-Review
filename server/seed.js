// File: server/seed.js
const mongoose = require('mongoose');
require('dotenv').config();
const Movie = require('./models/Movie'); // Đảm bảo đường dẫn đúng

// Dữ liệu phim mẫu
const movies = [
    {
        imdbId: 'tt5433138',
        title: 'Fast X',
        releaseDate: '2023-05-19',
        trailerLink: 'https://www.youtube.com/watch?v=eoOaKN4qCKw',
        poster: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg',
        genres: ['Action', 'Crime', 'Thriller'],
        backdrops: [
            'https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemNSC1pOfnXeCM.jpg',
            'https://image.tmdb.org/t/p/original/nZ6c4Eaivk19rF9yU9r6k7j3.jpg'
        ]
    },
    {
        imdbId: 'tt1630029',
        title: 'Avatar: The Way of Water',
        releaseDate: '2022-12-16',
        trailerLink: 'https://www.youtube.com/watch?v=d9MyqFCDBNM',
        poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        genres: ['Science Fiction', 'Adventure', 'Action'],
        backdrops: [
            'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
            'https://image.tmdb.org/t/p/original/evaFLqtswezLosllOL0ZiJR5xDB.jpg'
        ]
    },
    {
        imdbId: 'tt0468569',
        title: 'The Dark Knight',
        releaseDate: '2008-07-16',
        trailerLink: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        genres: ['Drama', 'Action', 'Crime'],
        backdrops: [
            'https://image.tmdb.org/t/p/original/dqK9UFagCOn8kJiVpdO43mgxD0.jpg',
            'https://image.tmdb.org/t/p/original/p1F51Lvj3sMopG948F5HsBbl43C.jpg'
        ]
    }
];

const seedData = async () => {
    try {
        // 1. Kết nối Database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB...');

        // 2. Xóa sạch dữ liệu cũ (để tránh trùng lặp nếu chạy nhiều lần)
        await Movie.deleteMany({});
        console.log('🧹 Old data cleared!');

        // 3. Thêm dữ liệu mới
        await Movie.insertMany(movies);
        console.log('✅ Movies added successfully!');

        // 4. Ngắt kết nối
        process.exit();
    } catch (error) {
        console.log('❌ Error:', error);
        process.exit(1);
    }
};

seedData();