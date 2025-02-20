import React from 'react';
//import './Testimonials.css';
import { ListGroup } from 'react-bootstrap'; // Import Bootstrap ListGroup

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    comment: 'Khách sạn tuyệt vời! Dịch vụ chu đáo và phòng ốc sạch sẽ.',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    comment: 'Vị trí đẹp, nhân viên thân thiện. Chắc chắn sẽ quay lại!',
  },
];

function Testimonials() {
  return (
    <div className="testimonials">
      <h2>Khách Hàng Nói Về Chúng Tôi</h2>
      <ListGroup> {/* Sử dụng Bootstrap ListGroup */}
        {testimonials.map((testimonial) => (
          <ListGroup.Item key={testimonial.id}> {/* Sử dụng ListGroup.Item */}
            <h5>{testimonial.name}</h5>
            <p>{testimonial.comment}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Testimonials;