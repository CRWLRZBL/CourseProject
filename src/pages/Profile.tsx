import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Card, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { USER_ROLE_LABELS } from '../utils/constants';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import OrderList from '../components/orders/OrderList';
import { useSearchParams } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [searchParams] = useSearchParams();

  // Определяем, какую вкладку показать по умолчанию (для неавторизованных пользователей)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register' && !user) {
      setActiveTab('register');
    }
  }, [searchParams, user]);

  if (user) {
    return (
      <div className="profile-page">
        <Container fluid className="px-0">
          <Container>
            {/* Заголовок страницы */}
            <Row className="mb-4">
              <Col>
                <div>
                  <h1 className="display-5 fw-bold mb-2 text-dark">Мой профиль</h1>
                  <p className="text-dark mb-0" style={{ fontSize: '1.125rem' }}>Управление аккаунтом и заказами</p>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col lg={4}>
                <Card className="shadow-sm border-0 mb-4">
                  <Card.Header className="bg-gradient bg-primary text-white">
                    <h5 className="mb-0 d-flex align-items-center">
                      <i className="bi bi-person me-2"></i>
                      Информация о пользователе
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <div className="user-avatar mb-3">
                        <div className="avatar-circle">
                          {(user.firstName || '').charAt(0)}{(user.lastName || '').charAt(0) || 'U'}
                        </div>
                      </div>
                      <h4 className="mb-1">{user.firstName || ''} {user.lastName || ''}</h4>
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
                          <i className="bi bi-cart-check me-2"></i>
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
              <h1 className="display-5 fw-bold mb-2">
                {activeTab === 'register' ? 'Регистрация' : 'Вход в систему'}
              </h1>
              <p className="text-muted">
                {activeTab === 'register' 
                  ? 'Создайте аккаунт для доступа к заказам' 
                  : 'Войдите в свой аккаунт для доступа к заказам'}
              </p>
            </div>
            
            <Tabs 
              activeKey={activeTab} 
              onSelect={(k) => setActiveTab(k || 'login')} 
              className="mb-4"
              fill
            >
              <Tab eventKey="login" title="Вход">
                <LoginForm />
              </Tab>
              <Tab eventKey="register" title="Регистрация">
                <RegisterForm />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;