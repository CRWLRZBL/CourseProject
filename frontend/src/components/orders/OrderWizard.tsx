import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { Car, Configuration, AdditionalOption } from '../../services/models/car';
import { carService } from '../../services/api/carService';
import CarConfigurator from '../cars/CarConfigurator';

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
  const [currentConfig, setCurrentConfig] = useState<{
    colorId?: number;
    engineId?: number;
    transmissionId?: number;
    configurationId: number | null;
    optionIds: number[];
    totalPrice: number;
  }>({
    configurationId: null,
    optionIds: [],
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{
    car?: string;
    configurations?: string;
    options?: string;
  }>({});

  useEffect(() => {
    loadData();
  }, [carId]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    setErrors({});
    
    // Загружаем данные независимо друг от друга, чтобы если одна часть упала, другие могли загрузиться
    try {
      const carData = await carService.getCarById(carId);
      setCar(carData);
    } catch (err: any) {
      const errorMessage = err.response?.status === 404 
        ? 'Автомобиль не найден' 
        : 'Не удалось загрузить информацию об автомобиле';
      setErrors(prev => ({ ...prev, car: errorMessage }));
      
      if (import.meta.env.DEV) {
        console.error('Ошибка загрузки автомобиля:', {
          status: err.response?.status,
          message: err.message,
          url: err.config?.url
        });
      }
    }

    try {
      const configsData = await carService.getConfigurations(carId);
      setConfigurations(configsData);
      // Выбираем первую комплектацию по умолчанию
      if (configsData.length > 0) {
        setCurrentConfig(prev => ({
          ...prev,
          configurationId: configsData[0].configurationId,
        }));
      }
    } catch (err: any) {
      let errorMessage = 'Не удалось загрузить комплектации';
      
      if (err.response?.status === 500) {
        // Проверяем, есть ли детали ошибки в ответе
        const errorData = err.response?.data;
        if (typeof errorData === 'string' && errorData.includes('JsonException')) {
          errorMessage = 'Ошибка обработки данных на сервере. Комплектации временно недоступны. Обратитесь в поддержку.';
        } else {
          errorMessage = 'Ошибка сервера при загрузке комплектаций. Попробуйте обновить страницу или обратитесь в поддержку.';
        }
      } else if (err.response?.status === 404) {
        errorMessage = 'Комплектации для этого автомобиля не найдены';
      }
      
      setErrors(prev => ({ ...prev, configurations: errorMessage }));
      
      // Логируем только в режиме разработки и только детали ошибки
      if (import.meta.env.DEV) {
        console.error('Ошибка загрузки комплектаций:', {
          status: err.response?.status,
          message: err.message,
          url: err.config?.url
        });
      }
    }

    try {
      const optionsData = await carService.getAdditionalOptions();
      setOptions(optionsData);
    } catch (err: any) {
      const errorMessage = 'Не удалось загрузить дополнительные опции';
      setErrors(prev => ({ ...prev, options: errorMessage }));
      
      if (import.meta.env.DEV) {
        console.error('Ошибка загрузки опций:', {
          status: err.response?.status,
          message: err.message,
          url: err.config?.url
        });
      }
    }

    setLoading(false);
  };

  const handleConfigurationChange = (config: {
    colorId?: number;
    engineId?: number;
    transmissionId?: number;
    configurationId: number | null;
    optionIds: number[];
    totalPrice: number;
  }) => {
    setCurrentConfig(config);
  };

  const handleCreateOrder = () => {
    if (!currentConfig.configurationId) {
      setError('Выберите комплектацию');
      return;
    }

    onOrderCreate({
      carId,
      configurationId: currentConfig.configurationId,
      optionIds: currentConfig.optionIds,
      totalPrice: currentConfig.totalPrice
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

  if (error || errors.car) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Ошибка загрузки</Alert.Heading>
        <p>{error || errors.car}</p>
        <Button variant="outline-danger" onClick={loadData} className="mt-2">
          Повторить попытку
        </Button>
      </Alert>
    );
  }

  if (!car) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Автомобиль не найден</Alert.Heading>
        <p>Не удалось загрузить информацию об автомобиле. Проверьте правильность ссылки.</p>
        <Button variant="outline-warning" onClick={loadData} className="mt-2">
          Повторить попытку
        </Button>
      </Alert>
    );
  }

  return (
    <div className="order-wizard">
      {/* Информация об автомобиле */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Header className="bg-gradient bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0 d-flex align-items-center">
                <span className="me-2">🚗</span>
                {car.brandName} {car.modelName}
              </h4>
            </Col>
            <Col xs="auto">
              <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                {formatPrice(car.basePrice)}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <div className="d-flex align-items-center">
                <span className="text-muted me-2">Тип кузова:</span>
                <span className="fw-semibold">{car.bodyType}</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-center">
                <span className="text-muted me-2">Год выпуска:</span>
                <span className="fw-semibold">{car.modelYear}</span>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-center">
                <span className="text-muted me-2">VIN:</span>
                <span className="fw-semibold font-monospace small">{car.vin}</span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Конфигуратор */}
      {errors.configurations && (
        <Alert variant="warning" className="mb-3">
          <Alert.Heading>Внимание</Alert.Heading>
          <p className="mb-2">{errors.configurations}</p>
          <Button variant="outline-warning" size="sm" onClick={loadData}>
            Повторить загрузку
          </Button>
        </Alert>
      )}

      {errors.options && (
        <Alert variant="warning" className="mb-3">
          <p className="mb-2">{errors.options}</p>
          <Button variant="outline-warning" size="sm" onClick={loadData}>
            Повторить загрузку
          </Button>
        </Alert>
      )}

      <CarConfigurator
        car={car}
        configurations={configurations}
        options={options}
        onConfigurationChange={handleConfigurationChange}
      />

      {/* Кнопка оформления заказа - sticky внизу */}
      <div className="order-action-bar">
        <Card className="shadow-lg border-0">
          <Card.Body className="p-4">
            <Row className="align-items-center">
              <Col md={6} className="mb-3 mb-md-0">
                {error && (
                  <Alert variant="danger" className="mb-0 py-2">
                    <small>{error}</small>
                  </Alert>
                )}
                {!error && (
                  <div>
                    <div className="text-muted small mb-1">Итоговая стоимость</div>
                    <div className="h3 mb-0 text-primary fw-bold">
                      {formatPrice(currentConfig.totalPrice || car.basePrice)}
                    </div>
                  </div>
                )}
              </Col>
              <Col md={6} className="text-md-end">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleCreateOrder}
                  disabled={!currentConfig.configurationId}
                  className="w-100 w-md-auto px-5"
                >
                  <span className="me-2">✓</span>
                  Оформить заказ
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default OrderWizard;