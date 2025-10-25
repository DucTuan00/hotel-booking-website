import React from 'react';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const Footer: React.FC = () => {
  return (
    <footer 
      className="bg-black text-white pt-12 sm:pt-16 pb-6 sm:pb-8"
      style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <div 
              className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4"
              style={{ 
                fontFamily: TYPOGRAPHY.fontFamily.primary,
                color: COLORS.primary
              }}
            >
              LION
            </div>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm leading-relaxed">
              Nằm trong khu đô thị cao cấp của thành phố Nha Trang, bạn sẽ có không gian nghỉ dưỡng lý tưởng với khung cảnh thơ mộng và dịch vụ chăm sóc chu đáo.
            </p>
            <div className="text-xs sm:text-sm text-gray-300 space-y-1">
              <p>📧 admin@lionhotel.com</p>
              <p>📞 +84 0258.3834.666</p>
              <p>📍 Số 22/2A Trần Phú - P.Lộc Thọ - TP.Nha Trang</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Liên kết nhanh</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Phòng & Giá</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ẩm thực</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Map */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Vị trí</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14896.08017375022!2d105.846336!3d21.031884!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab47c98c2919%3A0xa0d1de04eb7d5313!2sHanoi%20Lion%20Boutique%20Hotel%20%26%20Spa!5e0!3m2!1svi!2sus!4v1761245560624!5m2!1svi!2sus" 
                width="600" 
                height="450" 
                allowfullscreen="" 
                loading="lazy"
                title="Lion Hotel Boutique"
                className="w-full h-50 sm:h-50 object-cover" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>

        {/* Social Media & Payment */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-300">Theo dõi chúng tôi:</span>
            <div className="flex space-x-2 sm:space-x-3">
              <a href="#" className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-700 transition-colors">f</a>
              <a href="#" className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-500 transition-colors">t</a>
              <a href="#" className="w-6 sm:w-8 h-6 sm:h-8 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-pink-700 transition-colors">i</a>
              <a href="#" className="w-6 sm:w-8 h-6 sm:h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-700 transition-colors">y</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-300">Thanh toán:</span>
            <div className="flex space-x-1 sm:space-x-2">
              <div className="w-6 sm:w-8 h-4 sm:h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center">VISA</div>
              <div className="w-6 sm:w-8 h-4 sm:h-5 bg-red-600 rounded text-xs text-white flex items-center justify-center">MC</div>
              <div className="w-6 sm:w-8 h-4 sm:h-5 bg-blue-800 rounded text-xs text-white flex items-center justify-center">AMEX</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            Copyright © 2025 Lion Lion Boutique Hotel & Spa Nha Trang and all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
