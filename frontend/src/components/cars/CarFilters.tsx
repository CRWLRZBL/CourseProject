import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Accordion } from 'react-bootstrap';
import { carService } from '../../services/api/carService';

interface Filters {
  brand: string;
  bodyType: string;
  minPrice: string;
  maxPrice: string;
  searchQuery: string;
}

interface CarFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

interface Brand {
  brandId: number;
  brandName: string;
}

const CarFilters: React.FC<CarFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      setIsLoading(true);
      const [brandsData, bodyTypesData] = await Promise.all([
        carService.getBrands(),
        carService.getBodyTypes()
      ]);
      
      setBrands(brandsData);
      setBodyTypes(bodyTypesData);
    } catch (error) {
      console.error('Error loading filter data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  const formatPriceValue = (value: string): string => {
    if (!value) return '';
    return parseInt(value).toLocaleString('ru-RU');
  };

  if (isLoading) {
    return (
      <Card className="sticky-filters">
        <Card.Header>
          <h5 className="mb-0">Фильтры</h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            Загрузка фильтров...
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="sticky-filters">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Фильтры</h5>
        {hasActiveFilters() && (
          <Badge bg="primary" pill>
            Активно
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        <Accordion defaultActiveKey="0" flush>
          {/* Поиск */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Поиск</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Поиск по названию</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Марка, модель, цвет..."
                  value={filters.searchQuery}
                  onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                  className="shadow-sm"
                />
                <Form.Text className="text-muted">
                  Найдите автомобиль по названию марки, модели или цвету
                </Form.Text>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          {/* Марка и тип кузова */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Основные параметры</Accordion.Header>
            <Accordion.Body>
              {/* Бренд */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Марка автомобиля</Form.Label>
                <Form.Select
                  value={filters.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="shadow-sm"
                >
                  <option value="">Все марки</option>
                  {brands.map(brand => (
                    <option key={brand.brandId} value={brand.brandName}>
                      {brand.brandName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Тип кузова */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Тип кузова</Form.Label>
                <Form.Select
                  value={filters.bodyType}
                  onChange={(e) => handleInputChange('bodyType', e.target.value)}
                  className="shadow-sm"
                >
                  <option value="">Все типы</option>
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>

          {/* Цена */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>Цена</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Диапазон цен, ₽</Form.Label>
                <Row className="g-2">
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="От"
                      value={filters.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      className="shadow-sm"
                      min="0"
                      step="100000"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="До"
                      value={filters.maxPrice}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                      className="shadow-sm"
                      min="0"
                      step="100000"
                    />
                  </Col>
                </Row>
                <Form.Text className="text-muted">
                  {filters.minPrice || filters.maxPrice ? (
                    <span>
                      Выбран диапазон: 
                      {filters.minPrice && ` от ${formatPriceValue(filters.minPrice)}₽`}
                      {filters.maxPrice && ` до ${formatPriceValue(filters.maxPrice)}₽`}
                    </span>
                  ) : (
                    "Укажите минимальную и максимальную цену"
                  )}
                </Form.Text>
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Кнопки управления фильтрами */}
        <div className="d-grid gap-2 mt-4">
          <Button 
            variant="outline-primary" 
            onClick={handleClearFilters}
            disabled={!hasActiveFilters()}
            size="sm"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Сбросить фильтры
          </Button>
        </div>

        {/* Информация о активных фильтрах */}
        {hasActiveFilters() && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6 className="fw-semibold mb-2">Активные фильтры:</h6>
            <div className="d-flex flex-wrap gap-1">
              {filters.searchQuery && (
                <span className="badge bg-secondary">
                  Поиск: {filters.searchQuery}
                </span>
              )}
              {filters.brand && (
                <span className="badge bg-secondary">
                  Марка: {filters.brand}
                </span>
              )}
              {filters.bodyType && (
                <span className="badge bg-secondary">
                  Кузов: {filters.bodyType}
                </span>
              )}
              {filters.minPrice && (
                <span className="badge bg-secondary">
                  От: {formatPriceValue(filters.minPrice)}₽
                </span>
              )}
              {filters.maxPrice && (
                <span className="badge bg-secondary">
                  До: {formatPriceValue(filters.maxPrice)}₽
                </span>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// Временный компонент Badge так как он не импортирован
const Badge: React.FC<{ bg: string; pill?: boolean; children: React.ReactNode }> = ({ 
  bg, 
  pill, 
  children 
}) => {
  return (
    <span className={`badge bg-${bg} ${pill ? 'rounded-pill' : ''}`}>
      {children}
    </span>
  );
};

export default CarFilters;