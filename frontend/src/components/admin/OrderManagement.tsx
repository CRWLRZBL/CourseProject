import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { Order } from '../../services/models/order';
import { orderService } from '../../services/api/orderService';
import { utils, ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      setError('Ошибка при загрузке заказов');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toString().includes(searchTerm)
      );
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, `Статус изменен администратором на: ${ORDER_STATUS_LABELS[newStatus]}`);
      await loadOrders(); // Перезагружаем данные
    } catch (err) {
      setError('Ошибка при обновлении статуса заказа');
    }
  };

  const getStatusActions = (currentStatus: string) => {
    const actions = [];

    switch (currentStatus) {
      case ORDER_STATUS.PENDING:
        actions.push(
          { status: ORDER_STATUS.CONFIRMED, label: 'Подтвердить', variant: 'success' },
          { status: ORDER_STATUS.CANCELLED, label: 'Отменить', variant: 'danger' }
        );
        break;
      case ORDER_STATUS.CONFIRMED:
        actions.push(
          { status: ORDER_STATUS.IN_PRODUCTION, label: 'В производство', variant: 'primary' },
          { status: ORDER_STATUS.CANCELLED, label: 'Отменить', variant: 'danger' }
        );
        break;
      case ORDER_STATUS.IN_PRODUCTION:
        actions.push(
          { status: ORDER_STATUS.COMPLETED, label: 'Завершить', variant: 'success' }
        );
        break;
    }

    return actions;
  };

  if (loading) {
    return <LoadingSpinner message="Загрузка заказов..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Управление заказами</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={loadOrders}>
            Обновить
          </Button>
        </div>
      </div>

      {error && (
        <ErrorAlert 
          message={error}
          onRetry={loadOrders}
          onDismiss={() => setError('')}
        />
      )}

      {/* Фильтры */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  placeholder="Поиск по клиенту, автомобилю или № заказа..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <small className="text-muted">
                Найдено: {filteredOrders.length} заказов
              </small>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Таблица заказов */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>№ Заказа</th>
                <th>Клиент</th>
                <th>Автомобиль</th>
                <th>Комплектация</th>
                <th>Стоимость</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const statusActions = getStatusActions(order.orderStatus);
                
                return (
                  <tr key={order.orderId}>
                    <td>
                      <strong>#{order.orderId}</strong>
                    </td>
                    <td>{order.customerName}</td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '150px' }}>
                        {order.carModel}
                      </div>
                    </td>
                    <td>{order.configuration}</td>
                    <td className="fw-bold text-primary">
                      {utils.formatPrice(order.totalPrice)}
                    </td>
                    <td>
                      <small>
                        {utils.formatDate(order.orderDate)}
                      </small>
                    </td>
                    <td>
                      <Badge 
                        bg={utils.getStatusVariant(order.orderStatus, 'order')}
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
                        {utils.getStatusLabel(order.orderStatus, 'order')}
                      </Badge>
                    </td>
                    <td>
                      {statusActions.length > 0 ? (
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" size="sm" id="dropdown-basic">
                            Действия
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {statusActions.map(action => (
                              <Dropdown.Item
                                key={action.status}
                                onClick={() => handleStatusUpdate(order.orderId, action.status)}
                                className={`text-${action.variant}`}
                              >
                                {action.label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        <small className="text-muted">Нет действий</small>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-5 text-muted">
              <div className="h4">📋</div>
              <p>Заказы не найдены</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderManagement;