import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Car } from '../../services/models/car';
import CarCard from './CarCard';

interface CarListProps {
  cars: Car[];
}

const CarList: React.FC<CarListProps> = ({ cars }) => {
  return (
    <Row>
      {cars.map(car => (
        <Col key={car.carId} xs={12} sm={6} lg={4} className="mb-4">
          <CarCard car={car} />
        </Col>
      ))}
    </Row>
  );
};

export default CarList;