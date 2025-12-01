import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, ListGroup, Badge } from 'react-bootstrap';
import { Car, Configuration, AdditionalOption } from '../../services/models/car';
import { carService } from '../../services/api/carService';

interface OrderWizardProps {
  carId: number;
  onOrderCreate: (orderData: {
    carId: number;
    configurationId: number;
    optionIds: number[];
    totalPrice: number;
  }) => void;
}

const OrderWizard: React.FC<OrderWizardProps> = ({ carId, onOrderCreate }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [options, setOptions] = useState<AdditionalOption[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [carId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [carData, configsData, optionsData] = await Promise.all([
        carService.getCarById(carId),
        carService.getConfigurations(carId),
        carService.getAdditionalOptions()
      ]);
      
      setCar(carData);
      setConfigurations(configsData);
      setOptions(optionsData);
      
      // Выбираем первую комплектацию по умолчанию
      if (configsData.length > 0) {
        setSelectedConfig(configsData[0].configurationId);
      }
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error loading order data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (configId: number) => {
    setSelectedConfig(configId);
  };

  const handleOptionToggle = (optionId: number) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const calculateTotalPrice = (): number => {
    if (!car || !selectedConfig) return 0;

    const basePrice = car.basePrice;
    const config = configurations.find(c => c.configurationId === selectedConfig);
    const configPrice = config?.additionalPrice || 0;
    
    const optionsPrice = selectedOptions.reduce((total, optionId) => {
      const option = options.find(o => o.optionId === optionId);
      return total + (option?.optionPrice || 0);
    }, 0);

    return basePrice + configPrice + optionsPrice;
  };

  const handleCreateOrder = () => {
    if (!selectedConfig) {
      setError('Выберите комплектацию');
      return;
    }

    onOrderCreate({
      carId,
      configurationId: selectedConfig,
      optionIds: selectedOptions,
      totalPrice: calculateTotalPrice()
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="text-center">Загрузка...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!car) {
    return <Alert variant="warning">Автомобиль не найден</Alert>;
  }

  return (
    <div className="order-wizard">
      {/* Информация об автомобиле */}
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">{car.brandName} {car.modelName}</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Цвет:</strong> {car.color}</p>
              <p><strong>Тип кузова:</strong> {car.bodyType}</p>
              <p><strong>Двигатель:</strong> {car.engineCapacity}L {car.fuelType}</p>
            </Col>
            <Col md={6}>
              <p><strong>Базовая цена:</strong> {formatPrice(car.basePrice)}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Выбор комплектации */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Выбор комплектации</h5>
        </Card.Header>
        <Card.Body>
          {configurations.map(config => (
            <Form.Check
              key={config.configurationId}
              type="radio"
              name="configuration"
              id={`config-${config.configurationId}`}
              label={
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{config.configurationName}</strong>
                    <div className="text-muted small">{config.description}</div>
                  </div>
                  <div className="text-success">
                    +{formatPrice(config.additionalPrice)}
                  </div>
                </div>
              }
              checked={selectedConfig === config.configurationId}
              onChange={() => handleConfigChange(config.configurationId)}
              className="mb-3 p-3 border rounded"
            />
          ))}
        </Card.Body>
      </Card>

      {/* Дополнительные опции */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Дополнительные опции</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {options.map(option => (
              <ListGroup.Item key={option.optionId} className="px-0">
                <Form.Check
                  type="checkbox"
                  id={`option-${option.optionId}`}
                  label={
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{option.optionName}</strong>
                        <div className="text-muted small">{option.description}</div>
                        <Badge bg="light" text="dark" className="mt-1">
                          {option.category}
                        </Badge>
                      </div>
                      <div className="text-success">
                        +{formatPrice(option.optionPrice)}
                      </div>
                    </div>
                  }
                  checked={selectedOptions.includes(option.optionId)}
                  onChange={() => handleOptionToggle(option.optionId)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Итоговая стоимость */}
      <Card className="mb-4 bg-light">
        <Card.Body>
          <Row>
            <Col>
              <h4 className="text-primary mb-0">
                Итоговая стоимость: {formatPrice(calculateTotalPrice())}
              </h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleCreateOrder}
                disabled={!selectedConfig}
              >
                Оформить заказ
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderWizard;