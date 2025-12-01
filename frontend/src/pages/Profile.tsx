import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import OrderList from '../components/orders/OrderList';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  if (user) {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Мой профиль</h1>
          </Col>
        </Row>
        
        <Row>
          <Col lg={4}>
            <div className="bg-light p-4 rounded mb-4">
              <h4>{user.firstName} {user.lastName}</h4>
              <p className="text-muted mb-1">{user.email}</p>
              <p className="text-muted mb-1">{user.phone}</p>
              <p>
                <span className="badge bg-primary">{user.roleName}</span>
              </p>
            </div>
          </Col>
          
          <Col lg={8}>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'orders')}>
              <Tab eventKey="orders" title="Мои заказы">
                <OrderList />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;