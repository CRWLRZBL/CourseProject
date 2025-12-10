import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Card, Button } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderWizard from '../components/orders/OrderWizard';
import { orderService } from '../services/api/orderService';
import { carService } from '../services/api/carService';
import { Car } from '../services/models/car';
import Icon from '../components/common/Icon';

const Order: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carId = searchParams.get('carId');
  const modelId = searchParams.get('modelId');
  const configurationId = searchParams.get('configurationId');
  const color = searchParams.get('color');
  const optionIds = searchParams.get('optionIds');

  useEffect(() => {
    // Дожидаемся загрузки пользователя из контекста
    if (isLoading) {
      return;
    }

    // Только после загрузки проверяем авторизацию
    if (!user) {
      navigate('/profile?redirect=order');
      return;
    }

    if (carId) {
      loadCar();
    } else if (modelId) {
      // Если перешли из конфигуратора, не нужно загружать автомобиль
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [carId, modelId, user, isLoading, navigate]);

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
    carId?: number;
    modelId?: number;
    configurationId: number;
    color?: string;
    optionIds: number[];
    totalPrice: number;
  }) => {
    if (!user) {
      setError('Необходимо авторизоваться');
      return;
    }

    try {
      setError(''); // Очищаем предыдущие ошибки
      setSuccess(''); // Очищаем предыдущие успешные сообщения
      
      console.log('Creating order with data:', {
        userId: user.userId,
        carId: orderData.carId,
        modelId: orderData.modelId,
        configurationId: orderData.configurationId,
        color: orderData.color,
        optionIds: orderData.optionIds
      });

      const result = await orderService.createOrder({
        userId: user.userId,
        carId: orderData.carId,
        modelId: orderData.modelId,
        configurationId: orderData.configurationId,
        color: orderData.color,
        optionIds: orderData.optionIds
      });

      console.log('Order created successfully:', result);

      setSuccess(`Заказ №${result.orderId} успешно создан! ${orderData.carId ? '' : 'Автомобиль будет создан со статусом "В ожидании".'}`);
      
      // Перенаправляем на страницу заказов через 2 секунды
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating order:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message 
        || err.message 
        || 'Ошибка при создании заказа. Попробуйте позже.';
      
      setError(errorMessage);
      setSuccess(''); // Очищаем успешное сообщение при ошибке
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
      <Container fluid className="px-0">
        <Container>
          {/* Заголовок страницы */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center mb-2">
                <h1 className="mb-0 me-3 text-dark">Оформление заказа</h1>
                <span className="badge bg-primary fs-6">
                  {modelId && configurationId ? 'Подтверждение заказа' : 'Шаг 2 из 3'}
                </span>
              </div>
              <p className="text-dark mb-0" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
                {modelId && configurationId 
                  ? 'Проверьте параметры автомобиля и подтвердите заказ'
                  : 'Настройте параметры автомобиля и выберите дополнительные опции'
                }
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
              ) : modelId ? (
                <OrderWizard 
                  modelId={Number(modelId)}
                  configurationId={configurationId ? Number(configurationId) : undefined}
                  color={color || undefined}
                  optionIds={optionIds ? optionIds.split(',').map(id => Number(id)) : []}
                  onOrderCreate={handleOrderCreate}
                />
              ) : (
                <Card className="text-center py-5">
                  <Card.Body>
                    <div className="display-1 mb-3">
                      <Icon name="directions_car" style={{ fontSize: '4rem' }} />
                    </div>
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
                      <Icon name="person" className="me-2" style={{ verticalAlign: 'middle' }} />
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
                      <Icon name="description" className="me-2" style={{ verticalAlign: 'middle' }} />
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
      </Container>
    </div>
  );
};

export default Order;