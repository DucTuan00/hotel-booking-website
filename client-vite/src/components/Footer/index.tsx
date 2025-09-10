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
              <img 
                src="https://via.placeholder.com/300x120/374151/9CA3AF?text=Google+Maps"
                alt="Map location"
                className="w-full h-24 sm:h-32 object-cover"
              />
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
