import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Tabs, Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Order } from '../services/models/order';
import { Car } from '../services/models/car';
import { orderService } from '../services/api/orderService';
import { carService } from '../services/api/carService';
import { ORDER_STATUS_LABELS, CAR_STATUS_LABELS, CAR_STATUS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Icon from '../components/common/Icon';
import ErrorAlert from '../components/common/ErrorAlert';
import SalesReportExport from '../components/admin/SalesReportExport';
import CarImport from '../components/admin/CarImport';
import Pagination from '../components/common/Pagination';

type SortField = 'orderId' | 'customerName' | 'carModel' | 'totalPrice' | 'orderStatus';
type CarSortField = 'carId' | 'brandName' | 'modelName' | 'color' | 'basePrice' | 'status';
type SortDirection = 'asc' | 'desc';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ color: '', status: '', vin: '', mileage: 0 });
  
  // Состояния для поиска и фильтрации заказов
  const [orderSearch, setOrderSearch] = useState('');
  const [orderSortField, setOrderSortField] = useState<SortField>('orderId');
  const [orderSortDirection, setOrderSortDirection] = useState<SortDirection>('desc');
  const [orderPage, setOrderPage] = useState(1);
  const orderItemsPerPage = 10;
  
  // Состояния для поиска и фильтрации автомобилей
  const [carSearch, setCarSearch] = useState('');
  const [carStatusFilter, setCarStatusFilter] = useState<string>('all');
  const [carSortField, setCarSortField] = useState<CarSortField>('carId');
  const [carSortDirection, setCarSortDirection] = useState<SortDirection>('desc');
  const [carPage, setCarPage] = useState(1);
  const carItemsPerPage = 10;

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
        carService.getCars(undefined, undefined, true) // Получаем все автомобили, не только доступные
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
      setError(''); // Очищаем предыдущие ошибки
      console.log('Updating order status:', { orderId, newStatus });
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadData(); // Перезагружаем данные
    } catch (err: any) {
      console.error('Error updating order status:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message 
        || err.message 
        || 'Ошибка при обновлении статуса';
      setError(errorMessage);
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setEditForm({
      color: car.color || '',
      status: car.status || '',
      vin: car.vin || '',
      mileage: 0
    });
    setShowEditModal(true);
  };

  const handleSaveCar = async () => {
    if (!editingCar) return;
    
    try {
      await carService.updateCar(editingCar.carId, {
        color: editForm.color,
        status: editForm.status,
        vin: editForm.vin,
        mileage: editForm.mileage || undefined
      });
      setShowEditModal(false);
      setEditingCar(null);
      await loadData();
    } catch (err) {
      setError('Ошибка при обновлении автомобиля');
      console.error('Error updating car:', err);
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

  // Фильтрация и сортировка заказов
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Поиск
    if (orderSearch) {
      const searchLower = orderSearch.toLowerCase();
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchLower) ||
        order.carModel.toLowerCase().includes(searchLower) ||
        order.configuration?.toLowerCase().includes(searchLower) ||
        order.orderId.toString().includes(searchLower)
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any = a[orderSortField];
      let bValue: any = b[orderSortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return orderSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return orderSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, orderSearch, orderSortField, orderSortDirection]);

  // Пагинация заказов
  const paginatedOrders = useMemo(() => {
    const startIndex = (orderPage - 1) * orderItemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + orderItemsPerPage);
  }, [filteredAndSortedOrders, orderPage, orderItemsPerPage]);

  // Фильтрация и сортировка автомобилей
  const filteredAndSortedCars = useMemo(() => {
    let filtered = [...cars];

    // Поиск
    if (carSearch) {
      const searchLower = carSearch.toLowerCase();
      filtered = filtered.filter(car =>
        car.brandName.toLowerCase().includes(searchLower) ||
        car.modelName.toLowerCase().includes(searchLower) ||
        car.color.toLowerCase().includes(searchLower) ||
        car.vin.toLowerCase().includes(searchLower) ||
        car.carId.toString().includes(searchLower)
      );
    }

    // Фильтр по статусу
    if (carStatusFilter !== 'all') {
      filtered = filtered.filter(car => car.status === carStatusFilter);
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any = a[carSortField];
      let bValue: any = b[carSortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return carSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return carSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [cars, carSearch, carStatusFilter, carSortField, carSortDirection]);

  // Пагинация автомобилей
  const paginatedCars = useMemo(() => {
    const startIndex = (carPage - 1) * carItemsPerPage;
    return filteredAndSortedCars.slice(startIndex, startIndex + carItemsPerPage);
  }, [filteredAndSortedCars, carPage, carItemsPerPage]);

  const handleSort = (field: SortField, currentField: SortField, currentDirection: SortDirection, setField: (f: SortField) => void, setDirection: (d: SortDirection) => void) => {
    if (field === currentField) {
      setDirection(currentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setField(field);
      setDirection('asc');
    }
  };

  const handleCarSort = (field: CarSortField) => {
    if (field === carSortField) {
      setCarSortDirection(carSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setCarSortField(field);
      setCarSortDirection('asc');
    }
  };

  const SortIcon = ({ field, sortField, sortDirection }: { field: string; sortField: string; sortDirection: SortDirection }) => {
    if (field !== sortField) return <span className="text-muted ms-1">↕️</span>;
    return sortDirection === 'asc' ? <span className="ms-1">↑</span> : <span className="ms-1">↓</span>;
  };

  // Условные return после всех хуков
  if (!user || user.roleName !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <LoadingSpinner message="Загрузка админ-панели..." />;
  }

  const pendingOrders = orders.filter(order => order.orderStatus === 'Pending');
  const availableCars = cars.filter(car => car.status === 'Available' || car.status === 'В наличии');

  return (
    <div className="admin-page">
      <Container fluid className="px-0">
        <Container fluid>
          {/* Заголовок страницы */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2 text-dark">Админ-панель</h1>
                  <p className="text-dark mb-0" style={{ fontSize: '1.125rem' }}>Управление заказами, автомобилями и отчеты</p>
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
                    <Icon name="dashboard" className="me-2" style={{ verticalAlign: 'middle' }} />
                    Дашборд
                  </Nav.Link>
                  <Nav.Link 
                    active={activeTab === 'orders'} 
                    onClick={() => setActiveTab('orders')}
                    className="px-4 py-3"
                  >
                    <Icon name="inventory_2" className="me-2" style={{ verticalAlign: 'middle' }} />
                    Управление заказами
                  </Nav.Link>
                  <Nav.Link 
                    active={activeTab === 'cars'} 
                    onClick={() => setActiveTab('cars')}
                    className="px-4 py-3"
                  >
                    <Icon name="directions_car" className="me-2" style={{ verticalAlign: 'middle' }} />
                    Управление автомобилями
                  </Nav.Link>
                  <Nav.Link 
                    active={activeTab === 'reports'} 
                    onClick={() => setActiveTab('reports')}
                    className="px-4 py-3"
                  >
                    <Icon name="trending_up" className="me-2" style={{ verticalAlign: 'middle' }} />
                    Отчеты по продажам
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')}>
              
              {/* Дашборд */}
              <Tab eventKey="dashboard" title="Панель управления">
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-light">
                    <h4 className="mb-0">
                      <Icon name="dashboard" className="me-2" style={{ verticalAlign: 'middle' }} />
                      Общая статистика
                    </h4>
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
                            <h3>{formatPrice(
                              orders
                                .filter(order => {
                                  // Выручка считается только по проданным автомобилям
                                  const car = cars.find(c => c.carId === order.carId);
                                  return car?.status === 'Sold' || order.orderStatus === 'Completed';
                                })
                                .reduce((sum, order) => sum + order.totalPrice, 0)
                            )}</h3>
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
                                <Badge 
                                  bg={getStatusVariant(order.orderStatus)}
                                  style={{
                                    backgroundColor: order.orderStatus === 'Pending' ? '#ffc107' : 
                                                     order.orderStatus === 'Confirmed' ? '#17a2b8' : 
                                                     order.orderStatus === 'InProduction' ? '#007bff' : 
                                                     order.orderStatus === 'Completed' ? '#28a745' : 
                                                     order.orderStatus === 'Cancelled' ? '#dc3545' : '#6c757d',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
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
                    <h4 className="mb-0">
                      <Icon name="inventory_2" className="me-2" style={{ verticalAlign: 'middle' }} />
                      Управление заказами
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    {/* Поиск и фильтры */}
                    <Row className="mb-3">
                      <Col md={6}>
                        <InputGroup>
                          <InputGroup.Text>🔍</InputGroup.Text>
                          <Form.Control
                            placeholder="Поиск по клиенту, автомобилю, комплектации или № заказа..."
                            value={orderSearch}
                            onChange={(e) => {
                              setOrderSearch(e.target.value);
                              setOrderPage(1);
                            }}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={6} className="text-end">
                        <small className="text-muted">
                          Найдено: {filteredAndSortedOrders.length} заказов
                        </small>
                      </Col>
                    </Row>

                    <Table responsive>
                      <thead>
                        <tr>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('orderId', orderSortField, orderSortDirection, setOrderSortField, setOrderSortDirection)}
                          >
                            № <SortIcon field="orderId" sortField={orderSortField} sortDirection={orderSortDirection} />
                          </th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('customerName', orderSortField, orderSortDirection, setOrderSortField, setOrderSortDirection)}
                          >
                            Клиент <SortIcon field="customerName" sortField={orderSortField} sortDirection={orderSortDirection} />
                          </th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('carModel', orderSortField, orderSortDirection, setOrderSortField, setOrderSortDirection)}
                          >
                            Автомобиль <SortIcon field="carModel" sortField={orderSortField} sortDirection={orderSortDirection} />
                          </th>
                          <th>Комплектация</th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('totalPrice', orderSortField, orderSortDirection, setOrderSortField, setOrderSortDirection)}
                          >
                            Стоимость <SortIcon field="totalPrice" sortField={orderSortField} sortDirection={orderSortDirection} />
                          </th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleSort('orderStatus', orderSortField, orderSortDirection, setOrderSortField, setOrderSortDirection)}
                          >
                            Статус <SortIcon field="orderStatus" sortField={orderSortField} sortDirection={orderSortDirection} />
                          </th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-5 text-muted">
                              Заказы не найдены
                            </td>
                          </tr>
                        ) : (
                          paginatedOrders.map(order => (
                            <tr key={order.orderId}>
                              <td>#{order.orderId}</td>
                              <td>{order.customerName}</td>
                              <td>{order.carModel}</td>
                              <td>{order.configuration}</td>
                              <td>{formatPrice(order.totalPrice)}</td>
                              <td>
                                <Badge 
                                  bg={getStatusVariant(order.orderStatus)}
                                  style={{
                                    backgroundColor: order.orderStatus === 'Pending' ? '#ffc107' : 
                                                     order.orderStatus === 'Confirmed' ? '#17a2b8' : 
                                                     order.orderStatus === 'InProduction' ? '#007bff' : 
                                                     order.orderStatus === 'Completed' ? '#28a745' : 
                                                     order.orderStatus === 'Cancelled' ? '#dc3545' : '#6c757d',
                                    color: '#fff',
                                    padding: '6px 12px',
                                    fontSize: '0.875rem'
                                  }}
                                >
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
                          ))
                        )
                      }
                      </tbody>
                    </Table>
                    
                    {/* Пагинация заказов */}
                    {filteredAndSortedOrders.length > 0 && (
                      <div className="mt-3">
                        <Pagination
                          currentPage={orderPage}
                          totalPages={Math.ceil(filteredAndSortedOrders.length / orderItemsPerPage)}
                          onPageChange={setOrderPage}
                          itemsPerPage={orderItemsPerPage}
                          totalItems={filteredAndSortedOrders.length}
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              {/* Управление автомобилями */}
              <Tab eventKey="cars" title="Автомобили">
                <Row>
                  <Col md={12} className="mb-4">
                    <CarImport />
                  </Col>
                </Row>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="mb-0">
                        <Icon name="directions_car" className="me-2" style={{ verticalAlign: 'middle' }} />
                        Управление автомобилями
                      </h4>
                      <Button variant="outline-primary" size="sm" onClick={loadData}>
                        Обновить
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* Поиск и фильтры */}
                    <Row className="mb-3">
                      <Col md={4}>
                        <InputGroup>
                          <InputGroup.Text>🔍</InputGroup.Text>
                          <Form.Control
                            placeholder="Поиск по марке, модели, цвету, VIN или ID..."
                            value={carSearch}
                            onChange={(e) => {
                              setCarSearch(e.target.value);
                              setCarPage(1);
                            }}
                          />
                        </InputGroup>
                      </Col>
                      <Col md={3}>
                        <Form.Select
                          value={carStatusFilter}
                          onChange={(e) => {
                            setCarStatusFilter(e.target.value);
                            setCarPage(1);
                          }}
                        >
                          <option value="all">Все статусы</option>
                          {Object.entries(CAR_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={5} className="text-end">
                        <small className="text-muted">
                          Найдено: {filteredAndSortedCars.length} автомобилей
                        </small>
                      </Col>
                    </Row>

                    <Table responsive>
                      <thead>
                        <tr>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleCarSort('carId')}
                          >
                            ID <SortIcon field="carId" sortField={carSortField} sortDirection={carSortDirection} />
                          </th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleCarSort('brandName')}
                          >
                            Марка <SortIcon field="brandName" sortField={carSortField} sortDirection={carSortDirection} />
                          </th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleCarSort('modelName')}
                          >
                            Модель <SortIcon field="modelName" sortField={carSortField} sortDirection={carSortDirection} />
                          </th>
                          <th>Комплектация</th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleCarSort('color')}
                          >
                            Цвет <SortIcon field="color" sortField={carSortField} sortDirection={carSortDirection} />
                          </th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleCarSort('basePrice')}
                          >
                            Цена <SortIcon field="basePrice" sortField={carSortField} sortDirection={carSortDirection} />
                          </th>
                          <th 
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                            onClick={() => handleCarSort('status')}
                          >
                            Статус <SortIcon field="status" sortField={carSortField} sortDirection={carSortDirection} />
                          </th>
                          <th>VIN</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCars.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center py-5 text-muted">
                              Автомобили не найдены
                            </td>
                          </tr>
                        ) : (
                          paginatedCars.map(car => (
                          <tr key={car.carId}>
                            <td>{car.carId}</td>
                            <td>{car.brandName}</td>
                            <td>{car.modelName}</td>
                            <td>{car.configurationName || <span className="text-muted">—</span>}</td>
                            <td>{car.color}</td>
                            <td>{formatPrice(car.basePrice)}</td>
                            <td>
                              <Badge 
                                bg={getStatusVariant(car.status)}
                                style={{
                                  backgroundColor: car.status === 'Available' ? '#28a745' : 
                                                   car.status === 'Reserved' ? '#ffc107' : 
                                                   car.status === 'Sold' ? '#dc3545' : '#6c757d',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {CAR_STATUS_LABELS[car.status] || car.status}
                              </Badge>
                            </td>
                            <td>
                              <code style={{
                                backgroundColor: '#f8f9fa',
                                color: '#212529',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                                border: '1px solid #dee2e6',
                                display: 'inline-block',
                                minWidth: '150px',
                                textAlign: 'center',
                                fontWeight: '500'
                              }}>{car.vin}</code>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleEditCar(car)}
                              >
                                Редактировать
                              </Button>
                            </td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </Table>
                    
                    {/* Пагинация автомобилей */}
                    {filteredAndSortedCars.length > 0 && (
                      <div className="mt-3">
                        <Pagination
                          currentPage={carPage}
                          totalPages={Math.ceil(filteredAndSortedCars.length / carItemsPerPage)}
                          onPageChange={setCarPage}
                          itemsPerPage={carItemsPerPage}
                          totalItems={filteredAndSortedCars.length}
                        />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>

              {/* Отчеты по продажам */}
              <Tab eventKey="reports" title="Отчеты">
                <SalesReportExport />
              </Tab>

            </Tabs>
          </Col>
        </Row>

        {/* Модальное окно редактирования автомобиля */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Редактирование автомобиля #{editingCar?.carId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Модель</Form.Label>
                <Form.Control 
                  type="text" 
                  value={`${editingCar?.brandName} ${editingCar?.modelName}` || ''} 
                  disabled 
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Цвет</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.color}
                  onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  placeholder="Введите цвет"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Статус</Form.Label>
                <Form.Select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value={CAR_STATUS.AVAILABLE}>{CAR_STATUS_LABELS[CAR_STATUS.AVAILABLE]}</option>
                  <option value={CAR_STATUS.RESERVED}>{CAR_STATUS_LABELS[CAR_STATUS.RESERVED]}</option>
                  <option value={CAR_STATUS.SOLD}>{CAR_STATUS_LABELS[CAR_STATUS.SOLD]}</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>VIN</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.vin}
                  onChange={(e) => setEditForm({ ...editForm, vin: e.target.value })}
                  placeholder="Введите VIN"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Пробег</Form.Label>
                <Form.Control
                  type="number"
                  value={editForm.mileage}
                  onChange={(e) => setEditForm({ ...editForm, mileage: parseInt(e.target.value) || 0 })}
                  placeholder="Введите пробег"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleSaveCar}>
              Сохранить
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
    </div>
  );
};

export default Admin;