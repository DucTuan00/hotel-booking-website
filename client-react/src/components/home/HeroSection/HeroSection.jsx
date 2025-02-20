import React from 'react';
import './HeroSection.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Import Bootstrap components

function HeroSection() {
  return (
    <div className="hero-section">
      <Container>
        <Row>
          <Col md={8} className="hero-content"> {/* Sử dụng Bootstrap Grid */}
            <h1>Chào mừng đến với [Tên Khách Sạn Boutique của bạn]</h1>
            <p>Trải nghiệm sự sang trọng và thoải mái trong một không gian độc đáo.</p>
            <Link to="/rooms">
              <Button variant="primary">Khám phá các phòng</Button> {/* Sử dụng Bootstrap Button */}
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HeroSection;