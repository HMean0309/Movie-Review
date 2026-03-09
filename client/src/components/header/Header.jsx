import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideoSlash, faSearch, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Nav, Navbar, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    }

    return (
        <Navbar bg="black" variant="dark" expand="lg" className="py-3 border-bottom border-secondary sticky-top">
            <Container fluid>
                <Navbar.Brand href="/" style={{color: '#e50914', fontWeight: 'bold', fontSize: '1.5rem'}}>
                    <FontAwesomeIcon icon={faVideoSlash} /> PotatoRottens
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                        <NavLink className="nav-link" to="/">Trang chủ</NavLink>
                        <NavLink className="nav-link" to="/search">
                            <FontAwesomeIcon icon={faSearch} className="me-1"/> Tìm kiếm
                        </NavLink>
                        <NavLink className="nav-link" to="/watch-list">Theo dõi</NavLink>
                    </Nav>

                    {user ? (
                        <div className="d-flex align-items-center">
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="dark" id="dropdown-basic" className="d-flex align-items-center border-0">
                                    <div className="bg-danger rounded-circle d-flex justify-content-center align-items-center me-2" style={{width: '35px', height: '35px'}}>
                                        <FontAwesomeIcon icon={faUser} className="text-white" />
                                    </div>
                                    <span className="fw-bold text-white">
                                        {user.username || user.sub} {/* Fallback nếu không có username */}
                                    </span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant="dark">
                                    <Dropdown.Item onClick={() => navigate('/watch-list')}>
                                        Phim yêu thích
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="text-danger fw-bold">
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2"/> Đăng xuất
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    ) : (
                        <div>
                            <Button variant="outline-light" className="me-2 fw-bold" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </Button>
                            <Button variant="danger" className="fw-bold" onClick={() => navigate('/register')}>
                                Đăng ký
                            </Button>
                        </div>
                    )}
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header