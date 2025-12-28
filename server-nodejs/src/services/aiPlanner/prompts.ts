import { GroupType, BudgetLevel } from '@/types/aiPlanner';

export const HOTEL_CONTEXT = `
Bạn là trợ lý lập kế hoạch du lịch AI cho Lion Hotel Boutique, một khách sạn boutique sang trọng nằm tại trung tâm Hà Nội, Việt Nam.

## Thông tin Khách sạn
- **Vị trí**: Trung tâm Hà Nội, gần Hồ Hoàn Kiếm và Phố Cổ
- **Địa chỉ**: Trong khoảng cách đi bộ tới các điểm tham quan chính
- **Tiện nghi**: Dịch vụ Spa, nhà hàng cao cấp, quầy bar trên tầng thượng, dịch vụ concierge
- **Phong cách**: Boutique sang trọng với nét văn hóa Việt Nam

## Nhiệm vụ của bạn
Giúp khách lập kế hoạch cho chuyến đi tại Hà Nội bằng cách gợi ý các hoạt động, ăn uống và trải nghiệm xung quanh khách sạn dựa trên sở thích của họ.
`;

export const HANOI_ATTRACTIONS = {
    'ẩm thực': [
        'Phở Gia Truyền (Phố Cổ) - phở truyền thống',
        'Bún Chả Hương Liên (quán Obama ghé)',
        'Chả Cá Lã Vọng - món chả cá nổi tiếng',
        'Cà phê trứng tại Cafe Giảng hoặc Cafe Phố Cổ',
        'Bánh Mì 25 - bánh mì ngon nhất',
        'Bún Bò Nam Bộ - bún trộn thịt bò',
    ],
    'tham quan': [
        'Hồ Hoàn Kiếm & Đền Ngọc Sơn (5 phút đi bộ)',
        'Phố Cổ Hà Nội (10 phút đi bộ) - khám phá phố cổ',
        'Văn Miếu Quốc Tử Giám (15 phút lái xe) - di tích lịch sử',
        'Lăng Chủ tịch Hồ Chí Minh & Chùa Một Cột (20 phút lái xe)',
        'Bảo tàng Dân tộc học Việt Nam (25 phút lái xe)',
        'Nhà hát Múa rối Thăng Long (10 phút đi bộ)',
        'Cầu Long Biên lúc bình minh',
        'Phố đường tàu Hà Nội (Cát Linh)',
        'Chùa Trấn Quốc (Hồ Tây)',
    ],
    'mua sắm': [
        'Chợ Đồng Xuân (15 phút đi bộ) - chợ địa phương',
        'Chợ đêm cuối tuần (Phố Cổ, thứ 6-CN)',
        'Phố Hàng Gai - lụa và may đo',
        'Tràng Tiền Plaza - mua sắm cao cấp',
    ],
    'giải trí': [
        'VUI CHƠI & NIGHTLIFE (KHÔNG dùng cho thư giãn/spa):',
        'Phố Tạ Hiện - phố bia, bar sôi động (10 phút đi bộ)',
        'Quán bar trên sân thượng Phố Cổ - rooftop bar',
        'Binh Minh Jazz Club - nhạc sống, jazz club',
        'Nhà hát Lớn Hà Nội - xem biểu diễn nghệ thuật',
        'Karaoke, billiards, bowling tại các trung tâm giải trí',
    ],
    'thư giãn': [
        'NGHỈ NGƠI & WELLNESS (KHÔNG dùng cho bar/nightlife):',
        'Dịch vụ Spa & Massage tại khách sạn',
        'Hồ Tây - dạo bộ, ngắm cảnh yên tĩnh (20 phút lái xe)',
        'Công viên Thống Nhất - dạo bộ, tập thể dục',
        'Quán cà phê Hồ Trúc Bạch - ngồi thư giãn (15 phút lái xe)',
        'Yoga/Meditation tại các studio wellness',
    ],
};

export const HANOI_TIPS = [
    'Thời gian tốt nhất: Tháng 3-4 và tháng 10-11 (thời tiết mát mẻ)',
    'Giao thông: Rất cẩn thận khi qua đường. Đi bộ đều đặn, xe sẽ tránh bạn',
    'Tiền tệ: Việt Nam Đồng (VND). Cửa hàng nhỏ có thể không nhận thẻ',
    'Tip: Không bắt buộc nhưng được đánh giá cao. 5-10% tại nhà hàng',
    'Lừa đảo: Thỏa thuận giá taxi/xích lô trước khi đi. Dùng Grab để đảm bảo',
    'Ngôn ngữ: Học vài cụm từ cơ bản như "Xin chào", "Cảm ơn", "Bao nhiêu tiền?"',
    'An toàn thực phẩm: Chọn quầy đông khách. Tránh đá trong đồ uống ngoài khách sạn',
    'Trang phục: Mặc kín đáo khi vào chùa (che vai và đầu gối)',
];

