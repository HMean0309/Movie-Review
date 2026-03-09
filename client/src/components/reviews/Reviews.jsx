import { useEffect, useState, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Badge, Pagination, Alert, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlayCircle, faUser, faClock, faCalendarAlt, faTrash, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';


const Reviews = ({ getMovieData, movie }) => { 
    const revText = useRef();
    let params = useParams();
    const movieId = params.movieId;
    const navigate = useNavigate();
    
    // State
    const [reviews, setReviews] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [rating, setRating] = useState(10); 
    const [averageScore, setAverageScore] = useState(0);
    
    // State cho Trailer Modal
    const [showTrailer, setShowTrailer] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 10; 

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await getMovieData(movieId);
            await fetchReviews(); 
            setIsLoading(false);
        };

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (token && storedUser) {
            setIsLoggedIn(true);
            setCurrentUser(JSON.parse(storedUser));
        }

        fetchData();
    }, [movieId]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/api/v1/reviews/${movieId}`);
            const data = response.data;
            setReviews(data);

            if (data.length > 0) {
                const total = data.reduce((acc, curr) => {
                    const score = Number(curr.ratings) || Number(curr.rating) || 0; 
                    return acc + score;
                }, 0);
                const avg = total / data.length;
                setAverageScore(Number.isInteger(avg) ? avg : avg.toFixed(1));
            } else {
                setAverageScore(0);
            }
        } catch (err) {
            console.error("Lỗi tải review:", err);
        }
    };

    const addReview = async (e) => {
        e.preventDefault();
        const rev = revText.current;
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập để bình luận!");
            navigate("/login");
            return;
        }

        try {
            const config = { headers: { 'auth-token': token } }; 
            await api.post("/api/v1/reviews", { 
                reviewBody: rev.value, 
                imdbId: movieId,
                rating: parseInt(rating)
            }, config);
            rev.value = "";
            setRating(10); 
            await fetchReviews(); 
        } catch (err) {
            alert("Gửi bình luận thất bại.");
        }
    }

    const deleteReview = async (reviewId) => {
        if(!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        const token = localStorage.getItem("token");
        try {
             const config = { headers: { 'auth-token': token } };
             await api.delete(`/api/v1/reviews/${reviewId}`, config);
             await fetchReviews(); 
        } catch (err) {
            alert("Không thể xóa review này.");
        }
    }

    // --- HÀM TÁCH ID YOUTUBE ---
    const getYouTubeID = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Helpers
    const formatTime = (minutes) => {
        if (!minutes) return "N/A";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    if (isLoading || !movie) return <div className="loading-container"><div className="spinner"></div></div>;

    const bgImage = movie.backdrops && movie.backdrops.length > 0 ? movie.backdrops[0] : movie.poster;
    const trailerID = getYouTubeID(movie.trailerLink); // Lấy ID trailer

    return (
        <div>
            {/* HERO SECTION */}
            <div className="movie-hero" style={{ backgroundImage: `url(${bgImage})` }}>
                <Container>
                    <Row className="align-items-center">
                        <Col md={4} className="text-center mb-4 mb-md-0">
                            <div className="poster-container">
                                <img src={movie.poster} alt={movie.title} className="img-fluid w-100" />
                            </div>
                        </Col>
                        
                        <Col md={8} className="text-white">
                            <h1 className="movie-title-vn display-4 mb-0">{movie.title}</h1>
                            <h4 className="original-title fs-5 mb-3">{movie.originalTitle}</h4>
                            
                            <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
                                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 d-flex align-items-center shadow-sm">
                                    <span className="me-2 fw-bold" style={{backgroundColor: '#f5c518', color: 'black', fontSize: '0.8rem'}}>IMDb</span>
                                    {movie.rating > 0 ? movie.rating : "N/A"}
                                </Badge>
                                <span className="d-flex align-items-center text-white-50">
                                    <FontAwesomeIcon icon={faClock} className="me-2"/> {formatTime(movie.runtime)}
                                </span>
                                <span className="d-flex align-items-center text-white-50">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2"/> {movie.releaseDate}
                                </span>
                            </div>

                            <div className="mb-4">
                                {movie.genres?.map((genre, i) => (
                                    <Badge key={i} bg="dark" className="me-2 mb-2 px-3 py-2 border border-secondary fw-normal">
                                        {genre}
                                    </Badge>
                                ))}
                            </div>

                            <div className="mb-4">
                                <h5 className="text-danger fw-bold border-start border-4 border-danger ps-2">Nội dung</h5>
                                <p className="lead fs-6 text-white-50 mt-2" style={{textAlign: 'justify', lineHeight: '1.6'}}>
                                    {movie.overview}
                                </p>
                            </div>
                             
                            {/* NÚT XEM TRAILER */}
                            <div className="mt-4 pt-3 border-top border-secondary">
                                {trailerID ? (
                                    <Button 
                                        variant="danger" 
                                        size="lg" 
                                        className="px-4 shadow-sm hover-scale fw-bold"
                                        onClick={() => setShowTrailer(true)} // Bật Modal
                                    >
                                        <FontAwesomeIcon icon={faPlayCircle} className="me-2"/> Xem Trailer
                                    </Button>
                                ) : (
                                    <Button variant="secondary" disabled>🚫 Chưa có Trailer</Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* REVIEWS SECTION */}
            <Container className="pb-5 mt-5">
                 {/* ... (Phần Review giữ nguyên như cũ) ... */}
                 {/* ... Copy lại phần Review từ code cũ dán vào đây cho gọn ... */}
                 <Row>
                    <Col md={12}>
                        <div className="d-flex align-items-center mb-4 text-white p-3 rounded" style={{backgroundColor: '#111', border: '1px solid #333'}}>
                            <div className="text-center me-4 pe-4 border-end border-secondary">
                                <h1 className={`display-4 fw-bold mb-0 ${averageScore > 0 ? 'text-warning' : 'text-secondary'}`}>
                                    {averageScore > 0 ? averageScore : "--"}
                                </h1>
                                <small className="text-white-50" style={{fontSize: '0.7rem'}}>TRUNG BÌNH</small>
                            </div>
                            <div>
                                <h4 className="mb-1 text-uppercase fw-bold">Đánh giá từ cộng đồng</h4>
                                <p className="text-white-50 mb-0 small">
                                    {reviews.length > 0 ? `Dựa trên ${reviews.length} thành viên` : "Chưa có lượt đánh giá nào"}
                                </p>
                            </div>
                        </div>

                        <div className="review-box p-4 rounded shadow-sm" style={{backgroundColor: '#0a0a0a', border: '1px solid #222'}}>
                            <h5 className="border-bottom border-secondary pb-3 mb-4 text-white">
                                <FontAwesomeIcon icon={faUser} className="text-danger me-2"/> 
                                Viết nhận xét của bạn về <span className="text-danger">{movie.title}</span>
                            </h5>
                            
                            {isLoggedIn ? (
                                <Form onSubmit={addReview} className="mb-5">
                                    <Row className="g-2">
                                        <Col xs="auto">
                                            <Form.Select 
                                                value={rating} 
                                                onChange={(e) => setRating(e.target.value)}
                                                className="bg-dark text-white border-secondary h-100 fw-bold shadow-none"
                                                style={{borderColor: '#444', minWidth: '110px'}}
                                            >
                                                <option value="10">🏆 10/10</option>
                                                <option value="9">⭐ 9/10</option>
                                                <option value="8">😃 8/10</option>
                                                <option value="7">🙂 7/10</option>
                                                <option value="6">😐 6/10</option>
                                                <option value="5">😕 5/10</option>
                                                <option value="4">🥱 4/10</option>
                                                <option value="3">😞 3/10</option>
                                                <option value="2">😡 2/10</option>
                                                <option value="1">🤬 1/10</option>
                                            </Form.Select>
                                        </Col>
                                        <Col>
                                            <Form.Control 
                                                className="review-input bg-dark text-white border-secondary shadow-none" 
                                                as="textarea" 
                                                rows={2}
                                                ref={revText} 
                                                placeholder={`Chia sẻ cảm nghĩ của bạn...`} 
                                                style={{resize: 'none', padding: '12px'}}
                                            />
                                        </Col>
                                        <Col md={12} className="text-end mt-2">
                                            <Button variant="danger" type="submit" size="sm" className="px-4 fw-bold">
                                                <FontAwesomeIcon icon={faPaperPlane} className="me-2"/> Đăng bài
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            ) : (
                                <Alert variant="secondary" className="mb-5 text-center py-2 small">
                                    Vui lòng <span className="text-danger fw-bold cursor-pointer" onClick={() => navigate("/login")} style={{cursor: 'pointer'}}>Đăng nhập</span> để viết đánh giá.
                                </Alert>
                            )}
                            
                            <div className="review-list mt-4">
                                {currentReviews?.length > 0 ? currentReviews.map((r, i) => (
                                    <div key={r._id || i} className="d-flex mb-3 border-bottom border-dark pb-3 review-anim">
                                        <div className="me-3 rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white fw-bold shadow-sm" 
                                             style={{width: '45px', height: '45px', fontSize: '1.1rem', flexShrink: 0}}>
                                            {r.user?.username ? r.user.username.charAt(0).toUpperCase() : "M"}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="text-white fw-bold mb-0 d-flex align-items-center">
                                                        {r.user?.username || "Thành viên ẩn danh"}
                                                        <Badge bg={(r.ratings || r.rating) >= 7 ? "success" : (r.ratings || r.rating) >= 5 ? "warning" : "danger"} 
                                                               className="ms-2 py-1 px-2" style={{fontSize: '0.7rem'}}>
                                                            {r.ratings || r.rating || "?"}/10
                                                        </Badge>
                                                    </h6>
                                                    <small className="text-white-50 d-block mt-1" style={{fontSize: '0.75rem'}}>
                                                        Review phim <span className="text-light fst-italic">{movie.title}</span> • {formatDate(r.createdAt || new Date())}
                                                    </small>
                                                </div>
                                                {currentUser && (currentUser.username === r.user?.username || currentUser.roles?.includes("Admin")) && (
                                                    <Button variant="link" className="text-secondary p-0 small" onClick={() => deleteReview(r._id)} style={{fontSize: '0.8rem', textDecoration: 'none'}}>
                                                        <FontAwesomeIcon icon={faTrash} /> Xóa
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="mb-0 text-light mt-2" style={{whiteSpace: 'pre-wrap', fontSize: '0.95rem', lineHeight: '1.5'}}>
                                                {r.body}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 text-white-50 small">
                                        <p>Chưa có bình luận nào.</p>
                                    </div>
                                )}
                            </div>
                             {reviews.length > reviewsPerPage && (
                                <Pagination className="justify-content-center mt-3 mb-0" size="sm" variant="dark">
                                    <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}/>
                                    {[...Array(totalPages)].map((_, idx) => (
                                        <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                                            {idx + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}/>
                                </Pagination>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* --- TRAILER MODAL --- */}
            <Modal 
                show={showTrailer} 
                onHide={() => setShowTrailer(false)} 
                centered 
                size="xl" // Size to
                contentClassName="bg-black border border-secondary" // Nền đen, viền xám
            >
                <Modal.Header closeButton closeVariant="white" className="border-bottom border-dark">
                    <Modal.Title className="text-white fw-bold">
                        <FontAwesomeIcon icon={faPlayCircle} className="text-danger me-2"/> 
                        Trailer: {movie.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0 bg-black">
                    <div className="ratio ratio-16x9"> {/* Giữ tỉ lệ khung hình 16:9 chuẩn Youtube */}
                        {trailerID && (
                            <iframe 
                                src={`https://www.youtube.com/embed/${trailerID}?autoplay=1&rel=0`} 
                                title="YouTube video player" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default Reviews;