/* ==========================================================================
   Mock data — لاجورد
   بدون بک‌اند؛ همهٔ داده‌ها محلی و قابل جایگزینی‌اند.
   ========================================================================== */
(function () {
  "use strict";

  var UNSPLASH = "https://images.unsplash.com/";
  function img(id, w) {
    return UNSPLASH + id + "?auto=format&fit=crop&w=" + (w || 600) + "&q=75";
  }

  var IMG = {
    phone1: "photo-1592750475338-74b7b21085ab",
    phone2: "photo-1511707171634-5f897ff02aa9",
    phone3: "photo-1580910051074-3eb694886505",
    tablet: "photo-1544244015-0df4b3ffc6b0",
    laptop1: "photo-1517336714731-489689fd1ca8",
    laptop2: "photo-1496181133206-80ce9b88a853",
    keyboard: "photo-1587829741301-dc798b83add3",
    mouse: "photo-1527864550417-7fd91fc51a46",
    headphones1: "photo-1505740420928-5e560c06d30e",
    headphones2: "photo-1583394838336-acd977736f90",
    airpods: "photo-1600294037681-c80b4cb5b434",
    speaker: "photo-1608043152269-423dbba4e7e1",
    tv: "photo-1593359677879-a4bb92f829d1",
    watch1: "photo-1523275335684-37898b6baf30",
    watch2: "photo-1546868871-7041f2a55e12",
    camera: "photo-1516035069371-29a1b244cc32",
    console: "photo-1606144042614-b2417e99c4e3",
    fridge: "photo-1571175443880-49e1d25b2bc5",
    washer: "photo-1626806787461-102c1bfaaea1",
    coffee: "photo-1517668808822-9ebb02f2a0e6",
    vacuum: "photo-1558317374-067fb5f30001",
    blender: "photo-1570222094114-d054a817e56b",
    microwave: "photo-1585659722983-3a675dabf23d",
    chair: "photo-1567538096630-e0c55bd6374c",
    sneakers: "photo-1542291026-7eec264c27ff",
    backpack: "photo-1553062407-98eeb64c6a62",
    sunglasses: "photo-1511499767150-a48a237f0083",
    perfume: "photo-1541643600914-78b084683601"
  };

  var categories = [
    {
      id: "mobile", title: "موبایل و تبلت", image: img(IMG.phone1, 200),
      children: ["گوشی موبایل", "تبلت", "لوازم جانبی موبایل", "پاوربانک", "قاب و محافظ"]
    },
    {
      id: "laptop", title: "لپ‌تاپ و کامپیوتر", image: img(IMG.laptop1, 200),
      children: ["لپ‌تاپ", "مانیتور", "قطعات کامپیوتر", "ماوس و کیبورد", "هارد و حافظه"]
    },
    {
      id: "audio", title: "صوتی و تصویری", image: img(IMG.headphones1, 200),
      children: ["هدفون و هندزفری", "اسپیکر", "تلویزیون", "ساندبار", "دوربین"]
    },
    {
      id: "watch", title: "ساعت و گجت", image: img(IMG.watch1, 200),
      children: ["ساعت هوشمند", "ساعت مچی", "کنسول بازی", "دوربین عکاسی", "گجت پوشیدنی"]
    },
    {
      id: "home", title: "خانه و آشپزخانه", image: img(IMG.coffee, 200),
      children: ["یخچال", "ماشین لباسشویی", "قهوه‌ساز", "جاروبرقی", "مایکروویو", "لوازم آشپزخانه"]
    },
    {
      id: "fashion", title: "مد و پوشاک", image: img(IMG.sneakers, 200),
      children: ["کفش ورزشی", "کوله و کیف", "عینک آفتابی", "عطر و ادکلن"]
    }
  ];

  var brands = [
    { id: "samsung", fa: "سامسونگ" },
    { id: "apple", fa: "اپل" },
    { id: "xiaomi", fa: "شیائومی" },
    { id: "sony", fa: "سونی" },
    { id: "lg", fa: "ال جی" },
    { id: "lenovo", fa: "لنوو" },
    { id: "asus", fa: "ایسوس" },
    { id: "hp", fa: "اچ‌پی" },
    { id: "logitech", fa: "لاجیتک" },
    { id: "jbl", fa: "جی‌بی‌ال" },
    { id: "hyperx", fa: "هایپرایکس" },
    { id: "garmin", fa: "گارمین" },
    { id: "fujifilm", fa: "فوجی‌فیلم" },
    { id: "microsoft", fa: "مایکروسافت" },
    { id: "nespresso", fa: "نسپرسو" },
    { id: "bosch", fa: "بوش" },
    { id: "philips", fa: "فیلیپس" },
    { id: "nike", fa: "نایک" },
    { id: "adidas", fa: "آدیداس" },
    { id: "rayban", fa: "ری‌بن" },
    { id: "chanel", fa: "شنل" },
    { id: "dior", fa: "دیور" },
    { id: "gucci", fa: "گوچی" }
  ];

  var W = "۱۸ ماه گارانتی شرکتی";
  var S = "لاجورد";

  function p(id, title, cat, brand, price, oldPrice, rating, reviews, image, gallery, colors, stock, tags, specs) {
    return {
      id: id,
      title: title,
      cat: cat,
      brand: brand,
      price: price,
      oldPrice: oldPrice || null,
      rating: rating,
      reviews: reviews,
      image: img(image, 600),
      gallery: gallery.map(function (g) { return img(g, 900); }),
      colors: colors,
      stock: stock !== false,
      tags: tags || [],
      seller: S,
      warranty: W,
      specs: specs
    };
  }

  var products = [
    /* ---------------- موبایل ---------------- */
    p("p-101", "گوشی موبایل سامسونگ مدل Galaxy A55 5G حافظه ۱۲۸ گیگابایت", "mobile", "samsung", 14500000, 16800000, 4.6, 1245, IMG.phone1, [IMG.phone1, IMG.phone3, IMG.phone2], ["#1f2937", "#e5e7eb", "#93c5fd"], true, ["پرفروش"], {
      "حافظهٔ داخلی": "۱۲۸ گیگابایت", "رم": "۸ گیگابایت", "صفحه‌نمایش": "۶.۶ اینچ Super AMOLED",
      "دوربین اصلی": "۵۰ مگاپیکسل", "باتری": "۵۰۰۰ میلی‌آمپرساعت", "شبکه": "5G"
    }),
    p("p-102", "گوشی موبایل اپل مدل iPhone 15 Pro Max ظرفیت ۲۵۶ گیگابایت", "mobile", "apple", 78900000, 84000000, 4.9, 862, IMG.phone2, [IMG.phone2, IMG.phone1, IMG.tablet], ["#9ca3af", "#1f2937"], true, ["پیشنهاد ویژه"], {
      "حافظهٔ داخلی": "۲۵۶ گیگابایت", "تراشه": "A17 Pro", "صفحه‌نمایش": "۶.۷ اینچ Super Retina XDR",
      "دوربین اصلی": "۴۸ مگاپیکسل", "جنس بدنه": "تیتانیوم", "شبکه": "5G"
    }),
    p("p-103", "گوشی موبایل شیائومی مدل Redmi Note 13 Pro حافظه ۲۵۶ گیگابایت", "mobile", "xiaomi", 11200000, 12900000, 4.4, 2310, IMG.phone3, [IMG.phone3, IMG.phone2, IMG.phone1], ["#312e81", "#f1f5f9"], true, ["پرفروش"], {
      "حافظهٔ داخلی": "۲۵۶ گیگابایت", "رم": "۸ گیگابایت", "صفحه‌نمایش": "۶.۶۷ اینچ AMOLED",
      "دوربین اصلی": "۲۰۰ مگاپیکسل", "باتری": "۵۱۰۰ میلی‌آمپرساعت", "شارژ سریع": "۶۷ وات"
    }),
    p("p-104", "گوشی موبایل سامسونگ مدل Galaxy S24 Ultra حافظه ۵۱۲ گیگابایت", "mobile", "samsung", 62000000, null, 4.8, 410, IMG.phone1, [IMG.phone1, IMG.phone2, IMG.phone3], ["#111827", "#6b7280", "#fcd34d"], true, ["جدید"], {
      "حافظهٔ داخلی": "۵۱۲ گیگابایت", "رم": "۱۲ گیگابایت", "صفحه‌نمایش": "۶.۸ اینچ Dynamic AMOLED",
      "دوربین اصلی": "۲۰۰ مگاپیکسل", "قلم": "S Pen", "شبکه": "5G"
    }),
    p("p-105", "تبلت اپل مدل iPad Air 11 اینچ M2 ظرفیت ۲۵۶ گیگابایت", "mobile", "apple", 42500000, 44900000, 4.7, 188, IMG.tablet, [IMG.tablet, IMG.phone2, IMG.laptop1], ["#cbd5e1", "#1e293b"], true, [], {
      "حافظهٔ داخلی": "۲۵۶ گیگابایت", "تراشه": "Apple M2", "صفحه‌نمایش": "۱۱ اینچ Liquid Retina",
      "اتصال": "Wi-Fi", "باتری": "تا ۱۰ ساعت", "سازگاری": "Apple Pencil Pro"
    }),
    p("p-106", "گوشی موبایل شیائومی مدل 13T Pro حافظه ۵۱۲ گیگابایت", "mobile", "xiaomi", 32800000, 35500000, 4.5, 96, IMG.phone2, [IMG.phone2, IMG.phone3, IMG.phone1], ["#0f766e", "#111827"], true, [], {
      "حافظهٔ داخلی": "۵۱۲ گیگابایت", "رم": "۱۲ گیگابایت", "صفحه‌نمایش": "۶.۶۷ اینچ AMOLED",
      "دوربین اصلی": "۵۰ مگاپیکسل", "شارژ سریع": "۱۲۰ وات", "شبکه": "5G"
    }),
    p("p-107", "تبلت سامسونگ مدل Galaxy Tab S9 FE ظرفیت ۱۲۸ گیگابایت", "mobile", "samsung", 24900000, 27400000, 4.3, 77, IMG.tablet, [IMG.tablet, IMG.phone1, IMG.phone3], ["#94a3b8", "#334155"], true, [], {
      "حافظهٔ داخلی": "۱۲۸ گیگابایت", "صفحه‌نمایش": "۱۰.۹ اینچ TFT", "اتصال": "Wi-Fi",
      "باتری": "۸۰۰۰ میلی‌آمپرساعت", "قلم": "S Pen همراه", "ضدآب": "IP68"
    }),
    p("p-108", "گوشی موبایل اپل مدل iPhone 13 حافظه ۱۲۸ گیگابایت", "mobile", "apple", 38500000, null, 4.6, 3120, IMG.phone3, [IMG.phone3, IMG.phone1, IMG.phone2], ["#f9fafb", "#111827"], false, ["پرفروش"], {
      "حافظهٔ داخلی": "۱۲۸ گیگابایت", "تراشه": "A15 Bionic", "صفحه‌نمایش": "۶.۱ اینچ Super Retina",
      "دوربین اصلی": "۱۲ مگاپیکسل", "باتری": "۳۲۴۰ میلی‌آمپرساعت", "شبکه": "5G"
    }),

    /* ---------------- لپ‌تاپ ---------------- */
    p("p-201", "لپ‌تاپ اپل مدل MacBook Air 13 اینچ M3 حافظه ۲۵۶ گیگابایت", "laptop", "apple", 68000000, 72500000, 4.9, 640, IMG.laptop1, [IMG.laptop1, IMG.laptop2, IMG.keyboard], ["#c0c5ce", "#3b3f45"], true, ["پرفروش"], {
      "پردازنده": "Apple M3", "رم": "۸ گیگابایت", "حافظه": "۲۵۶ گیگابایت SSD",
      "صفحه‌نمایش": "۱۳.۶ اینچ Liquid Retina", "باتری": "تا ۱۸ ساعت", "وزن": "۱.۲۴ کیلوگرم"
    }),
    p("p-202", "لپ‌تاپ لنوو مدل IdeaPad Slim 3 پردازنده Core i5", "laptop", "lenovo", 27500000, 29900000, 4.1, 214, IMG.laptop2, [IMG.laptop2, IMG.laptop1, IMG.mouse], ["#6b7280"], true, [], {
      "پردازنده": "Intel Core i5-13420H", "رم": "۱۶ گیگابایت", "حافظه": "۵۱۲ گیگابایت SSD",
      "صفحه‌نمایش": "۱۵.۶ اینچ Full HD", "کارت گرافیک": "UHD", "وزن": "۱.۶۲ کیلوگرم"
    }),
    p("p-203", "لپ‌تاپ ایسوس مدل ROG Strix G16 ویژهٔ گیمینگ", "laptop", "asus", 89000000, null, 4.7, 88, IMG.laptop1, [IMG.laptop1, IMG.laptop2, IMG.console], ["#111827", "#ef4444"], true, ["جدید"], {
      "پردازنده": "Intel Core i7-13650HX", "رم": "۱۶ گیگابایت", "حافظه": "۱ ترابایت SSD",
      "کارت گرافیک": "RTX 4060", "صفحه‌نمایش": "۱۶ اینچ ۱۶۵ هرتز", "خنک‌کننده": "فلز مایع"
    }),
    p("p-204", "مانیتور سامسونگ مدل Odyssey G5 سایز ۲۷ اینچ", "laptop", "samsung", 18900000, 20500000, 4.5, 132, IMG.laptop2, [IMG.laptop2, IMG.tv, IMG.keyboard], ["#1f2937"], true, [], {
      "اندازه": "۲۷ اینچ", "وضوح": "2560 × 1440", "نرخ تازه‌سازی": "۱۶۵ هرتز",
      "پنل": "VA", "زمان پاسخ": "۱ میلی‌ثانیه", "اتصال": "HDMI / DisplayPort"
    }),
    p("p-205", "کیبورد مکانیکی گیمینگ لاجیتک مدل G413 SE", "laptop", "logitech", 3850000, 4290000, 4.4, 520, IMG.keyboard, [IMG.keyboard, IMG.mouse, IMG.laptop2], ["#111827"], true, ["پرفروش"], {
      "نوع": "مکانیکی", "سوییچ": "Tactile", "نورپردازی": "سفید", "اتصال": "USB",
      "چیدمان": "فارسی/انگلیسی", "جنس بدنه": "آلومینیوم"
    }),
    p("p-206", "ماوس بی‌سیم لاجیتک مدل MX Master 3S", "laptop", "logitech", 4200000, null, 4.8, 980, IMG.mouse, [IMG.mouse, IMG.keyboard, IMG.laptop1], ["#6b7280", "#e5e7eb"], true, ["پیشنهاد ویژه"], {
      "نوع اتصال": "بلوتوث و USB", "دقت سنسور": "۸۰۰۰ DPI", "باتری": "تا ۷۰ روز",
      "دکمه‌ها": "۷ عدد", "سازگاری": "ویندوز/مک", "وزن": "۱۴۱ گرم"
    }),
    p("p-207", "لپ‌تاپ اچ‌پی مدل Victus 15 پردازنده Core i7", "laptop", "hp", 46500000, 48900000, 4.2, 143, IMG.laptop2, [IMG.laptop2, IMG.laptop1, IMG.keyboard], ["#0f172a"], true, [], {
      "پردازنده": "Intel Core i7-13500H", "رم": "۱۶ گیگابایت", "حافظه": "۵۱۲ گیگابایت SSD",
      "کارت گرافیک": "RTX 4050", "صفحه‌نمایش": "۱۵.۶ اینچ ۱۴۴ هرتز", "وزن": "۲.۲۹ کیلوگرم"
    }),
    p("p-208", "لپ‌تاپ اپل مدل MacBook Pro 14 اینچ M3 Pro", "laptop", "apple", 115000000, null, 4.9, 205, IMG.laptop1, [IMG.laptop1, IMG.laptop2, IMG.mouse], ["#111827", "#9ca3af"], true, ["جدید"], {
      "پردازنده": "Apple M3 Pro", "رم": "۱۸ گیگابایت", "حافظه": "۵۱۲ گیگابایت SSD",
      "صفحه‌نمایش": "۱۴.۲ اینچ Liquid Retina XDR", "باتری": "تا ۱۸ ساعت", "پورت‌ها": "HDMI / Thunderbolt 4"
    }),

    /* ---------------- صوتی و تصویری ---------------- */
    p("p-301", "هدفون بی‌سیم سونی مدل WH-1000XM5 با نویز کنسلینگ", "audio", "sony", 14800000, 16900000, 4.8, 1520, IMG.headphones1, [IMG.headphones1, IMG.headphones2, IMG.airpods], ["#111827", "#d1d5db"], true, ["پرفروش"], {
      "نوع": "دور گوشی", "اتصال": "بلوتوث ۵.۲", "نویز کنسلینگ": "فعال",
      "باتری": "تا ۳۰ ساعت", "شارژ سریع": "۳ دقیقه = ۳ ساعت", "وزن": "۲۵۰ گرم"
    }),
    p("p-302", "هندزفری بلوتوث اپل مدل AirPods Pro نسل دوم", "audio", "apple", 12400000, 13500000, 4.7, 2100, IMG.airpods, [IMG.airpods, IMG.headphones1, IMG.headphones2], ["#f9fafb"], true, ["پیشنهاد ویژه"], {
      "نوع": "درون گوشی", "اتصال": "بلوتوث ۵.۳", "نویز کنسلینگ": "فعال",
      "باتری": "تا ۶ ساعت + کیس", "مقاومت": "IP54", "تراشه": "H2"
    }),
    p("p-303", "اسپیکر بلوتوثی جی‌بی‌ال مدل Charge 5", "audio", "jbl", 6900000, 7600000, 4.6, 870, IMG.speaker, [IMG.speaker, IMG.headphones1, IMG.airpods], ["#111827", "#1d4ed8"], true, [], {
      "توان": "۴۰ وات", "باتری": "تا ۲۰ ساعت", "مقاومت": "IP67",
      "اتصال": "بلوتوث ۵.۱", "پاوربانک": "دارد", "وزن": "۹۶۰ گرم"
    }),
    p("p-304", "هدفون گیمینگ هایپرایکس مدل Cloud II", "audio", "hyperx", 4100000, null, 4.4, 640, IMG.headphones2, [IMG.headphones2, IMG.headphones1, IMG.mouse], ["#b91c1c", "#111827"], true, [], {
      "نوع": "دور گوشی", "اتصال": "USB / جک ۳.۵", "میکروفون": "قابل جدا شدن",
      "صدای فضایی": "۷.۱ مجازی", "وزن": "۳۲۰ گرم", "جنس": "فلز و چرم مصنوعی"
    }),
    p("p-305", "تلویزیون هوشمند سامسونگ سایز ۵۵ اینچ QLED", "audio", "samsung", 48000000, 52000000, 4.6, 310, IMG.tv, [IMG.tv, IMG.laptop2, IMG.speaker], ["#111827"], true, ["پیشنهاد ویژه"], {
      "اندازه": "۵۵ اینچ", "وضوح": "4K UHD", "پنل": "QLED",
      "نرخ تازه‌سازی": "۱۲۰ هرتز", "سیستم‌عامل": "Tizen", "اتصال": "HDMI ×۴"
    }),
    p("p-306", "اسپیکر بلوتوثی سونی مدل SRS-XB100", "audio", "sony", 3200000, null, 4.3, 205, IMG.speaker, [IMG.speaker, IMG.airpods, IMG.headphones2], ["#f97316", "#111827"], true, [], {
      "توان": "۱۶ وات", "باتری": "تا ۱۶ ساعت", "مقاومت": "IP67",
      "اتصال": "بلوتوث ۵.۳", "وزن": "۲۷۴ گرم", "شارژ": "USB-C"
    }),
    p("p-307", "هندزفری سیمی سونی مدل MDR-EX15", "audio", "sony", 890000, 1100000, 4.1, 3400, IMG.headphones2, [IMG.headphones2, IMG.headphones1, IMG.airpods], ["#111827", "#e5e7eb"], true, [], {
      "نوع": "درون گوشی", "اتصال": "جک ۳.۵ میلی‌متری", "میکروفون": "دارد",
      "طول کابل": "۱.۲ متر", "وزن": "۳ گرم", "امپدانس": "۱۶ اهم"
    }),
    p("p-308", "تلویزیون هوشمند ال جی سایز ۶۵ اینچ OLED", "audio", "lg", 95000000, null, 4.8, 95, IMG.tv, [IMG.tv, IMG.speaker, IMG.laptop2], ["#111827"], false, ["جدید"], {
      "اندازه": "۶۵ اینچ", "وضوح": "4K UHD", "پنل": "OLED evo",
      "نرخ تازه‌سازی": "۱۲۰ هرتز", "سیستم‌عامل": "webOS", "اتصال": "HDMI 2.1 ×۴"
    }),

    /* ---------------- ساعت و گجت ---------------- */
    p("p-401", "ساعت هوشمند اپل مدل Watch Series 9 سایز ۴۵ میلی‌متر", "watch", "apple", 21500000, 23400000, 4.8, 720, IMG.watch1, [IMG.watch1, IMG.watch2, IMG.phone2], ["#111827", "#f1f5f9"], true, ["پرفروش"], {
      "صفحه‌نمایش": "۱.۹ اینچ OLED", "سازگاری": "iPhone", "سنسور": "ضربان قلب و اکسیژن خون",
      "باتری": "تا ۱۸ ساعت", "مقاومت": "IP6X / 50 متر", "اتصال": "GPS + Cellular"
    }),
    p("p-402", "ساعت هوشمند سامسونگ مدل Galaxy Watch 6 سایز ۴۴ میلی‌متر", "watch", "samsung", 12900000, 14500000, 4.5, 430, IMG.watch2, [IMG.watch2, IMG.watch1, IMG.phone1], ["#111827", "#dbeafe"], true, [], {
      "صفحه‌نمایش": "۱.۵ اینچ Super AMOLED", "سازگاری": "اندروید", "سنسور": "ضربان قلب، ECG",
      "باتری": "۴۲۵ میلی‌آمپرساعت", "مقاومت": "5ATM", "اتصال": "بلوتوث و Wi-Fi"
    }),
    p("p-403", "ساعت هوشمند شیائومی مدل Watch S3", "watch", "xiaomi", 3600000, 4200000, 4.2, 1150, IMG.watch1, [IMG.watch1, IMG.watch2, IMG.phone3], ["#111827", "#a3a3a3"], true, ["پیشنهاد ویژه"], {
      "صفحه‌نمایش": "۱.۴۳ اینچ AMOLED", "سازگاری": "اندروید و iOS", "باتری": "تا ۱۵ روز",
      "حالت ورزشی": "۱۵۰ حالت", "مقاومت": "5ATM", "تماس بلوتوثی": "دارد"
    }),
    p("p-404", "دوربین بدون آینه سونی مدل Alpha A7 IV با لنز ۲۸-۷۰", "watch", "sony", 98000000, null, 4.9, 64, IMG.camera, [IMG.camera, IMG.laptop1, IMG.console], ["#111827"], true, ["جدید"], {
      "سنسور": "۳۳ مگاپیکسل فول‌فریم", "ویدئو": "4K 60p", "لرزشگیر": "۵ محوره",
      "فوکوس": "۷۵۹ نقطه", "نمایشگر": "چرخشی لمسی", "لنز همراه": "FE 28-70mm"
    }),
    p("p-405", "کنسول بازی سونی مدل PlayStation 5 Slim", "watch", "sony", 44000000, 46900000, 4.7, 890, IMG.console, [IMG.console, IMG.tv, IMG.camera], ["#f9fafb"], true, ["پرفروش"], {
      "نسخه": "Slim دیجیتال", "حافظه": "۱ ترابایت SSD", "وضوح": "4K 120fps",
      "دسته": "DualSense", "اتصال": "Wi-Fi 6", "سازگاری": "بازی‌های PS4 و PS5"
    }),
    p("p-406", "ساعت هوشمند گارمین مدل Forerunner 255", "watch", "garmin", 18700000, null, 4.6, 210, IMG.watch2, [IMG.watch2, IMG.watch1, IMG.phone2], ["#111827", "#3b82f6"], true, [], {
      "صفحه‌نمایش": "۱.۳ اینچ MIP", "باتری": "تا ۱۴ روز", "GPS": "چندفرکانسی",
      "سنسور": "ضربان قلب و Pulse Ox", "مقاومت": "5ATM", "وزن": "۴۹ گرم"
    }),
    p("p-407", "دوربین بدون آینه فوجی‌فیلم مدل X-T5 با لنز ۱۵-۴۵", "watch", "fujifilm", 92000000, null, 4.8, 41, IMG.camera, [IMG.camera, IMG.console, IMG.laptop1], ["#111827", "#e5e7eb"], true, [], {
      "سنسور": "۴۰ مگاپیکسل APS-C", "ویدئو": "6K 30p", "لرزشگیر": "۵ محوره",
      "نمایشگر": "۳ اینچ دو حالته", "وزن": "۵۵۷ گرم", "لنز همراه": "XF 15-45mm"
    }),
    p("p-408", "کنسول بازی مایکروسافت مدل Xbox Series S حافظه ۵۱۲ گیگابایت", "watch", "microsoft", 19500000, 21900000, 4.5, 380, IMG.console, [IMG.console, IMG.tv, IMG.camera], ["#f9fafb"], true, [], {
      "نسخه": "Series S", "حافظه": "۵۱۲ گیگابایت SSD", "وضوح": "1440p 120fps",
      "دسته": "Wireless Controller", "اتصال": "Wi-Fi 5", "سرویس": "Game Pass"
    }),

    /* ---------------- خانه و آشپزخانه ---------------- */
    p("p-501", "یخچال فریزر ساید بای ساید سامسونگ ظرفیت ۶۱۷ لیتر", "home", "samsung", 62000000, 68000000, 4.6, 128, IMG.fridge, [IMG.fridge, IMG.washer, IMG.microwave], ["#cbd5e1", "#334155"], true, ["پیشنهاد ویژه"], {
      "ظرفیت": "۶۱۷ لیتر", "نوع": "ساید بای ساید", "انرژی": "A+",
      "یخساز": "اتوماتیک", "فناوری": "Inverter", "ابعاد": "۱۸۲ × ۹۱ × ۷۳ سانتی‌متر"
    }),
    p("p-502", "ماشین لباسشویی ال جی ظرفیت ۹ کیلوگرم", "home", "lg", 34500000, 37900000, 4.5, 340, IMG.washer, [IMG.washer, IMG.fridge, IMG.vacuum], ["#f8fafc"], true, [], {
      "ظرفیت": "۹ کیلوگرم", "نوع": "درام", "موتور": "Inverter Direct Drive",
      "دور موتور": "۱۴۰۰ دور", "برنامه": "۱۴ برنامه", "انرژی": "A+++"
    }),
    p("p-503", "قهوه‌ساز اسپرسو نسپرسو مدل Vertuo Next", "home", "nespresso", 12800000, 14200000, 4.4, 410, IMG.coffee, [IMG.coffee, IMG.blender, IMG.microwave], ["#111827", "#e5e7eb"], true, ["پرفروش"], {
      "نوع": "کپسولی", "فشار": "۱۹ بار", "ظرفیت مخزن": "۱.۱ لیتر",
      "گرم‌کن آب": "۲۵ ثانیه", "خاموشی خودکار": "دارد", "برند": "نسپرسو"
    }),
    p("p-504", "جاروبرقی رباتیک شیائومی مدل Robot Vacuum S12", "home", "xiaomi", 16400000, 18500000, 4.3, 260, IMG.vacuum, [IMG.vacuum, IMG.washer, IMG.fridge], ["#f9fafb"], true, [], {
      "نوع": "رباتیک", "مکش": "۴۰۰۰ پاسکال", "باتری": "۲۶۰۰ میلی‌آمپرساعت",
      "نقشه‌برداری": "لیزر LiDAR", "اپلیکیشن": "Mi Home", "مخزن آب": "دارد"
    }),
    p("p-505", "مایکروویو بوش ظرفیت ۳۰ لیتر با گریل", "home", "bosch", 15900000, null, 4.4, 72, IMG.microwave, [IMG.microwave, IMG.coffee, IMG.blender], ["#1f2937"], true, [], {
      "ظرفیت": "۳۰ لیتر", "توان": "۹۰۰ وات", "گریل": "دارد",
      "حالت پخت": "۵ حالت", "کنترل": "دیجیتال", "ابعاد": "۵۰ × ۳۹ × ۳۴ سانتی‌متر"
    }),
    p("p-506", "مخلوط‌کن فیلیپس توان ۱۰۰۰ وات", "home", "philips", 4300000, 4900000, 4.2, 880, IMG.blender, [IMG.blender, IMG.coffee, IMG.microwave], ["#e5e7eb"], true, [], {
      "توان": "۱۰۰۰ وات", "ظرفیت": "۲ لیتر", "تیغه": "۶ تیغه استیل",
      "سرعت": "۲ حالت + پالس", "جنس بدنه": "پلاستیک مقاوم", "گارانتی": "۲۴ ماه"
    }),
    p("p-507", "صندلی اداری ارگونومیک مدل Ergo Pro", "home", "philips", 8900000, 10500000, 4.1, 190, IMG.chair, [IMG.chair, IMG.laptop1, IMG.microwave], ["#111827", "#78716c"], true, [], {
      "نوع": "ارگونومیک", "جنس": "مش و آلومینیوم", "تنظیم ارتفاع": "دارد",
      "پشتی": "قابل تنظیم", "دسته": "۴ بعدی", "ظرفیت وزن": "۱۲۰ کیلوگرم"
    }),
    p("p-508", "یخچال فریزر بوش مدل Serie 6 ظرفیت ۴۵۰ لیتر", "home", "bosch", 78000000, null, 4.7, 56, IMG.fridge, [IMG.fridge, IMG.microwave, IMG.washer], ["#e5e7eb", "#475569"], false, ["جدید"], {
      "ظرفیت": "۴۵۰ لیتر", "نوع": "دو قلو", "انرژی": "A++",
      "فناوری": "NoFrost", "کمپرسور": "Inverter", "ابعاد": "۲۰۳ × ۷۰ × ۶۷ سانتی‌متر"
    }),

    /* ---------------- مد و پوشاک ---------------- */
    p("p-601", "کفش ورزشی نایک مدل Air Zoom Pegasus 40", "fashion", "nike", 5800000, 6500000, 4.6, 920, IMG.sneakers, [IMG.sneakers, IMG.backpack, IMG.sunglasses], ["#111827", "#f97316"], true, ["پرفروش"], {
      "نوع": "رانینگ", "جنس رویه": "مش تنفسی", "کفی": "Zoom Air",
      "سایز": "۴۰ تا ۴۵", "وزن": "۲۸۵ گرم", "کاربری": "دویدن روزانه"
    }),
    p("p-602", "کوله پشتی لپ‌تاپ ۱۵ اینچ ضدآب", "fashion", "adidas", 2400000, 2900000, 4.3, 410, IMG.backpack, [IMG.backpack, IMG.sneakers, IMG.sunglasses], ["#111827", "#57534e"], true, [], {
      "ظرفیت": "۲۵ لیتر", "جای لپ‌تاپ": "تا ۱۵ اینچ", "جنس": "پلی‌استر ضدآب",
      "جیب": "۵ جیب", "بند": "قابل تنظیم", "وزن": "۶۸۰ گرم"
    }),
    p("p-603", "عینک آفتابی ری‌بن مدل Aviator", "fashion", "rayban", 7200000, null, 4.5, 230, IMG.sunglasses, [IMG.sunglasses, IMG.perfume, IMG.sneakers], ["#a16207", "#111827"], true, ["پیشنهاد ویژه"], {
      "فرم": "خلبانی", "جنس فریم": "فلز", "عدسی": "UV400",
      "جنس عدسی": "کریستال", "سایز": "۵۸ میلی‌متر", "کیف": "همراه"
    }),
    p("p-604", "عطر مردانه شنل مدل Bleu de Chanel حجم ۱۰۰ میلی‌لیتر", "fashion", "chanel", 9800000, 10900000, 4.7, 180, IMG.perfume, [IMG.perfume, IMG.sunglasses, IMG.backpack], ["#1e3a8a"], true, [], {
      "حجم": "۱۰۰ میلی‌لیتر", "رایحه": "چوبی-معطر", "غلظت": "Eau de Parfum",
      "ماندگاری": "۸ تا ۱۰ ساعت", "فصل": "چهار فصل", "ساخت": "فرانسه"
    }),
    p("p-605", "کفش رانینگ آدیداس مدل Ultraboost Light", "fashion", "adidas", 6900000, null, 4.4, 310, IMG.sneakers, [IMG.sneakers, IMG.backpack, IMG.perfume], ["#f9fafb", "#0ea5e9"], true, [], {
      "نوع": "رانینگ", "جنس رویه": "Primeknit", "کفی": "Light BOOST",
      "سایز": "۴۰ تا ۴۶", "وزن": "۲۹۹ گرم", "کاربری": "دویدن و پیاده‌روی"
    }),
    p("p-606", "عطر زنانه دیور مدل J'adore حجم ۱۰۰ میلی‌لیتر", "fashion", "dior", 11500000, 12900000, 4.8, 140, IMG.perfume, [IMG.perfume, IMG.sunglasses, IMG.sneakers], ["#fcd34d"], true, ["جدید"], {
      "حجم": "۱۰۰ میلی‌لیتر", "رایحه": "گلی-میوه‌ای", "غلظت": "Eau de Parfum",
      "ماندگاری": "۶ تا ۸ ساعت", "فصل": "بهار و تابستان", "ساخت": "فرانسه"
    }),
    p("p-607", "کوله ورزشی نایک مدل Brasilia حجم ۲۰ لیتر", "fashion", "nike", 1900000, 2300000, 4.0, 520, IMG.backpack, [IMG.backpack, IMG.sneakers, IMG.sunglasses], ["#111827", "#dc2626"], true, [], {
      "ظرفیت": "۲۰ لیتر", "جنس": "پلی‌استر", "بند": "مشبک",
      "جیب": "۳ جیب", "کاربری": "ورزش و باشگاه", "وزن": "۵۴۰ گرم"
    }),
    p("p-608", "عینک آفتابی گوچی مدل GG1170S", "fashion", "gucci", 14500000, null, 4.6, 48, IMG.sunglasses, [IMG.sunglasses, IMG.perfume, IMG.backpack], ["#78350f", "#111827"], true, [], {
      "فرم": "مستطیلی", "جنس فریم": "استات", "عدسی": "UV400",
      "جنس عدسی": "پلی‌کربنات", "سایز": "۵۵ میلی‌متر", "کیف": "چرمی همراه"
    })
  ];

  var heroSlides = [
    {
      title: "جشنوارهٔ پایان فصل",
      text: "تا ۴۰٪ تخفیف روی موبایل و لپ‌تاپ منتخب",
      cta: "خرید با تخفیف",
      link: "category.html?cat=mobile",
      image: img(IMG.laptop1, 1400),
      alt: "لپ‌تاپ روی میز چوبی"
    },
    {
      title: "صدای بهتر، روز بهتر",
      text: "هدفون و اسپیکر با گارانتی شرکتی",
      cta: "دیدن پیشنهادها",
      link: "category.html?cat=audio",
      image: img(IMG.headphones1, 1400),
      alt: "هدفون حرفه‌ای روی سطح تیره"
    },
    {
      title: "آشپزخانهٔ هوشمند",
      text: "لوازم خانگی اصل با ارسال سریع",
      cta: "مشاهدهٔ محصولات",
      link: "category.html?cat=home",
      image: img(IMG.coffee, 1400),
      alt: "قهوه‌ساز اسپرسو در آشپزخانه"
    },
    {
      title: "استایل روز",
      text: "کفش و اکسسوری اورجینال با قیمت مناسب",
      cta: "خرید کنید",
      link: "category.html?cat=fashion",
      image: img(IMG.sneakers, 1400),
      alt: "کفش ورزشی روی پس‌زمینهٔ رنگی"
    }
  ];

  var promoBanners = [
    { id: "b-1", title: "ارسال امروز", text: "برای سفارش‌های تا ساعت ۱۲", image: img(IMG.watch1, 400), link: "category.html?cat=watch" },
    { id: "b-2", title: "۳۰٪ تخفیف پوشاک", text: "کد: LJSTYLE", image: img(IMG.sneakers, 400), link: "category.html?cat=fashion" },
    { id: "b-3", title: "خانهٔ هوشمند", text: "از ۵ میلیون تومان", image: img(IMG.vacuum, 400), link: "category.html?cat=home" },
    { id: "b-4", title: "گجت‌های جدید", text: "جدیدترین‌ها رسیدند", image: img(IMG.console, 400), link: "category.html?cat=watch" }
  ];

  var quickCats = [
    { title: "موبایل", cat: "mobile", image: img(IMG.phone1, 160) },
    { title: "لپ‌تاپ", cat: "laptop", image: img(IMG.laptop1, 160) },
    { title: "هدفون", cat: "audio", image: img(IMG.headphones1, 160) },
    { title: "ساعت هوشمند", cat: "watch", image: img(IMG.watch1, 160) },
    { title: "لوازم خانگی", cat: "home", image: img(IMG.coffee, 160) },
    { title: "مد و پوشاک", cat: "fashion", image: img(IMG.sneakers, 160) },
    { title: "تلویزیون", cat: "audio", image: img(IMG.tv, 160) },
    { title: "دوربین", cat: "watch", image: img(IMG.camera, 160) }
  ];

  var valueProps = [
    { icon: "truck", title: "ارسال سریع", text: "تحویل ۲۴ ساعته در تهران" },
    { icon: "shield", title: "ضمانت اصالت", text: "کالای اورجینال با گارانتی" },
    { icon: "support", title: "پشتیبانی ۷ روز هفته", text: "پاسخ‌گویی از ۸ تا ۲۳" },
    { icon: "return", title: "بازگشت کالا", text: "۷ روز ضمانت بازگشت" }
  ];

  var seoText = [
    "لاجورد برای انتخاب‌های روزمره ساخته شده است: از گوشی و لپ‌تاپ تا لوازم خانه و اکسسوری. اینجا مشخصات را کنار هم می‌گذارید، قیمت را شفاف می‌بینید و بدون شلوغی انتخاب می‌کنید.",
    "هر کالا با گارانتی معتبر و امکان بازگشت تا ۷ روز عرضه می‌شود. تیم پشتیبانی از شنبه تا جمعه پاسخ می‌دهد؛ از انتخاب محصول تا پیگیری مرسوله.",
    "فیلترها کار مقایسه را کوتاه می‌کنند: قیمت، برند، امتیاز کاربران و موجودی. هر چیزی که پسندید را به علاقه‌مندی‌ها بسپارید تا بعداً سریع پیدایش کنید.",
    "سفارش‌ها در تهران معمولاً کمتر از یک روز کاری و در شهرستان‌ها بین ۲ تا ۴ روز کاری به دستتان می‌رسد. ارسال برای سفارش‌های بالای ۵۰۰ هزار تومان رایگان است."
  ];

  window.SHOP_DATA = {
    categories: categories,
    brands: brands,
    products: products,
    heroSlides: heroSlides,
    promoBanners: promoBanners,
    bannerGrid: promoBanners,
    quickCats: quickCats,
    valueProps: valueProps,
    seoText: seoText
  };
})();