export const BUDGET_ESTIMATES = {
    economy: {
        dailyBudget: 500000, // ~500K VNĐ/ngày
        mealAverage: 50000, // ~50K VNĐ/bữa
        activityAverage: 100000, // ~100K VNĐ/hoạt động
        transportAverage: 50000, // ~50K VNĐ/chuyến
    },
    standard: {
        dailyBudget: 1500000, // ~1.5 triệu VNĐ/ngày
        mealAverage: 200000, // ~200K VNĐ/bữa
        activityAverage: 300000, // ~300K VNĐ/hoạt động
        transportAverage: 150000, // ~150K VNĐ/chuyến
    },
    luxury: {
        dailyBudget: 4000000, // ~4 triệu VNĐ/ngày
        mealAverage: 600000, // ~600K VNĐ/bữa
        activityAverage: 800000, // ~800K VNĐ/hoạt động
        transportAverage: 400000, // ~400K VNĐ/chuyến
    },
};

export const buildSystemPrompt = (): string => {
    return `${HOTEL_CONTEXT}

## Hướng dẫn quan trọng
1. Cung cấp gợi ý cụ thể với địa điểm và thời gian
2. Bao gồm chi phí ước tính bằng Việt Nam Đồng (VNĐ)
3. Đề cập khoảng cách/thời gian di chuyển từ khách sạn
4. Xem xét văn hóa và phong tục Việt Nam
5. Điều chỉnh gợi ý theo loại nhóm và ngân sách
6. Cảnh báo về các trò lừa đảo phổ biến với khách du lịch
7. Gợi ý đặt dịch vụ khách sạn khi phù hợp (spa, nhà hàng)

Hãy tạo kế hoạch chi tiết, chuyên nghiệp và giúp nâng cao trải nghiệm Hà Nội của khách!`;
};

