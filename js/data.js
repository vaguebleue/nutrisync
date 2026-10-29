/* ==========================================================================
   NUTRISYNC – data.js
   Nguồn dữ liệu duy nhất cho sản phẩm, danh mục và thông tin liên hệ.
   Muốn đổi giá / mô tả / thêm món: chỉ cần sửa file này.
   ========================================================================== */

window.NUTRISYNC = window.NUTRISYNC || {};

(function (NS) {
  'use strict';

  /* ------------------------------------------------------------------------
     CẤU HÌNH CHUNG
     ------------------------------------------------------------------------ */
  NS.config = {
    brand: 'NUTRISYNC',
    tagline: 'Ăn uống lành mạnh hơn, chăm sóc bản thân tốt hơn.',
    siteUrl: 'https://nutrisync.vn', // Đổi thành domain thật khi deploy
    currency: 'đ',
    contact: {
      brand: 'NUTRISYNC',
      representative: 'Ông Đỗ Minh Quân',
      role: 'Founder',
      email: 'hello@nutrisync.vn',
      phone: '1900 1234',
      phoneHref: 'tel:19001234',
      address: 'Tầng 2, 227 Nguyễn Văn Cừ, Phường Chợ Quán, TP. Hồ Chí Minh',
      website: 'nutrisync.vn',
      websiteHref: 'https://nutrisync.vn'
    },
    // Mã giảm giá demo – hoạt động hoàn toàn phía client
    coupons: {
      SINHVIEN10: { type: 'percent', value: 10, label: 'Giảm 10% cho sinh viên' },
      NUTRI20: { type: 'percent', value: 20, label: 'Giảm 20% đơn hàng đầu tiên' }
    },
    freeShippingNote: 'Miễn phí giao hàng trong nội thành TP.HCM'
  };

  /* ------------------------------------------------------------------------
     DANH MỤC
     Thứ tự này cũng là thứ tự các section ngoài trang Cửa hàng.
     ------------------------------------------------------------------------ */
  NS.categories = [
    {
      id: 'main',
      title: 'Bữa chính',
      description: 'Bữa ăn tươi chuẩn macros, nạp năng lượng bền bỉ.'
    },
    {
      id: 'snack',
      title: 'Bữa phụ & snack',
      description: 'Snack hạt sấy, nạp năng lượng nhanh, giữ sức bền.'
    },
    {
      id: 'drink',
      title: 'Đồ uống',
      description: 'Nước tươi thanh lọc cơ thể, không đường tinh luyện.'
    }
  ];

  /* ------------------------------------------------------------------------
     SẢN PHẨM
     - price: giá đang bán (VND)
     - oldPrice: giá gạch (nếu có khuyến mãi)
     - macros: thông số nhanh hiển thị trong modal
     - specs: bảng thông tin sản phẩm trong modal
     ------------------------------------------------------------------------ */
  NS.products = [
    /* ---------------------------- BỮA CHÍNH ---------------------------- */
    {
      id: 'salad-ca-ngu',
      category: 'main',
      name: 'Salad cá ngừ',
      price: 45000,
      oldPrice: null,
      tag: 'Bán chạy',
      image: 'assets/img/products/salad-ca-ngu.webp',
      short: 'Salad cá ngừ, bơ tươi trộn sốt mè rang.',
      description:
        'Hộp salad cá ngừ tươi với xà lách giòn, bắp ngọt, cà chua bi, trứng luộc và sốt mè rang béo nhẹ. Một bữa trưa đủ chất, thanh mát và tiện mang theo.',
      macros: { protein: '28g', carbs: '24g', fat: '12g' },
      specs: [
        ['Vị', 'Tươi mát, béo nhẹ từ sốt mè rang'],
        ['Cách dùng', 'Dùng ngay sau khi nhận, trộn đều sốt trước khi ăn'],
        ['Năng lượng', '320 kcal / hộp'],
        ['Khối lượng', '350g'],
        ['Hạn sử dụng', '1 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '35% xà lách hỗn hợp, 25% cá ngừ ngâm dầu, 20% bơ tươi, 15% trứng, sốt mè rang (mè, dầu đậu nành, giấm, đường), cà chua bi.'
    },
    {
      id: 'sandwich-uc-ga',
      category: 'main',
      name: 'Sandwich ức gà',
      price: 60000,
      oldPrice: null,
      tag: 'Giàu protein',
      image: 'assets/img/products/sandwich-uc-ga.webp',
      short: 'Bánh mì nguyên cám kẹp ức gà nướng, trứng và rau củ tươi.',
      description:
        'Sandwich ức gà nướng mềm ẩm, kẹp cùng trứng, xà lách, cà chua và sốt sữa chua trong bánh mì nguyên cám. Bữa sáng hoặc bữa trưa gọn nhẹ nhưng vẫn đủ đạm.',
      macros: { protein: '32g', carbs: '38g', fat: '14g' },
      specs: [
        ['Vị', 'Đậm đà, giòn nhẹ từ bánh nguyên cám'],
        ['Cách dùng', 'Dùng ngay, có thể làm nóng 1–2 phút'],
        ['Năng lượng', '420 kcal / phần'],
        ['Khối lượng', '280g'],
        ['Hạn sử dụng', '1 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '40% bánh mì đen nguyên cám, 30% ức gà nướng, 15% bơ tươi nghiền, 15% trứng, xà lách, cà chua, muối, tiêu.'
    },
    {
      id: 'pasta-bo-bam',
      category: 'main',
      name: 'Pasta bò bằm',
      price: 60000,
      oldPrice: null,
      tag: 'No bụng',
      image: 'assets/img/products/pasta-bo-bam.webp',
      short: 'Pasta sốt bò bằm, rau củ nướng và phô mai Parmesan.',
      description:
        'Pasta nguyên cám sốt bò bằm đậm vị, ăn kèm bông cải, bắp ngọt và một lớp phô mai Parmesan mỏng. Món no bụng cho những ngày lịch học kín.',
      macros: { protein: '30g', carbs: '52g', fat: '16g' },
      specs: [
        ['Vị', 'Đậm đà, chua nhẹ từ sốt cà chua'],
        ['Cách dùng', 'Dùng ngay, có thể làm nóng 2 phút'],
        ['Năng lượng', '480 kcal / hộp'],
        ['Khối lượng', '350g'],
        ['Hạn sử dụng', '1 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '45% mì Ý nguyên cám, 25% thịt bò bằm, cà chua tươi, sốt cà chua, bắp, bông cải xanh, dưa leo,  hành tây, tỏi, lá húng tây (basil), dầu olive, gia vị.'
    },
    {
      id: 'com-lut-bo-lac',
      category: 'main',
      name: 'Cơm lứt bò lúc lắc',
      price: 65000,
      oldPrice: null,
      tag: 'Mới',
      image: 'assets/img/products/com-lut-bo-lac.webp',
      short: 'Cơm gạo lứt, bò lúc lắc mềm, rau củ theo mùa.',
      description:
        'Cơm gạo lứt dẻo thơm ăn cùng bò lúc lắc áp chảo mềm vị, bông cải, bắp và cà rốt. Bữa trưa đủ năng lượng cho những ngày phải học và chạy deadline liên tục.',
      macros: { protein: '34g', carbs: '55g', fat: '18g' },
      specs: [
        ['Vị', 'Bò mềm, sốt tiêu đen đậm vừa'],
        ['Cách dùng', 'Dùng ngay, có thể làm nóng 2 phút'],
        ['Năng lượng', '520 kcal / hộp'],
        ['Khối lượng', '400g'],
        ['Hạn sử dụng', '1 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '40% cơm gạo lứt, 30% thịt bò thăn, ớt chuông, hành tây, cà chua bi, bắp, bông cải xanh, dưa leo, sốt ướp bò lúc lắc, dầu đậu nành, muối, tiêu.'
    },
    {
      id: 'com-lut-tom-nuong',
      category: 'main',
      name: 'Cơm lứt tôm nướng',
      price: 65000,
      oldPrice: null,
      tag: 'Mới',
      image: 'assets/img/products/com-lut-tom-nuong.webp',
      short: 'Cơm gạo lứt, tôm nướng, rau củ và sốt chanh dây.',
      description:
        'Tôm nướng ngọt thịt phủ sốt chanh dây chua dịu, ăn cùng cơm gạo lứt và rau củ nướng. Nhẹ bụng nhưng vẫn đủ đạm cho một ngày dài.',
      macros: { protein: '30g', carbs: '54g', fat: '12g' },
      specs: [
        ['Vị', 'Tôm ngọt, sốt chanh dây chua dịu'],
        ['Cách dùng', 'Dùng ngay, có thể làm nóng 2 phút'],
        ['Năng lượng', '480 kcal / hộp'],
        ['Khối lượng', '400g'],
        ['Hạn sử dụng', '1 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '45% cơm gạo lứt, 25% tôm thẻ nướng, xà lách, cà chua bi, bắp, bông cải xanh, dưa leo, sốt bơ tỏi, dầu thực vật, muối, tiêu, gia vị vừa đủ.'
    },

    /* ------------------------- BỮA PHỤ & SNACK ------------------------- */
    {
      id: 'thanh-hat-nang-luong',
      category: 'snack',
      name: 'Thanh hạt năng lượng',
      price: 20000,
      oldPrice: 25000,
      tag: 'Giảm 20%',
      image: 'assets/img/products/thanh-hat-nang-luong.webp',
      short: 'Thanh ngũ cốc ép từ hạt bí, hướng dương, yến mạch và mật ong tự nhiên.',
      description:
        'Thanh ngũ cốc ép chắc tay với yến mạch, hạt bí xanh, hạt hướng dương và mật ong tự nhiên. Bỏ vào balo để nạp nhanh năng lượng giữa hai ca học.',
      macros: { protein: '5g', carbs: '22g', fat: '8g' },
      specs: [
        ['Vị', 'Ngọt nhẹ mật ong, giòn bùi'],
        ['Cách dùng', 'Xé bao bì và ăn trực tiếp'],
        ['Năng lượng', '180 kcal / thanh'],
        ['Khối lượng', '40g'],
        ['Hạn sử dụng', '3 tháng kể từ ngày sản xuất'],
        ['Bảo quản', 'Nơi khô ráo, tránh ánh nắng trực tiếp']
      ],
      ingredients: '35% yến mạch, 25% hạt bí xanh, 20% hạt hướng dương, 20% mật ong tự nhiên.'
    },
    {
      id: 'snack-hat-bi-xanh',
      category: 'snack',
      name: 'Snack hạt bí xanh',
      price: 35000,
      oldPrice: null,
      tag: 'Giàu protein',
      image: 'assets/img/products/snack-hat-bi-xanh.webp',
      short: 'Hạt bí xanh rang giòn, vị mặn nhẹ, giàu đạm thực vật.',
      description:
        'Hạt bí xanh tuyển chọn, rang giòn và nêm muối biển vừa đủ. Một nắm nhỏ là đủ để cơn đói giữa giờ tan học không còn làm bạn mất tập trung.',
      macros: { protein: '7g', carbs: '3g', fat: '12g' },
      specs: [
        ['Vị', 'Giòn bùi, mặn nhẹ'],
        ['Cách dùng', 'Ăn trực tiếp, dùng trong 7 ngày sau khi mở'],
        ['Năng lượng', '160 kcal / 30g'],
        ['Khối lượng', '100g'],
        ['Hạn sử dụng', '3 tháng kể từ ngày sản xuất'],
        ['Bảo quản', 'Nơi khô ráo, đậy kín sau khi mở']
      ],
      ingredients: '98% hạt bí xanh, 2% muối biển.'
    },
    {
      id: 'hu-hat-ngu-coc',
      category: 'snack',
      name: 'Hũ hạt ngũ cốc',
      price: 60000,
      oldPrice: null,
      tag: 'Ăn vặt lành mạnh',
      image: 'assets/img/products/hu-hat-ngu-coc.webp',
      short: 'Hỗn hợp hạnh nhân, điều, óc chó, nho khô và yến mạch.',
      description:
        'Hũ hạt ngũ cốc trộn sẵn nhiều loại hạt và trái sấy, để trên bàn học để thay thế bánh ngọt. Ăn kèm sữa chua hoặc rắc lên sinh tố cũng rất hợp.',
      macros: { protein: '8g', carbs: '18g', fat: '20g' },
      specs: [
        ['Vị', 'Bùi, giòn, ngọt nhẹ từ nho khô'],
        ['Cách dùng', 'Ăn trực tiếp hoặc dùng cùng sữa chua'],
        ['Năng lượng', '280 kcal / 50g'],
        ['Khối lượng', '300g'],
        ['Hạn sử dụng', '4 tháng kể từ ngày sản xuất'],
        ['Bảo quản', 'Đậy kín nắp, để nơi khô ráo']
      ],
      ingredients: '35% hạt hạnh nhân rang mộc, 35% hạt điều rang mộc, 30% hạt óc chó.'
    },
    {
      id: 'combo-tra-va-hat',
      category: 'snack',
      name: 'Combo trà & hạt',
      price: 75000,
      oldPrice: null,
      tag: 'Combo tiết kiệm',
      image: 'assets/img/products/combo-tra-va-hat.webp',
      short: 'Trà hoa cúc mật ong 100g và hạt điều rang mộc 100g.',
      description:
        'Combo gồm một gói trà hoa cúc mật ong và một gói hạt điều rang mộc. Một bộ đôi dễ thương để tự thưởng cho mình sau giờ học, hoặc làm quà nhỏ cho bạn cùng phòng.',
      macros: { protein: '5g', carbs: '12g', fat: '16g' },
      specs: [
        ['Vị', 'Trà thơm dịu, hạt điều bùi béo'],
        ['Cách dùng', 'Pha trà với nước nóng, dùng kèm hạt điều'],
        ['Năng lượng', '220 kcal / phần'],
        ['Khối lượng', '200g (2 x 100g)'],
        ['Hạn sử dụng', '4 tháng kể từ ngày sản xuất'],
        ['Bảo quản', 'Nơi khô ráo, tránh ánh nắng trực tiếp']
      ],
      ingredients: '75% hạt điều rang mộc, 25% trà hoa cúc mật ong sấy khô.'
    },

    /* ----------------------------- ĐỒ UỐNG ----------------------------- */
    {
      id: 'tra-o-long',
      category: 'drink',
      name: 'Trà ô long',
      price: 35000,
      oldPrice: null,
      tag: 'Ít calo',
      image: 'assets/img/products/tra-o-long.webp',
      short: 'Trà ô long ủ lạnh, thêm hạt chia, không đường tinh luyện.',
      description:
        'Trà ô long ủ lạnh thanh vị, thêm hạt chia lấp lánh. Chai 500ml vừa đủ để mang theo cả buổi học mà không lo nạp thêm đường.',
      macros: { protein: '0g', carbs: '9g', fat: '0g' },
      specs: [
        ['Vị', 'Thanh nhẹ, hậu ngọt tự nhiên'],
        ['Cách dùng', 'Lắc nhẹ trước khi uống, ngon nhất khi lạnh'],
        ['Năng lượng', '45 kcal / chai'],
        ['Khối lượng', '500ml'],
        ['Hạn sử dụng', '7 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '75% trà ô long cold-brew, 15% thạch nha đam, 10% hạt chia.'
    },
    {
      id: 'nuoc-ep-trai-cay',
      category: 'drink',
      name: 'Nước ép trái cây',
      price: 35000,
      oldPrice: null,
      tag: 'Detox',
      image: 'assets/img/products/nuoc-ep-trai-cay.webp',
      short: 'Nước ép táo, dứa, cần tây, chanh và gừng tươi.',
      description:
        'Nước ép lạnh từ táo, dứa, cần tây, chanh và một lát gừng. Vị chua ngọt tự nhiên, không thêm đường, giúp ngày học dài bớt nặng nề.',
      macros: { protein: '2g', carbs: '26g', fat: '1g' },
      specs: [
        ['Vị', 'Chua ngọt tự nhiên, thơm gừng nhẹ'],
        ['Cách dùng', 'Lắc đều, uống ngay sau khi mở'],
        ['Năng lượng', '120 kcal / chai'],
        ['Khối lượng', '350ml'],
        ['Hạn sử dụng', '2 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '45% nước ép táo nguyên chất, 35% nước ép thơm, 20% nước ép cần tây.'
    },
    {
      id: 'sinh-to-whey',
      category: 'drink',
      name: 'Sinh tố whey',
      price: 40000,
      oldPrice: null,
      tag: 'Giàu protein',
      image: 'assets/img/products/sinh-to-whey.webp',
      short: 'Whey protein, bơ, chuối, sữa hạnh nhân và hạt chia.',
      description:
        'Sinh tố whey sánh mịn với bơ, chuối, sữa hạnh nhân và hạt chia. Lựa chọn tiện lợi sau giờ tập hoặc cho những ngày cần thêm đạm mà không muốn ăn nặng.',
      macros: { protein: '22g', carbs: '20g', fat: '7g' },
      specs: [
        ['Vị', 'Béo nhẹ, ngọt tự nhiên từ chuối'],
        ['Cách dùng', 'Lắc đều, uống sau khi tập hoặc bữa phụ'],
        ['Năng lượng', '220 kcal / chai'],
        ['Khối lượng', '350ml'],
        ['Hạn sử dụng', '2 ngày kể từ ngày sản xuất'],
        ['Bảo quản', '2–4°C, tránh ánh nắng trực tiếp']
      ],
      ingredients: '30% bơ tươi, 25% chuối chín, 25% sữa tươi không đường, 10% yến mạch, 10% bột Whey Protein.'
    }
  ];

  /* ------------------------------------------------------------------------
     TIỆN ÍCH DÙNG CHUNG
     ------------------------------------------------------------------------ */
  NS.getProduct = function (id) {
    return NS.products.find(function (product) {
      return product.id === id;
    });
  };

  NS.formatPrice = function (value) {
    return new Intl.NumberFormat('vi-VN').format(value) + NS.config.currency;
  };

  NS.getCategory = function (id) {
    return NS.categories.find(function (category) {
      return category.id === id;
    });
  };
})(window.NUTRISYNC);
