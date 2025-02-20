import React from 'react';
//import './Footer.css'; // CSS cho Footer

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} [Tên Khách Sạn Boutique của bạn]. All rights reserved.</p>
    </footer>
  );
}

export default Footer;