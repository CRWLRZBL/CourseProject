import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Автомобили',
      links: [
        { name: 'LADA Granta', path: '/catalog?brand=LADA&bodyType=Sedan' },
        { name: 'LADA Vesta', path: '/catalog?brand=LADA&bodyType=Sedan' },
        { name: 'LADA Niva', path: '/catalog?brand=LADA&bodyType=SUV' },
        { name: 'LADA Largus', path: '/catalog?brand=LADA&bodyType=StationWagon' }
      ]
    },
    {
      title: 'Покупателям',
      links: [
        { name: 'Каталог', path: '/catalog' },
        { name: 'Оформление заказа', path: '/order' },
        { name: 'Акции и спецпредложения', path: '/catalog' },
        { name: 'Кредит и рассрочка', path: '/catalog' }
      ]
    },
    {
      title: 'Компания',
      links: [
        { name: 'О нас', path: '/' },
        { name: 'Контакты', path: '/' },
        { name: 'Вакансии', path: '/' },
        { name: 'Новости', path: '/' }
      ]
    },
    {
      title: 'Помощь',
      links: [
        { name: 'FAQ', path: '/' },
        { name: 'Доставка и оплата', path: '/' },
        { name: 'Гарантия', path: '/' },
        { name: 'Сервисное обслуживание', path: '/' }
      ]
    }
  ];

  const contactInfo = {
    phone: '+7 (800) 555-35-35',
    email: 'info@lada-autosalon.ru',
    address: 'г. Москва, Ленинградский проспект, д. 64',
    hours: 'Ежедневно с 9:00 до 21:00'
  };

  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <Container>
        {/* Основная часть футера */}
        <Row className="mb-4">
          {/* Информация о компании */}
          <Col lg={4} className="mb-4">
            <div className="footer-brand mb-3">
              <h4 className="text-white mb-2"> {/* Изменено с text-primary на text-white */}
                <Icon name="directions_car" className="me-2" style={{ verticalAlign: 'middle' }} />
                Автосалон LADA
              </h4>
              <p className="footer-text-secondary"> {/* Заменен класс */}
                Официальный дилер автомобилей LADA. 
                Продажа новых автомобилей с гарантией от производителя.
              </p>
            </div>
            
            <div className="contact-info">
              <div className="d-flex align-items-center mb-2">
                <Icon name="phone" className="me-2" style={{ verticalAlign: 'middle' }} />
                <a 
                  href={`tel:${contactInfo.phone}`} 
                  className="text-light text-decoration-none"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="d-flex align-items-center mb-2">
                <Icon name="email" className="me-2" style={{ verticalAlign: 'middle' }} />
                <a 
                  href={`mailto:${contactInfo.email}`} 
                  className="text-light text-decoration-none"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div className="d-flex align-items-start mb-2">
                <Icon name="location_on" className="me-2" style={{ verticalAlign: 'middle' }} />
                <span className="footer-text-secondary">{contactInfo.address}</span> {/* Заменен класс */}
              </div>
              <div className="d-flex align-items-center">
                <Icon name="schedule" className="me-2" style={{ verticalAlign: 'middle' }} />
                <span className="footer-text-secondary">{contactInfo.hours}</span> {/* Заменен класс */}
              </div>
            </div>
          </Col>

          {/* Навигационные ссылки */}
          {footerSections.map((section, index) => (
            <Col key={index} lg={2} md={6} className="mb-4">
              <h6 className="text-white mb-3">{section.title}</h6> {/* Изменено с text-primary на text-white */}
              <Nav className="flex-column">
                {section.links.map((link, linkIndex) => (
                  <Nav.Link 
                    key={linkIndex}
                    as={Link} 
                    to={link.path}
                    className="footer-link px-0 py-1" // Убрал text-muted
                  >
                    {link.name}
                  </Nav.Link>
                ))}
              </Nav>
            </Col>
          ))}
        </Row>

        {/* Социальные сети и доп. информация */}
        <Row className="align-items-center pt-3 border-top border-secondary">
          <Col md={6} className="mb-2 mb-md-0">
            <div className="social-links">
              <span className="footer-text-secondary me-3">Мы в соцсетях:</span> {/* Заменен класс */}
              {[
                { name: 'VK', icon: 'forum', url: '#' },
                { name: 'Telegram', icon: 'send', url: '#' },
                { name: 'YouTube', icon: 'play_circle', url: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="footer-social-link me-3 text-decoration-none" // Заменен класс
                  title={social.name}
                >
                  <Icon name={social.icon} style={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
                </a>
              ))}
            </div>
          </Col>
          
          <Col md={6} className="text-md-end">
            <div className="payment-methods mb-2">
              <span className="footer-text-secondary me-2">Принимаем к оплате:</span> {/* Заменен класс */}
              <Icon name="credit_card" className="footer-social-link me-2" style={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
              <Icon name="smartphone" className="footer-social-link me-2" style={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
              <Icon name="account_balance" className="footer-social-link" style={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
            </div>
          </Col>
        </Row>

        {/* Копирайт */}
        <Row className="mt-3">
          <Col>
            <div className="text-center">
              <p className="footer-text-secondary mb-1"> {/* Заменен класс */}
                © {currentYear} Автосалон LADA. Все права защищены.
              </p>
              <div className="d-flex justify-content-center flex-wrap">
                <Nav.Link as={Link} to="/" className="footer-link small px-2"> {/* Заменен класс */}
                  Политика конфиденциальности
                </Nav.Link>
                <Nav.Link as={Link} to="/" className="footer-link small px-2"> {/* Заменен класс */}
                  Пользовательское соглашение
                </Nav.Link>
                <Nav.Link as={Link} to="/" className="footer-link small px-2"> {/* Заменен класс */}
                  Карта сайта
                </Nav.Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;