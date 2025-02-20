import React from 'react';
import HeroSection from '../components/home/HeroSection/HeroSection.jsx';
import SearchBar from '../components/home/SearchBar/SearchBar.jsx';
import FeaturedRooms from '../components/home/FeaturedRooms/FeaturedRooms.jsx';
import Testimonials from '../components/home/Testimonials/Testimonials.jsx';
import Footer from '../components/home/Footer/Footer.jsx';
//import './Home.css'; // Import file CSS riêng cho trang Home (tùy chọn)

function Home() {
  return (
    <div className="home-container">
      <HeroSection />
      <SearchBar />
      <FeaturedRooms />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Home;