import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🚗',
      title: 'Широкий выбор',
      description: 'Большой каталог новых автомобилей LADA с различными комплектациями'
    },
    {
      icon: '⚙️',
      title: 'Онлайн-конфигуратор',
      description: 'Соберите автомобиль своей мечты с помощью удобного конфигуратора'
    },
    {
      icon: '💰',
      title: 'Лучшие цены',
      description: 'Прямые поставки от производителя гарантируют выгодные условия'
    },
    {
      icon: '📦',
      title: 'Быстрое оформление',
      description: 'Весь процесс заказа от выбора до оформления занимает несколько минут'
    }
  ];

  const popularModels = [
    {
      id: 4,
      name: 'LADA Vesta Седан',
      price: 1239900,
      image: '/images/cars/4.jpg',
      type: 'Sedan'
    },
    {
      id: 1,
      name: 'LADA Granta Седан',
      price: 749900,
      image: '/images/cars/1.jpg',
      type: 'Sedan'
    },
    {
      id: 9,
      name: 'LADA Niva Travel',
      price: 1314000,
      image: '/images/cars/9.jpg',
      type: 'SUV'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="home-page">
      {/* Hero секция */}
      <section className="hero-section text-white py-5 mb-5">
        <div className="hero-background"></div>
        <Container className="position-relative">
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={6}>
              <div className="hero-content">
                <Badge bg="primary" className="mb-3 px-3 py-2 fs-6">
                  🏆 Официальный дилер
                </Badge>
                <h1 className="display-3 fw-bold mb-4">
                  Автомобили LADA
                  <br />
                  <span className="text-warning">С заботой о вас</span>
                </h1>
                <p className="lead mb-4 opacity-90">
                  Новые автомобили с гарантией от производителя. 
                  Онлайн-заказ и индивидуальный подбор комплектации.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    as={Link} 
                    to="/catalog" 
                    variant="primary" 
                    size="lg"
                    className="px-5 shadow-lg"
                  >
                    <span className="me-2">🚗</span>
                    Смотреть каталог
                  </Button>
                  {!user && (
                    <Button 
                      as={Link} 
                      to="/profile" 
                      variant="outline-light" 
                      size="lg"
                      className="px-5"
                    >
                      <span className="me-2">👤</span>
                      Войти в аккаунт
                    </Button>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image mt-4 mt-lg-0">
                <div className="hero-image-wrapper">
                  <img 
                    src="/images/cars/hero-car.png" 
                    alt="LADA Vesta" 
                    className="img-fluid"
                    style={{ maxHeight: '450px', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cars/4.jpg';
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Популярные модели */}
      <Container className="mb-5">
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <Badge bg="light" text="dark" className="mb-3 px-3 py-2">
                🔥 Популярное
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Популярные модели</h2>
              <p className="text-muted lead mb-0">
                Самые востребованные автомобили в нашем каталоге
              </p>
            </div>
          </Col>
        </Row>
        
        <Row>
          {popularModels.map(car => (
            <Col key={car.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-card border-0 overflow-hidden">
                <div className="position-relative car-image-overlay">
                  <Card.Img 
                    variant="top" 
                    src={car.image}
                    alt={car.name}
                    style={{ height: '220px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    className="car-card-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cars/default.jpg';
                    }}
                  />
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 start-0 m-3 px-3 py-2"
                  >
                    {car.type}
                  </Badge>
                  <div className="position-absolute top-0 end-0 m-3">
                    <Badge bg="success" className="px-2 py-1">
                      В наличии
                    </Badge>
                  </div>
                </div>
                <Card.Body className="d-flex flex-column p-4">
                  <Card.Title className="h5 mb-2">{car.name}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1 small mb-3">
                    Отличное сочетание цены и качества
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h3 text-primary mb-0 fw-bold">
                        {formatPrice(car.price)}
                      </span>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/order?carId=${car.id}`}
                      variant="primary" 
                      className="w-100"
                    >
                      <span className="me-2">⚙️</span>
                      Настроить
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <Button 
              as={Link} 
              to="/catalog" 
              variant="outline-secondary" 
              size="lg"
            >
              Посмотреть все модели
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Преимущества */}
      <section className="bg-light py-5">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center mb-3">Почему выбирают нас</h2>
              <p className="text-center text-muted lead">
                Мы делаем процесс покупки автомобиля простым и удобным
              </p>
            </Col>
          </Row>
          
          <Row>
            {features.map((feature, index) => (
              <Col key={index} md={6} lg={3} className="mb-4">
                <Card className="h-100 border-0 text-center shadow-sm feature-card">
                  <Card.Body className="p-4">
                    <div className="feature-icon-wrapper mb-3">
                      <div className="feature-icon display-1">
                        {feature.icon}
                      </div>
                    </div>
                    <Card.Title className="h5 mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA секция */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <Card className="bg-primary text-white border-0 shadow">
              <Card.Body className="py-5">
                <h2 className="display-5 fw-bold mb-3">
                  Готовы выбрать свой автомобиль?
                </h2>
                <p className="lead mb-4 opacity-75">
                  Начните с просмотра каталога или сразу перейдите к конфигуратору
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    as={Link} 
                    to="/catalog" 
                    variant="light" 
                    size="lg"
                    className="px-4"
                  >
                    📋 Смотреть каталог
                  </Button>
                  <Button 
                    as={Link} 
                    to="/order" 
                    variant="outline-light" 
                    size="lg"
                    className="px-4"
                  >
                    ⚙️ Начать конфигурацию
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;