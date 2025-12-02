import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Tabs, Table, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Order } from '../services/models/order';
import { Car } from '../services/models/car';
import { orderService } from '../services/api/orderService';
import { carService } from '../services/api/carService';
import { ORDER_STATUS_LABELS, CAR_STATUS_LABELS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.roleName === 'Admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, carsData] = await Promise.all([
        orderService.getAllOrders(),
        carService.getCars()
      ]);
      setOrders(ordersData);
      setCars(carsData);
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadData(); // Перезагружаем данные
    } catch (err) {
      setError('Ошибка при обновлении статуса');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Confirmed': return 'info';
      case 'InProduction': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!user || user.roleName !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <LoadingSpinner message="Загрузка админ-панели..." />;
  }

  const pendingOrders = orders.filter(order => order.orderStatus === 'Pending');
  const availableCars = cars.filter(car => car.status === 'Available');

  return (
    <div className="admin-page">
      <Container fluid>
        {/* Заголовок страницы */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h1 className="display-5 fw-bold mb-2">Админ-панель</h1>
                <p className="text-muted mb-0">Управление заказами, автомобилями и отчеты</p>
              </div>
              <Badge bg="danger" className="fs-6 px-3 py-2">
                🔐 Администратор
              </Badge>
            </div>
          </Col>
        </Row>

      {error && (
        <ErrorAlert 
          message={error}
          onRetry={loadData}
          onDismiss={() => setError('')}
        />
      )}

      <Row>
        <Col lg={3}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Меню</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Nav variant="pills" className="flex-column">
                <Nav.Link 
                  active={activeTab === 'dashboard'} 
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-3"
                >
                  <span className="me-2">📊</span>
                  Дашборд
                </Nav.Link>
                <Nav.Link 
                  active={activeTab === 'orders'} 
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-3"
                >
                  <span className="me-2">📦</span>
                  Управление заказами
                </Nav.Link>
                <Nav.Link 
                  active={activeTab === 'cars'} 
                  onClick={() => setActiveTab('cars')}
                  className="px-4 py-3"
                >
                  <span className="me-2">🚗</span>
                  Управление автомобилями
                </Nav.Link>
                <Nav.Link 
                  active={activeTab === 'reports'} 
                  onClick={() => setActiveTab('reports')}
                  className="px-4 py-3"
                >
                  <span className="me-2">📈</span>
                  Отчеты по продажам
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')}>
            
            {/* Дашборд */}
            <Tab eventKey="dashboard" title="Дашборд">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-light">
                  <h4 className="mb-0">📊 Общая статистика</h4>
                </Card.Header>
                <Card.Body>
                  
                  <Row className="mt-4">
                    <Col md={3}>
                      <Card className="bg-primary text-white text-center">
                        <Card.Body>
                          <h3>{pendingOrders.length}</h3>
                          <p>Новых заказов</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="bg-success text-white text-center">
                        <Card.Body>
                          <h3>{availableCars.length}</h3>
                          <p>Автомобилей в наличии</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="bg-info text-white text-center">
                        <Card.Body>
                          <h3>{orders.length}</h3>
                          <p>Всего заказов</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="bg-warning text-white text-center">
                        <Card.Body>
                          <h3>{formatPrice(orders.reduce((sum, order) => sum + order.totalPrice, 0))}</h3>
                          <p>Общая выручка</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Последние заказы */}
                  <div className="mt-4">
                    <h5>Последние заказы</h5>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>№</th>
                          <th>Клиент</th>
                          <th>Автомобиль</th>
                          <th>Стоимость</th>
                          <th>Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(order => (
                          <tr key={order.orderId}>
                            <td>#{order.orderId}</td>
                            <td>{order.customerName}</td>
                            <td>{order.carModel}</td>
                            <td>{formatPrice(order.totalPrice)}</td>
                            <td>
                              <Badge bg={getStatusVariant(order.orderStatus)}>
                                {order.orderStatus}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Управление заказами */}
            <Tab eventKey="orders" title="Заказы">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-light">
                  <h4 className="mb-0">📦 Управление заказами</h4>
                </Card.Header>
                <Card.Body>
                  
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>Клиент</th>
                        <th>Автомобиль</th>
                        <th>Комплектация</th>
                        <th>Стоимость</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.orderId}>
                          <td>#{order.orderId}</td>
                          <td>{order.customerName}</td>
                          <td>{order.carModel}</td>
                          <td>{order.configuration}</td>
                          <td>{formatPrice(order.totalPrice)}</td>
                          <td>
                            <Badge bg={getStatusVariant(order.orderStatus)}>
                              {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(order.orderStatus)}>
                              {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                            </Badge>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              {order.orderStatus === 'Pending' && (
                                <>
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => handleStatusUpdate(order.orderId, 'Confirmed')}
                                  >
                                    Подтвердить
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleStatusUpdate(order.orderId, 'Cancelled')}
                                  >
                                    Отменить
                                  </Button>
                                </>
                              )}
                              {order.orderStatus === 'Confirmed' && (
                                <Button 
                                  variant="primary" 
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.orderId, 'InProduction')}
                                >
                                  В производство
                                </Button>
                              )}
                              {order.orderStatus === 'InProduction' && (
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={() => handleStatusUpdate(order.orderId, 'Completed')}
                                >
                                  Завершить
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>

            {/* Управление автомобилями */}
            <Tab eventKey="cars" title="Автомобили">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-light">
                  <h4 className="mb-0">🚗 Управление автомобилями</h4>
                </Card.Header>
                <Card.Body>
                  
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Марка</th>
                        <th>Модель</th>
                        <th>Цвет</th>
                        <th>Цена</th>
                        <th>Статус</th>
                        <th>VIN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map(car => (
                        <tr key={car.carId}>
                          <td>{car.carId}</td>
                          <td>{car.brandName}</td>
                          <td>{car.modelName}</td>
                          <td>{car.color}</td>
                          <td>{formatPrice(car.basePrice)}</td>
                          <td>
                            <Badge bg={getStatusVariant(car.status)}>
                              {CAR_STATUS_LABELS[car.status] || car.status}
                            </Badge>
                          </td>
                          <td>
                            <code>{car.vin}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>

          </Tabs>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Admin;