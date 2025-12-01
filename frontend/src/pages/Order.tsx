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
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Оформление заказа</h1>
          <p className="text-muted">
            Заполните конфигурацию автомобиля и выберите дополнительные опции
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          {success}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          {carId ? (
            <OrderWizard 
              carId={Number(carId)} 
              onOrderCreate={handleOrderCreate}
            />
          ) : (
            <Card>
              <Card.Body className="text-center">
                <h4>Выберите автомобиль для заказа</h4>
                <p className="text-muted mb-3">
                  Перейдите в каталог и выберите автомобиль для оформления заказа
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/catalog')}
                >
                  Перейти в каталог
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Информация о клиенте</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Имя:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Телефон:</strong> {user.phone}</p>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h5 className="mb-0">Процесс заказа</h5>
            </Card.Header>
            <Card.Body>
              <ol className="ps-3">
                <li className="mb-2">Выбор автомобиля</li>
                <li className="mb-2">Конфигурация и опции</li>
                <li className="mb-2">Подтверждение заказа</li>
                <li className="mb-2">Связь с менеджером</li>
                <li>Получение автомобиля</li>
              </ol>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Order;