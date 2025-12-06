import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import ModelList from '../components/cars/ModelList';
import CarFilters from '../components/cars/CarFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import { Model } from '../services/models/car';
import { carService } from '../services/api/carService';

const Catalog: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
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
    loadModels();
  }, [retryCount]);

  useEffect(() => {
    applyFilters();
  }, [models, filters]);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError('');
      const modelsData = await carService.getModels();
      setModels(modelsData);
    } catch (err) {
      setError('Не удалось загрузить каталог моделей. Проверьте подключение к интернету.');
      console.error('Error loading models:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...models];

    if (filters.brand) {
      filtered = filtered.filter(model => 
        model.brandName.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.bodyType) {
      filtered = filtered.filter(model => model.bodyType === filters.bodyType);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(model => model.basePrice >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(model => model.basePrice <= Number(filters.maxPrice));
    }

    if (filters.searchQuery) {
      filtered = filtered.filter(model =>
        `${model.brandName} ${model.modelName}`
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      );
    }

    setFilteredModels(filtered);
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
    <Container fluid className="px-0"> 
      <Container>
        {/* Заголовок страницы */}
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <h1 className="display-5 fw-bold mb-2 text-dark">Каталог автомобилей</h1>
                <p className="text-dark lead mb-0" style={{ fontSize: '1.125rem' }}>
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
                      Найдено: <strong className="text-primary">{filteredModels.length}</strong> {filteredModels.length === 1 ? 'модель' : 
                                                                                                filteredModels.length < 5 ? 'модели' : 'моделей'}
                    </p>
                  </div>
                  {filteredModels.length > 0 && (
                    <Badge bg="primary" className="fs-6 px-3 py-2">
                      {filteredModels.length} {filteredModels.length === 1 ? 'модель' : 
                                            filteredModels.length < 5 ? 'модели' : 'моделей'}
                    </Badge>
                  )}
                </div>
              </div>

            {filteredModels.length === 0 && models.length > 0 ? (
              <EmptyState
                title="Ничего не найдено"
                message="Попробуйте изменить параметры фильтрации"
                icon="🔍"
                action={{
                  label: 'Сбросить фильтры',
                  onClick: clearFilters
                }}
              />
            ) : filteredModels.length === 0 ? (
              <EmptyState
                title="Каталог пуст"
                message="В данный момент нет доступных моделей"
                icon="🚗"
              />
            ) : (
              <ModelList models={filteredModels} />
            )}
          </Col>
        </Row>
      </Container>
    </Container>
    </div>
  );
};

export default Catalog;