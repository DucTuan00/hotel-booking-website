import React, { useState } from 'react';
//import './SearchBar.css';
import { Form, Button, Row, Col } from 'react-bootstrap'; // Import Bootstrap Form components

function SearchBar() {
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Xử lý tìm kiếm
    console.log('Tìm kiếm:', { location, checkInDate, checkOutDate, guests });
  };

  return (
    <div className="search-bar">
      <Form onSubmit={handleSubmit}>
        <Row className="align-items-center"> {/* Căn giữa các phần tử theo chiều dọc */}
          <Col sm={3} className="my-1">
            <Form.Control
              type="text"
              placeholder="Địa điểm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Col>
          <Col sm={3} className="my-1">
            <Form.Control
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
          </Col>
          <Col sm={3} className="my-1">
            <Form.Control
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
          </Col>
          <Col sm={2} className="my-1">
            <Form.Control
              type="number"
              placeholder="Số lượng khách"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              min="1"
            />
          </Col>
          <Col xs="auto" className="my-1">
            <Button type="submit">Tìm kiếm</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default SearchBar;