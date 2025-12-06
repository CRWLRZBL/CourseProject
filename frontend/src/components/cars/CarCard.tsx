import React from 'react';
import { Card, Button, Badge, Spinner } from 'react-bootstrap';
import { Car } from '../../services/models/car';
import { useNavigate } from 'react-router-dom';
import { utils, CAR_STATUS, BODY_TYPE_LABELS, FUEL_TYPE_LABELS } from '../../utils/constants';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleSelectCar = () => {
    // Переходим в конфигуратор с modelId
    navigate(`/configurator?modelId=${car.modelId}`);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card className="h-100 car-card shadow-sm">
      <div className="car-image-container position-relative">
        {!imageLoaded && (
          <div className="image-placeholder d-flex align-items-center justify-content-center"
               style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
            <Spinner animation="border" variant="secondary" size="sm" />
          </div>
        )}
        
        <Card.Img 
          variant="top" 
          src={imageError ? '/images/cars/default.jpg' : `/images/cars/${car.carId}.jpg`}
          alt={`${car.brandName || ''} ${car.modelName || ''}`}
          className="car-card-image"
          style={{ 
            display: imageLoaded ? 'block' : 'none'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        <Badge 
          bg={utils.getStatusVariant(car.status, 'car')} 
          className="position-absolute top-0 end-0 m-2"
        >
          {utils.getStatusLabel(car.status, 'car')}
        </Badge>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="light" text="dark" className="me-2">
            {car.bodyType ? (BODY_TYPE_LABELS[car.bodyType] || car.bodyType) : 'Не указано'}
          </Badge>
          <Badge bg="light" text="dark">
            {car.fuelType ? (FUEL_TYPE_LABELS[car.fuelType] || car.fuelType) : 'Не указано'}
          </Badge>
        </div>
        
        <Card.Title className="h5">
          {car.brandName || 'Не указано'} {car.modelName || 'Не указано'}
        </Card.Title>
        
        <Card.Text className="text-muted small mb-2">
          <strong>Цвет:</strong> {car.color || 'Не указан'}<br />
          <strong>Год:</strong> {car.modelYear || 'Не указан'}<br />
          <strong>Двигатель:</strong> {car.engineCapacity ? `${car.engineCapacity}L` : 'Не указан'}
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="h4 text-primary mb-0">
              {utils.formatPrice(car.basePrice)}
            </span>
          </div>
          
          <Button 
            variant="primary" 
            onClick={handleSelectCar}
            disabled={car.status !== CAR_STATUS.AVAILABLE}
            className="w-100"
          >
            {car.status === CAR_STATUS.AVAILABLE ? 'Выбрать' : 'Недоступно'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;