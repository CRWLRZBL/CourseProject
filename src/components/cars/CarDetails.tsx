import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Car, Configuration } from '../../services/models/car';
import { carService } from '../../services/api/carService';
import { utils, CAR_STATUS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

interface CarDetailsProps {
  carId: number;
}

const CarDetails: React.FC<CarDetailsProps> = ({ carId }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadCarDetails();
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      const [carData, configsData] = await Promise.all([
        carService.getCarById(carId),
        carService.getConfigurations(carId)
      ]);
      
      setCar(carData);
      setConfigurations(configsData);
    } catch (err) {
      setError('Ошибка при загрузке данных автомобиля');
      console.error('Error loading car details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = () => {
    navigate(`/order?carId=${carId}`);
  };

  const getCarImages = () => {
    if (!car) return [];
    
    // В реальном приложении здесь был бы массив изображений из API
    return [
      `/images/cars/${carId}.jpg`,
      `/images/cars/${carId}_2.jpg`,
      `/images/cars/${carId}_3.jpg`
    ].filter((_, index) => index === 0 || Math.random() > 0.5); // Имитация наличия доп. фото
  };

  if (loading) {
    return <LoadingSpinner message="Загрузка данных автомобиля..." />;
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-2">
          <Button variant="outline-danger" onClick={loadCarDetails}>
            Попробовать снова
          </Button>
        </div>
      </Alert>
    );
  }

  if (!car) {
    return (
      <Alert variant="warning">
        Автомобиль не найден
      </Alert>
    );
  }

  const carImages = getCarImages();
  const mainImage = carImages[selectedImage] || '/images/cars/Granta/Sedan-Ледниковый.png';

  return (
    <div className="car-details">
      <Row>
        {/* Галерея изображений */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Body className="p-3">
              <div className="main-image mb-3 text-center">
                <img
                  src={mainImage}
                  alt={`${car.brandName || ''} ${car.modelName || ''}`}
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px', width: 'auto' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cars/Granta/Sedan-Ледниковый.png';
                  }}
                />
              </div>
              
              {carImages.length > 1 && (
                <div className="image-thumbnails d-flex justify-content-center gap-2">
                  {carImages.map((image, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        width: '60px',
                        height: '60px',
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #0d6efd' : '1px solid #dee2e6',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={image}
                        alt={`${car.brandName} ${car.modelName} ${index + 1}`}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/cars/Granta/Sedan-Ледниковый.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Информация об автомобиле */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Badge 
                    bg={utils.getStatusVariant(car.status, 'car')}
                    className="mb-2"
                  >
                    {utils.getStatusLabel(car.status, 'car')}
                  </Badge>
                  <h2 className="h3 mb-1">{car.brandName || 'Не указано'} {car.modelName || 'Не указано'}</h2>
                  <p className="text-muted mb-0">Год выпуска: {car.modelYear || 'Не указан'}</p>
                </div>
                <div className="text-end">
                  <div className="h3 text-primary mb-0">
                    {utils.formatPrice(car.basePrice)}
                  </div>
                  <small className="text-muted">от</small>
                </div>
              </div>

              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Тип кузова:</span>
                  <strong>{car.bodyType || 'Не указано'}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Цвет:</span>
                  <strong>{car.color || 'Не указан'}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Тип топлива:</span>
                  <strong>{car.fuelType || 'Не указано'}</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between px-0">
                  <span>Объем двигателя:</span>
                  <strong>{car.engineCapacity ? `${car.engineCapacity}L` : 'Не указан'}</strong>
                </ListGroup.Item>
              </ListGroup>

              {/* Доступные комплектации */}
              {configurations.length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-3">Доступные комплектации</h5>
                  <div className="configurations-list">
                    {configurations.map(config => (
                      <div key={config.configurationId} className="border rounded p-3 mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{config.configurationName}</h6>
                            <p className="text-muted small mb-0">{config.description}</p>
                          </div>
                          <div className="text-success fw-bold">
                            +{utils.formatPrice(config.additionalPrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Кнопка заказа */}
              <div className="d-grid">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleOrderClick}
                  disabled={car.status !== CAR_STATUS.AVAILABLE}
                >
                  {car.status === CAR_STATUS.AVAILABLE ? (
                    <>⚙️ Перейти к конфигурации и заказу</>
                  ) : (
                    'Автомобиль недоступен для заказа'
                  )}
                </Button>
              </div>

              {/* Дополнительная информация */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2">📞 Нужна консультация?</h6>
                <p className="small text-muted mb-2">
                  Наши менеджеры помогут подобрать оптимальную комплектацию 
                  и ответят на все ваши вопросы
                </p>
                <Button variant="outline-secondary" size="sm">
                  📞 Заказать звонок
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Характеристики */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Технические характеристики</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Марка:</span>
                      <strong>{car.brandName || 'Не указано'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Модель:</span>
                      <strong>{car.modelName || 'Не указано'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Год выпуска:</span>
                      <strong>{car.modelYear || 'Не указан'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Тип кузова:</span>
                      <strong>{car.bodyType || 'Не указано'}</strong>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Тип топлива:</span>
                      <strong>{car.fuelType || 'Не указано'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Объем двигателя:</span>
                      <strong>{car.engineCapacity ? `${car.engineCapacity} л` : 'Не указан'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span>Цвет:</span>
                      <strong>{car.color || 'Не указан'}</strong>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CarDetails;