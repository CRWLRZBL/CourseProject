import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Card, Button } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderWizard from '../components/orders/OrderWizard';
import { orderService } from '../services/api/orderService';
import { carService } from '../services/api/carService';
import { Car } from '../services/models/car';

const Order: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carId = searchParams.get('carId');

  useEffect(() => {
    if (!user) {
      navigate('/profile?redirect=order');
      return;
    }

    if (carId) {
      loadCar();
    } else {
      setLoading(false);
    }
  }, [carId, user, navigate]);

  const loadCar = async () => {
    try {
      setLoading(true);
      const carData = await carService.getCarById(Number(carId));
      setCar(carData);
    } catch (err) {
      setError('Ошибка при загрузке автомобиля');
      console.error('Error loading car:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreate = async (orderData: {
    carId: number;
    configurationId: number;
    optionIds: number[];
    totalPrice: number;
  }) => {
    if (!user) {
      setError('Необходимо авторизоваться');
      return;
    }

    try {
      const result = await orderService.createOrder({
        ...orderData,
        userId: user.userId
      });

      setSuccess(`Заказ №${result.orderId} успешно создан!`);
      
      // Перенаправляем на страницу заказов через 2 секунды
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при создании заказа');
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert variant="warning">
          Для оформления заказа необходимо авторизоваться
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return <Container className="text-center">Загрузка...</Container>;
  }

  return (
    <div className="order-page">
      <Container>
        {/* Заголовок страницы */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center mb-2">
              <h1 className="mb-0 me-3">Оформление заказа</h1>
              <span className="badge bg-primary fs-6">Шаг 2 из 3</span>
            </div>
            <p className="text-muted mb-0">
              Настройте параметры автомобиля и выберите дополнительные опции
            </p>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
            <Alert.Heading>Ошибка</Alert.Heading>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4">
            <Alert.Heading>Успешно!</Alert.Heading>
            {success}
          </Alert>
        )}

        <Row>
          {/* Основной контент - конфигуратор */}
          <Col lg={8}>
            {carId ? (
              <OrderWizard 
                carId={Number(carId)} 
                onOrderCreate={handleOrderCreate}
              />
            ) : (
              <Card className="text-center py-5">
                <Card.Body>
                  <div className="display-1 mb-3">🚗</div>
                  <h3 className="mb-3">Выберите автомобиль для заказа</h3>
                  <p className="text-muted mb-4">
                    Перейдите в каталог и выберите автомобиль для оформления заказа
                  </p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => navigate('/catalog')}
                  >
                    Перейти в каталог
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Боковая панель */}
          <Col lg={4}>
            <div className="sticky-sidebar">
              {/* Информация о клиенте */}
              <Card className="mb-3 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0 d-flex align-items-center">
                    <span className="me-2">👤</span>
                    Информация о клиенте
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="text-muted small mb-1">Имя</div>
                    <div className="fw-semibold">{user.firstName} {user.lastName}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted small mb-1">Email</div>
                    <div className="fw-semibold">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-muted small mb-1">Телефон</div>
                    <div className="fw-semibold">{user.phone || 'Не указан'}</div>
                  </div>
                </Card.Body>
              </Card>

              {/* Процесс заказа */}
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0 d-flex align-items-center">
                    <span className="me-2">📋</span>
                    Процесс заказа
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="order-steps">
                    <div className="order-step completed mb-3">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <div className="fw-semibold">Выбор автомобиля</div>
                        <div className="text-muted small">Завершено</div>
                      </div>
                    </div>
                    <div className="order-step active mb-3">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <div className="fw-semibold">Конфигурация</div>
                        <div className="text-muted small">В процессе</div>
                      </div>
                    </div>
                    <div className="order-step mb-3">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <div className="fw-semibold">Подтверждение</div>
                        <div className="text-muted small">Ожидание</div>
                      </div>
                    </div>
                    <div className="order-step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <div className="fw-semibold">Получение</div>
                        <div className="text-muted small">Ожидание</div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Order;