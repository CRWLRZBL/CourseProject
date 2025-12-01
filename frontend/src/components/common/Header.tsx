import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🚗 AutoSalon
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/catalog">
              Каталог
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/order">
                Оформить заказ
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <NavDropdown title={`${user.firstName} ${user.lastName}`} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  👤 Мой профиль
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {user.roleName === 'Admin' && (
                  <>
                    <NavDropdown.Item as={Link} to="/admin">
                      🛠️ Админ-панель
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  🚪 Выйти
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/profile">
                Войти
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;