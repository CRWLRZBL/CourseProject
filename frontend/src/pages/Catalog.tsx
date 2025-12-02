import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import CarList from '../components/cars/CarList';
import CarFilters from '../components/cars/CarFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import { Car } from '../services/models/car';
import { carService } from '../services/api/carService';

const Catalog: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const [filters, setFilters] = useState({
    brand: '',
    bodyType: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: ''
  });

  useEffect(() => {
    loadCars();
  }, [retryCount]);

  useEffect(() => {
    applyFilters();
  }, [cars, filters]);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError('');
      const carsData = await carService.getCars();
      setCars(carsData);
    } catch (err) {
      setError('Не удалось загрузить каталог автомобилей. Проверьте подключение к интернету.');
      console.error('Error loading cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    if (filters.brand) {
      filtered = filtered.filter(car => 
        car.brandName.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.bodyType) {
      filtered = filtered.filter(car => car.bodyType === filters.bodyType);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(car => car.basePrice >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.basePrice <= Number(filters.maxPrice));
    }

    if (filters.searchQuery) {
      filtered = filtered.filter(car =>
        `${car.brandName} ${car.modelName} ${car.color}`
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      );
    }

    setFilteredCars(filtered);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      bodyType: '',
      minPrice: '',
      maxPrice: '',
      searchQuery: ''
    });
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleErrorDismiss = () => {
    setError('');
  };

  if (loading) {
    return <LoadingSpinner message="Загружаем каталог автомобилей..." />;
  }

  if (error) {
    return (
      <Container>
        <ErrorAlert 
          message={error}
          onRetry={handleRetry}
          onDismiss={handleErrorDismiss}
        />
      </Container>
    );
  }

  return (
    <div className="catalog-page">
      <Container>
        {/* Заголовок страницы */}
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h1 className="display-5 fw-bold mb-2">Каталог автомобилей</h1>
              <p className="text-muted lead mb-0">
                Выберите автомобиль своей мечты из нашего каталога
              </p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={3}>
            <CarFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </Col>
          
          <Col lg={9}>
            <div className="catalog-header mb-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h2 className="h4 mb-1">Доступные модели</h2>
                  <p className="text-muted small mb-0">
                    Найдено: <strong className="text-primary">{filteredCars.length}</strong> автомобилей
                  </p>
                </div>
                {filteredCars.length > 0 && (
                  <Badge bg="primary" className="fs-6 px-3 py-2">
                    {filteredCars.length} {filteredCars.length === 1 ? 'автомобиль' : 
                                           filteredCars.length < 5 ? 'автомобиля' : 'автомобилей'}
                  </Badge>
                )}
              </div>
            </div>

          {filteredCars.length === 0 && cars.length > 0 ? (
            <EmptyState
              title="Ничего не найдено"
              message="Попробуйте изменить параметры фильтрации"
              icon="🔍"
              action={{
                label: 'Сбросить фильтры',
                onClick: clearFilters
              }}
            />
          ) : filteredCars.length === 0 ? (
            <EmptyState
              title="Каталог пуст"
              message="В данный момент нет доступных автомобилей"
              icon="🚗"
            />
          ) : (
            <CarList cars={filteredCars} />
          )}
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Catalog;