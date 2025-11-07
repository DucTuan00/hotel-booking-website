import "@/pages/user/Home/Home.css";
import HeroSection from "@/pages/user/Home/components/HeroSection";
import SearchSection from "@/pages/user/Home/components/SearchSection";
import RoomsSection from "@/pages/user/Home/components/RoomsSection";
import ServicesSection from "@/pages/user/Home/components/ServicesSection";
import TestimonialsSection from "@/pages/user/Home/components/TestimonialsSection";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <HeroSection />
            <SearchSection />
            <RoomsSection />
            <ServicesSection />
            <TestimonialsSection />
        </div>
    );
}

export default Home;