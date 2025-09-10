
import '@/pages/user/Home/Home.css';
import HeroSection from '@/pages/user/Home/components/HeroSection';
import RoomsSection from '@/pages/user/Home/components/RoomsSection';
import ServicesSection from '@/pages/user/Home/components/ServicesSection';
import ToursSection from '@/pages/user/Home/components/ToursSection';
import TestimonialsSection from '@/pages/user/Home/components/TestimonialsSection';
import UserLayout from '@/layouts/UserLayout';

function Home() {
  return (
    <UserLayout headerTransparent={false}>
      <div className="home-container">
        <HeroSection />
        <RoomsSection />
        <ServicesSection />
        <ToursSection />
        <TestimonialsSection />
      </div>
    </UserLayout>

  );
}

export default Home;