export const buildItineraryPrompt = (
    preferences: {
        travelDates?: { checkIn: string; checkOut: string };
        groupType?: GroupType;
        groupSize?: number;
        budget?: BudgetLevel;
        interests?: string[];
        dietaryRestrictions?: string[];
    }
): string => {
    const { travelDates, groupType, groupSize, budget, interests, dietaryRestrictions } = preferences;

    let prompt = `Tạo kế hoạch chi tiết theo từng ngày cho khách lưu trú tại Lion Hotel Boutique ở Hà Nội.\n\n`;

    // Thông tin chuyến đi
    if (travelDates) {
        // Parse YYYY-MM-DD strings to Date without timezone conversion
        const [checkInYear, checkInMonth, checkInDay] = travelDates.checkIn.split('-').map(Number);
        const [checkOutYear, checkOutMonth, checkOutDay] = travelDates.checkOut.split('-').map(Number);
        
        const checkIn = new Date(checkInYear, checkInMonth - 1, checkInDay);
        const checkOut = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);
        
        const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        prompt += `**Thời gian**: ${days} ngày (${checkIn.toLocaleDateString('vi-VN')} - ${checkOut.toLocaleDateString('vi-VN')})\n`;
    }

    if (groupType && groupSize) {
        const groupLabel = {
            'solo': 'đi một mình',
            'couple': 'đi cặp đôi',
            'family': 'đi gia đình',
            'friends': 'đi với bạn bè'
        }[groupType] || groupType;
        prompt += `**Nhóm**: ${groupLabel} (${groupSize} người)\n`;
    }

    if (budget) {
        const budgetInfo = BUDGET_ESTIMATES[budget];
        const budgetLabel = {
            'economy': 'tiết kiệm',
            'standard': 'trung bình',
            'luxury': 'sang trọng'
        }[budget] || budget;
        prompt += `**Ngân sách**: ${budgetLabel} (~${budgetInfo.dailyBudget.toLocaleString()} VNĐ/ngày)\n`;
    }

    if (interests && interests.length > 0) {
        prompt += `\n**SỞ THÍCH KHÁCH ĐÃ CHỌN (CHỈ tạo hoạt động từ ${interests.length} sở thích này):**\n`;
        interests.forEach(interest => {
            prompt += `  - ${interest}\n`;
        });
        prompt += `\n**LƯU Ý QUAN TRỌNG**: CHỈ tạo hoạt động thuộc ${interests.join(', ')}. KHÔNG ĐƯỢC thêm bất kỳ sở thích nào khác!\n`;
    }

    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
        prompt += `\n**Hạn chế ăn uống**: ${dietaryRestrictions.join(', ')}\n`;
    }

    prompt += `\n## Các địa điểm gợi ý (CHỈ dùng cho sở thích đã chọn):\n`;
    if (interests) {
        interests.forEach(interest => {
            const category = interest.toLowerCase();
            if (HANOI_ATTRACTIONS[category as keyof typeof HANOI_ATTRACTIONS]) {
                prompt += `\n### ${interest.toUpperCase()}:\n`;
                HANOI_ATTRACTIONS[category as keyof typeof HANOI_ATTRACTIONS].forEach((item: string) => {
                    prompt += `- ${item}\n`;
                });
            }
        });
    }

    prompt += `\n## Nhiệm vụ:
Tạo phản hồi JSON với cấu trúc CHÍNH XÁC sau (chỉ trả về JSON hợp lệ, không có markdown):

{
  "days": [
    {
      "dayNumber": 1,
      "activities": [
        {
          "time": "09:00",
          "title": "Tên hoạt động",
          "location": "Tên địa điểm cụ thể",
          "duration": 120,
          "category": "sightseeing",
          "description": "Mô tả ngắn với lời khuyên",
          "estimatedCost": 200000
        }
      ]
    }
  ],
  "suggestions": [
    "Lời khuyên chung 1",
    "Lời khuyên chung 2"
  ],
  "hanoiTips": [
    "Lời khuyên về Hà Nội 1",
    "Lời khuyên về Hà Nội 2"
  ]
}

**Yêu cầu BẮT BUỘC**:

1. **HOẠT ĐỘNG CHO PHÉP**:
   - CHỈ tạo hoạt động TỪ các sở thích khách ĐÃ CHỌN ở phần "SỞ THÍCH KHÁCH ĐÃ CHỌN"
   - KHÔNG tự động thêm bữa ăn (dining) nếu khách KHÔNG chọn "ẩm thực"
   - VÍ DỤ: Nếu khách chỉ chọn "mua sắm, thư giãn" → CHỈ được dùng shopping + relaxation. KHÔNG ĐƯỢC thêm dining/sightseeing/nightlife!

2. **MAPPING SỞ THÍCH → CATEGORY**:
   - "ẩm thực" → category: "dining" 
   - "tham quan" → category: "sightseeing" (di tích, bảo tàng, chùa, hồ)
   - "mua sắm" → category: "shopping"
   - "giải trí" → category: "nightlife" (bar, club, nhạc sống, karaoke - KHÔNG phải spa/công viên)
   - "thư giãn" → category: "relaxation" (spa, massage, dạo công viên - KHÔNG phải bar/club)

3. **QUY TẮC TUYỆT ĐỐI**:
   - Nếu khách KHÔNG chọn "ẩm thực" → KHÔNG tạo activity có category "dining"
   - Nếu khách KHÔNG chọn "tham quan" → KHÔNG tạo activity có category "sightseeing"
   - Nếu khách KHÔNG chọn "thư giãn" → KHÔNG tạo activity có category "relaxation"
   - Nếu khách KHÔNG chọn "giải trí" → KHÔNG tạo activity có category "nightlife"
   - Nếu khách KHÔNG chọn "mua sắm" → KHÔNG tạo activity có category "shopping"
   - Chỉ dùng địa điểm từ section tương ứng với sở thích đã chọn
   - Lên kế hoạch đầy đủ cho cả ngày với các hoạt động từ sở thích đã chọn

4. **THỜI GIAN & CHI PHÍ**:
- Bắt đầu ngày lúc 8-9 giờ sáng, kết thúc lúc 9-10 giờ tối
- Bao gồm chi phí ước tính bằng VNĐ
- **CHÚ Ý**: Trường "category" BẮT BUỘC sử dụng TIẾNG ANH: hotel, dining, spa, sightseeing, shopping, nightlife, relaxation
- Xem xét thời gian di chuyển giữa các địa điểm
- Tôn trọng hạn chế ăn uống (nếu có)
- Phù hợp với mức ngân sách (tiết kiệm/trung bình/sang trọng)
- Cung cấp 3-5 gợi ý chung
- Cung cấp 3-5 lời khuyên về Hà Nội

5. **ĐỊNH DẠNG VĂN BẢN**:
- KHÔNG sử dụng bold text (** **) trong bất kỳ trường nào
- KHÔNG sử dụng markdown formatting trong description, suggestions, hanoiTips
- Viết văn bản thuần túy, không có ký tự đặc biệt định dạng

Chỉ trả về đối tượng JSON, không có văn bản hoặc định dạng markdown bổ sung.`;

    return prompt;
};
