import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { USER_ROLE_LABELS } from '../utils/constants';
import LoginForm from '../components/auth/LoginForm';
import OrderList from '../components/orders/OrderList';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  if (user) {
    return (
      <div className="profile-page">
        <Container>
          {/* Заголовок страницы */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2">Мой профиль</h1>
                  <p className="text-muted mb-0">Управление аккаунтом и заказами</p>
                </div>
                <Badge bg="primary" className="fs-6 px-3 py-2">
                  {USER_ROLE_LABELS[user.roleName] || user.roleName}
                </Badge>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col lg={4}>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-gradient bg-primary text-white">
                  <h5 className="mb-0 d-flex align-items-center">
                    <span className="me-2">👤</span>
                    Информация о пользователе
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center mb-4">
                    <div className="user-avatar mb-3">
                      <div className="avatar-circle">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    </div>
                    <h4 className="mb-1">{user.firstName} {user.lastName}</h4>
                  </div>
                  <div className="profile-info">
                    <div className="info-item mb-3">
                      <div className="text-muted small mb-1">Email</div>
                      <div className="fw-semibold">{user.email}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="text-muted small mb-1">Телефон</div>
                      <div className="fw-semibold">{user.phone || 'Не указан'}</div>
                    </div>
                    <div className="info-item">
                      <div className="text-muted small mb-1">Роль</div>
                      <Badge bg="primary" className="px-3 py-2">
                        {USER_ROLE_LABELS[user.roleName] || user.roleName}
                      </Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-light">
                  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'orders')} className="border-0">
                    <Tab eventKey="orders" title={
                      <span className="d-flex align-items-center">
                        <span className="me-2">📦</span>
                        Мои заказы
                      </span>
                    } />
                  </Tabs>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="p-4">
                    <OrderList />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold mb-2">Вход в систему</h1>
              <p className="text-muted">Войдите в свой аккаунт для доступа к заказам</p>
            </div>
            <LoginForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;