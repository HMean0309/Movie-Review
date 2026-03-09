require('dotenv').config();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const axios = require('axios');

const apiKey = process.env.TMDB_API_KEY;
const baseURL = process.env.TMDB_BASE_URL;

// Lay tat ca phim
const getMovies = async (req, res) => {
    try {
        const searchTitle = req.query.title || "";
        if (searchTitle) {
            const [page1,page2] = await Promise.all([
                axios.get(`${baseURL}/search/movie?api_key=${apiKey}&query=${searchTitle}&language=vi-VN&page=1`),
                axios.get(`${baseURL}/search/movie?api_key=${apiKey}&query=${searchTitle}&language=vi-VN&page=2`)
            ])
            const list1 = page1.data.results || [];
            const list2 = page2.data.results || [];

            const rawList = [...list1, ...list2];

            // Lọc dữ liệu phim rác của TMDB
            const uniqueIds = new Set();
            const cleanList = rawList.filter(m => {
                if (uniqueIds.has(m.id)) return false;
                uniqueIds.add(m.id);

                const hasPoster = m.poster_path !== null && m.poster_path !== "";
                const hasInfo = (m.overview && m.overview !== "") || (m.release_date && m.release_date !== "");
                
                return hasPoster && hasInfo;
            });

            // Lấy 30 phim tốt nhất sau khi lọc
            const finalResults = cleanList.slice(0, 30).map(m => mapToModel(m));

            return res.status(200).json({
                status: "success",
                results: finalResults.length,
                data: finalResults
            })
        }

        const movies = await Movie.find();
        res.status(200).json({
            status: "success",
            data: movies
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Lay phim theo ID
const mapToModel = (m, videoData = null) => {
    let videos = [];
    if (Array.isArray(videoData)) {
        videos = videoData;
    } else if (m.videos && Array.isArray(m.videos.results)) {
        videos = m.videos.results;
    }

    let trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer");
    if (!trailer) {
        trailer = videos.find(v => v.site === "YouTube" && v.type === "Teaser");
    }

    const credits = m.credits || {};
    const crew = credits.crew || [];
    const cast = credits.cast || [];

    const director = crew.find(c => c.job === "Director")?.name || "Unknown";
    const writers = crew.filter(c => ["Screenplay", "Writer", "Story"].includes(c.job))
                        .map(c => c.name)
                        .slice(0, 3);
    const actors = cast.slice(0, 10).map(c => c.name);

    return {
        imdbId: m.id.toString(),
        title: m.title,
        originalTitle: m.original_title || "",
        overview: m.overview || "Hiện chưa có tóm tắt cho phim này.",
        
        releaseDate: m.release_date || "Đang cập nhật",
        runtime: m.runtime || 0,
        budget: m.budget || 0,
        revenue: m.revenue || 0,
        
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://via.placeholder.com/300x450",
        backdrops: m.backdrop_path ? [`https://image.tmdb.org/t/p/original${m.backdrop_path}`] : [],
        genres: m.genres ? m.genres.map(g => g.name) : (m.genre_ids ? m.genre_ids.map(String) : []),
        
        rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : 0,
        voteCount: m.vote_count || 0,
        
        director: director,
        writers: writers,
        actors: actors,
        
        trailerLink: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
    };
};

const getSingleMovie = async (req, res) => {
    try {
        const { imdbId } = req.params;
        let movie = await Movie.findOne({ imdbId: imdbId }).populate('reviewIds');

        if (!movie) {
            try {
                const detailRes = await axios.get(`${baseURL}/movie/${imdbId}?api_key=${apiKey}&language=vi-VN&append_to_response=credits,videos`);
                let m = detailRes.data;
                let videos = m.videos?.results || [];

                if (!m.overview || m.overview.trim() === "") {
                    const enRes = await axios.get(`${baseURL}/movie/${imdbId}?api_key=${apiKey}&language=en-US`);
                    m.overview = enRes.data.overview;
                }

                const hasTrailer = videos.some(v => v.site === "YouTube" && v.type === "Trailer");
                if (!hasTrailer) {
                    const enVideoRes = await axios.get(`${baseURL}/movie/${imdbId}/videos?api_key=${apiKey}&language=en-US`);
                    const enVideos = enVideoRes.data.results || [];
                    videos = [...videos, ...enVideos];
                }

                const mappedData = mapToModel(m, videos);
                
                const newMovie = new Movie(mappedData);
                movie = await newMovie.save();

            } catch (tmdbError) {
                console.error("Lỗi TMDB:", tmdbError.message);
                return res.status(404).json({ message: "Phim không tồn tại trên TMDB" });
            }
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getHomeMovies = async (req, res) => {
    try {
        const [trendingRes, topRatedRes, upComingRes] = await Promise.all([
            axios.get(`${baseURL}/movie/popular?api_key=${apiKey}&language=vi-VN&page=1`),
            axios.get(`${baseURL}/movie/top_rated?api_key=${apiKey}&language=vi-VN&page=1`),
            axios.get(`${baseURL}/movie/upcoming?api_key=${apiKey}&language=vi-VN&page=1`)
        ]);

        const simpleMap = (list) => list.map(m => mapToModel(m));
        res.status(200).json({
            status: "success",
            data: {
                trending: simpleMap(trendingRes.data.results || []),
                topRated: simpleMap(topRatedRes.data.results || []),
                newReleases: simpleMap(upComingRes.data.results || [])
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    getMovies,
    getSingleMovie,
    getHomeMovies
};