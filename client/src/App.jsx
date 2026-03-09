import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Layout from './components/Layout.jsx';
import Reviews from './components/reviews/Reviews.jsx';
import SearchPage from './components/search/SearchPage.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import api from './api/axiosConfig.js';
import './App.css';

function App() {

  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState();
  const [reviews, setReviews] = useState([]);

  const getMovies = async () => {
    try {
      const response =  await api.get('/api/v1/movies');
      console.log("Dữ liệu lấy được là ", response.data);
      setMovies(response.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu từ server ", err);
    }
  }

  const getMovieData = async (movieId) => {
    try {
      const response = await api.get(`/api/v1/movies/${movieId}`);
      const singleMovie = response.data;
      setMovie(singleMovie);
      setReviews(singleMovie.reviewIds);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu chi tiết phim ", err);
    }
  }

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className = "App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home movies={movies} />} ></Route>
          <Route path="login" element={<Login />} ></Route>
          <Route path="register" element={<Register />} ></Route>

          <Route path="Reviews/:movieId" element= {
            <Reviews
              getMovieData={getMovieData}
              movie={movie}
              reviews={reviews}
              setReviews={setReviews}
            />
          }></Route>
          <Route path="search" element={<SearchPage />} ></Route>
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;