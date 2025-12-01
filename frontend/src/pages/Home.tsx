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
      <section className="hero-section bg-dark text-white py-5 mb-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Автомобили LADA
                <br />
                <span className="text-primary">С заботой о вас</span>
              </h1>
              <p className="lead mb-4">
                Официальный дилер LADA. Новые автомобили с гарантией от производителя. 
                Онлайн-заказ и индивидуальный подбор комплектации.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  as={Link} 
                  to="/catalog" 
                  variant="primary" 
                  size="lg"
                  className="px-4"
                >
                  Смотреть каталог
                </Button>
                {!user && (
                  <Button 
                    as={Link} 
                    to="/profile" 
                    variant="outline-light" 
                    size="lg"
                    className="px-4"
                  >
                    Войти в аккаунт
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image mt-4 mt-lg-0">
                <img 
                  src="/images/cars/hero-car.png" 
                  alt="LADA Vesta" 
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cars/4.jpg';
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Популярные модели */}
      <Container className="mb-5">
        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-3">Популярные модели</h2>
            <p className="text-center text-muted lead">
              Самые востребованные автомобили в нашем каталоге
            </p>
          </Col>
        </Row>
        
        <Row>
          {popularModels.map(car => (
            <Col key={car.id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-card">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={car.image}
                    alt={car.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/cars/default.jpg';
                    }}
                  />
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 start-0 m-2"
                  >
                    {car.type}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h5">{car.name}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    Отличное сочетание цены и качества
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h4 text-primary mb-0">
                        {formatPrice(car.price)}
                      </span>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/order?carId=${car.id}`}
                      variant="outline-primary" 
                      className="w-100"
                    >
                      Выбрать
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
                <Card className="h-100 border-0 text-center bg-transparent">
                  <Card.Body>
                    <div className="feature-icon display-1 mb-3">
                      {feature.icon}
                    </div>
                    <Card.Title className="h5">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">
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