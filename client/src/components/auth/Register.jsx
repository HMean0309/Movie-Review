import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import api from '../../api/axiosConfig';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Validate Client
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }
        if (formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);
        try {
            // 2. Gọi API Backend
            // URL này phải khớp với route bạn khai báo trong server
            const response = await api.post('/api/v1/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // 3. Thành công
            alert("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
            navigate('/login');

        } catch (err) {
            // 4. Xử lý lỗi từ Backend trả về (ví dụ: Trùng email)
            const errorMsg = err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card className="p-4 shadow-lg" style={{ width: "400px", backgroundColor: "#1f1f1f", color: "white", border: "1px solid #333" }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <FontAwesomeIcon icon={faUserPlus} size="3x" className="text-danger mb-3" />
                        <h3 className="fw-bold">Tạo tài khoản</h3>
                        <p className="text-white-50 small">Tham gia cộng đồng PotatoRottens ngay!</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-secondary"><FontAwesomeIcon icon={faUser} /></span>
                                <Form.Control 
                                    type="text" name="username" placeholder="Tên hiển thị" required 
                                    className="bg-dark text-white border-secondary"
                                    value={formData.username} onChange={handleChange}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-secondary"><FontAwesomeIcon icon={faEnvelope} /></span>
                                <Form.Control 
                                    type="email" name="email" placeholder="Email" required 
                                    className="bg-dark text-white border-secondary"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-secondary"><FontAwesomeIcon icon={faLock} /></span>
                                <Form.Control 
                                    type="password" name="password" placeholder="Mật khẩu (tối thiểu 6 ký tự)" required 
                                    className="bg-dark text-white border-secondary"
                                    value={formData.password} onChange={handleChange}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-white border-secondary"><FontAwesomeIcon icon={faLock} /></span>
                                <Form.Control 
                                    type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" required 
                                    className="bg-dark text-white border-secondary"
                                    value={formData.confirmPassword} onChange={handleChange}
                                />
                            </div>
                        </Form.Group>

                        <Button variant="danger" type="submit" className="w-100 fw-bold py-2" disabled={loading}>
                            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
                        </Button>
                    </Form>

                    <div className="text-center mt-4">
                        <small className="text-white-50">
                            Đã có tài khoản? <Link to="/login" className="text-danger fw-bold text-decoration-none">Đăng nhập</Link>
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;