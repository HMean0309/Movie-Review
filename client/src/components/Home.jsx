import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import Hero from './hero/Hero';
import 'react-multi-carousel/lib/styles.css';
import { Container } from 'react-bootstrap';


const Home = () => {
  const [loading, setLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 }
  };

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/v1/movies/home-content");
        const data = response.data.data;
        
        if(data) {
           setTrendingMovies(data.trending || []);
           setTopRatedMovies(data.topRated || []);
           setNewReleases(data.newReleases || []);
        }
      } catch (err) {
        console.error("Lỗi Home API:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }

    fetchHomeContent();
  }, []);

  const MovieRow = ({ title, movies }) => (
    <div className="mb-5 movie-row-section">
      <h3 className="text-white mb-3 border-start border-4 border-danger ps-3 fw-bold">{title}</h3>
      <Carousel 
        responsive={responsive} 
        infinite={true} 
        autoPlay={false} 
        itemClass="px-2"
        containerClass="carousel-container"
      >
        {movies?.map((movie) => (
          <div key={movie.imdbId} className="movie-card-hover">
            <Link to={`/Reviews/${movie.imdbId}`} style={{ textDecoration: 'none' }}>
              
              <div className="poster-wrapper position-relative"> 
                <img 
                    src={movie.poster} 
                    alt={movie.title} 
                />
                <div className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 fw-bold rounded-start" style={{fontSize: '0.8rem', zIndex: 5}}>
                  {movie.rating > 0 ? movie.rating : "N/A"}
                </div>
              </div>

              <div className="mt-2">
                  <h6 className="movie-title-vn text-truncate" title={movie.title}>
                      {movie.title}
                  </h6>
                  <small className="original-title text-truncate d-block">
                      {movie.originalTitle || "Unknown"}
                  </small>
              </div>

            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="mt-3 text-white-50">Đang tải phim hay...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* 1. HERO SLIDER (Carousel to đùng ở đầu trang) */}
      <Hero movies={trendingMovies.slice(0, 5)} />

      <Container fluid className="mt-5 pb-5 px-4">
        {/* 2. CÁC HÀNG PHIM (Movie Rows) */}
        {trendingMovies.length > 0 && <MovieRow title="Xu Hướng (Trending)" movies={trendingMovies} />}
        {topRatedMovies.length > 0 && <MovieRow title="Đánh Giá Cao" movies={topRatedMovies} />}
        {newReleases.length > 0 && <MovieRow title="Phim Mới" movies={newReleases} />}
      </Container>
    </div>
  )
}

export default Home