# لاجورد — بازار آنلاین فارسی (RTL)

سایت **فارسی و راست‌به‌چپ** با **HTML + CSS + JavaScript خالص**؛ بدون فریم‌ورک، بدون بیلد و بدون `node_modules`.
یک فروشگاه کامل با صفحهٔ اصلی، فهرست محصولات، صفحهٔ محصول، سبد خرید و ورود با کد یک‌بارمصرف (آزمایشی).

## شروع سریع (پیش‌نمایش محلی)

```powershell
powershell -ExecutionPolicy Bypass -File tools/serve.ps1 -Port 5500
```

سپس در مرورگر: **http://localhost:5500**

> روی این سیستم Node.js و Python نصب نیست؛ `tools/serve.ps1` جایگزین آن‌هاست و MIME درست ماژول‌ها و صفحهٔ ۴۰۴ سفارشی را برمی‌گرداند.
> برای اجرای بدون کنسول: روی `tools\serve.ps1` راست‌کلیک → Run with PowerShell.

## امکانات

- **صفحهٔ اصلی:** نوار تخفیف قابل بستن، هدر چسبان با جست‌وجوی زنده، انتخاب شهر، مگا‌منو، اسلایدر ۴ اسلایدی، دسته‌های سریع، حراج امروز با شمارش معکوس، بنرها، ریل محصولات، برندها، متن سئو و فوتر کامل.
- **فهرست محصولات:** فیلتر قیمت، برند، موجودی، امتیاز و رنگ؛ مرتب‌سازی؛ چیپ فیلترهای فعال؛ «مشاهدهٔ بیشتر»؛ پارامترهای اشتراک‌پذیر `cat`, `q`, `brand`, `deals`, `sort`, `sub`.
- **صفحهٔ محصول:** گالری با تصاویر کوچک و بزرگ‌نمایی، مشخصات، تب‌ها، باکس فروشنده، محصولات مشابه و نوار خرید موبایل.
- **سبد خرید:** تغییر تعداد، حذف، جمع مبلغ، هزینهٔ ارسال، ثبت سفارش آزمایشی.
- **ورود/ثبت‌نام:** شمارهٔ موبایل + کد تأیید آزمایشی **۱۲۳۴**.
- **ذخیره‌سازی محلی:** سبد خرید، علاقه‌مندی‌ها، شهر و وضعیت ورود در `localStorage`.
- **دسترس‌پذیری:** ناوبری با کیبورد، `:focus-visible`، برچسب‌های فارسی، `aria-live` برای تعداد و پیام‌ها، احترام به `prefers-reduced-motion`.
- **بدون وابستگی خارجی:** فونت Vazirmatn به‌صورت محلی؛ تصاویر از Unsplash (نمونه).

## ساختار فایل‌ها

```
/
├── index.html
├── category.html          ← فهرست و فیلتر محصولات
├── product.html           ← جزئیات محصول (با ?id=p-101)
├── cart.html
├── about.html
├── contact.html
├── privacy.html
├── 404.html
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/    tokens.css · base.css · layout.css · components.css · pages.css
    ├── js/     data.js · store.js · home.js · category.js · product.js · cart.js · pages.js
    ├── fonts/  Vazirmatn-var.woff2
    └── favicon/favicon.svg
```

## دادهٔ نمونه

همهٔ محصولات در `assets/js/data.js` تعریف شده‌اند: ۴۸ محصول در ۶ دسته (`mobile`, `laptop`, `audio`, `watch`, `home`, `fashion`).
برای اتصال به بک‌اند واقعی، همین ساختار را از API پر کنید؛ بقیهٔ کد تغییری لازم ندارد.

تصاویر از Unsplash بارگذاری می‌شوند و تنها برای نمایش هستند. برای انتشار واقعی، آن‌ها را با عکس محصولات خود جایگزین کنید.

## انتشار «یک‌کلیکی»

**راه ۱ — Netlify Drop:** پوشهٔ سایت را به <https://app.netlify.com/drop> بکشید.
**راه ۲ — هاست اشتراکی:** فایل zip را در `public_html` آپلود و Extract کنید.
**راه ۳ — Cloudflare Pages / GitHub Pages:** پوشه را وصل یا push کنید.

بسته‌بندی:

```powershell
Compress-Archive -Path index.html, category.html, product.html, cart.html, about.html, contact.html, privacy.html, 404.html, assets, robots.txt, sitemap.xml -DestinationPath site.zip -Force
```

`.opencode/`، `AGENTS.md` و `tools/` را آپلود نکنید.

## نکته‌های سفارشی‌سازی

- **هویت بصری:** لاجورد `#23477d`، زعفران `#e7b23a` و سطح کرم `#f5f1e7` — همه در `assets/css/tokens.css`.
- **نام برند:** «لاجورد» در HTML، `data.js` و متادیتا استفاده شده است. پیش از انتشار تجاری، دامنه و علامت تجاری را استعلام کنید.
- **دامنه:** جایگزینی `https://lajvard.example/` در متا تگ‌ها، canonical، `sitemap.xml` و `robots.txt`.
- **فرم تماس و خبرنامه:** سمت کلاینت اعتبارسنجی می‌شوند و پیام موفقیت نشان می‌دهند؛ برای ارسال واقعی به endpoint متصل کنید.
