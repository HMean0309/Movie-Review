import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/axiosConfig';

const Login = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post('/api/v1/auth/login', { 
                email: formData.email, 
                password: formData.password 
            });

            if (response.status === 200) {
                // 1. Lưu Token
                const token = response.data.token;
                localStorage.setItem('token', token);

                // 2. Lưu thông tin User (Username, Role...) để hiển thị lên Header
                // Backend trả về: { token: "...", user: { username: "...", ... } }
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // 3. Chuyển hướng về trang chủ
                // alert('Đăng nhập thành công'); // Có thể bỏ alert cho mượt
                navigate('/');
            }
        } catch (err) {
            // Lấy thông báo lỗi từ Backend (ví dụ: "Sai mật khẩu")
            const msg = err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card className="p-4 shadow-lg" style={{ width: "400px", backgroundColor: "#1f1f1f", color: "white", border: "1px solid #333" }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <FontAwesomeIcon icon={faSignInAlt} size="3x" className="text-danger mb-3" />
                        <h3 className="fw-bold">Đăng Nhập</h3>
                        <p className="text-white-50 small">Chào mừng trở lại với PotatoRottens!</p>
                    </div>

                    {/* Hiển thị lỗi nếu có */}
                    {error && <Alert variant="danger" className="py-2 fs-6">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        {/* Email Input */}
                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-secondary">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    className="bg-dark text-white border-secondary"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </Form.Group>

                        {/* Password Input */}
                        <Form.Group className="mb-4">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-secondary">
                                    <FontAwesomeIcon icon={faLock} />
                                </span>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    className="bg-dark text-white border-secondary"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Button variant="danger" type="submit" className="w-100 fw-bold py-2" disabled={loading}>
                            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                        </Button>
                    </Form>

                    <div className="text-center mt-4">
                        <small className="text-white-50">
                            Chưa có tài khoản? <Link to="/register" className="text-danger fw-bold text-decoration-none">Đăng ký ngay</Link>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Login;