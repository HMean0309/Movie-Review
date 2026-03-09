import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilm } from '@fortawesome/free-solid-svg-icons';
import { Link, useSearchParams } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
    const [movies, setMovies] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            setSearchText(query);
            fetchMovies(query);
        }
    }, []);

    // Hàm gọi API tìm kiếm
    const fetchMovies = async (query) => {
        if (!query.trim()) {
            setMovies([]);
            return;
        }
        
        setLoading(true);
        try {
            // Gọi API với limit=30
            const response = await api.get(`/api/v1/movies?title=${query}&limit=30`);
            setMovies(response.data.data || []); 
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
        }
        setLoading(false);
    };

    // Xử lý khi người dùng gõ (Debounce: Đợi 0.5s sau khi ngừng gõ mới tìm)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchText) {
                setSearchParams({ q: searchText });
                fetchMovies(searchText);
            } else {
                setMovies([]);
                setSearchParams({});
            }
        }, 500); // 500ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    return (
        <Container className="py-5 search-page-container">
            {/* 1. THANH TÌM KIẾM */}
            <Row className="justify-content-center mb-5">
                <Col md={8}>
                    <InputGroup size="lg">
                        <InputGroup.Text className="bg-dark text-white border-secondary">
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Nhập tên phim muốn tìm..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="bg-dark text-white border-secondary shadow-none"
                            autoFocus
                        />
                    </InputGroup>
                </Col>
            </Row>

            {/* 2. KẾT QUẢ TÌM KIẾM */}
            {loading ? (
                <div className="text-center text-white-50 mt-5">
                    <div className="spinner-border text-danger" role="status"></div>
                    <p className="mt-2">Đang quét dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* Hiển thị lưới phim 5 cột */}
                    {movies.length > 0 ? (
                        <div className="movie-grid">
                            {movies.map((movie) => (
                                <Link to={`/Reviews/${movie.imdbId}`} key={movie.imdbId} className="movie-grid-item text-decoration-none">
                                    <div className="poster-wrapper-search">
                                        <img src={movie.poster} alt={movie.title} />
                                        <div className="hover-info">
                                            <span className="play-btn">▶</span>
                                        </div>
                                    </div>
                                    <h6 className="text-white mt-2 mb-0 text-truncate">{movie.title}</h6>
                                    <small className="text-muted">{movie.releaseDate?.split('-')[0] || 'Unknown'}</small>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        searchText && (
                            <div className="text-center text-white-50 mt-5">
                                <FontAwesomeIcon icon={faFilm} size="3x" className="mb-3" />
                                <h3>Không tìm thấy phim nào</h3>
                                <p>Thử tìm bằng từ khóa tiếng Anh hoặc kiểm tra lỗi chính tả.</p>
                            </div>
                        )
                    )}
                </>
            )}
        </Container>
    );
};

export default SearchPage;