/* ==========================================================================
   Product detail — گالری، مشخصات، تب‌ها، محصولات مشابه
   ========================================================================== */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var Shop = window.Shop;
    if (!Shop) return;
    var $ = Shop.$, $$ = Shop.$$;
    var esc = Shop.esc, money = Shop.money, toFa = Shop.toFa;

    var id = new URLSearchParams(window.location.search).get("id");
    var product = Shop.productById(id);
    var root = $("[data-product-root]");
    var missing = $("[data-product-missing]");

    if (!product) {
      if (root) root.hidden = true;
      if (missing) missing.hidden = false;
      document.title = "محصول پیدا نشد | لاجورد";
      return;
    }

    var cat = Shop.categoryById(product.cat);
    var off = Shop.discountOf(product);

    /* ---------- متادیتا ---------- */
    document.title = product.title + " | لاجورد";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", product.title + " — مشخصات، قیمت و نظرات کاربران؛ ارسال از لاجورد با ضمانت اصالت.");
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", product.title + " | لاجورد");
    var ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", product.image);
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://lajvard.example/product.html?id=" + product.id);
    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", "https://lajvard.example/product.html?id=" + product.id);

    /* ---------- استخوان‌بندی ---------- */
    $("[data-product-title]").textContent = product.title;

    var crumbCat = $("[data-crumb-cat]");
    if (cat) {
      crumbCat.textContent = cat.title;
      crumbCat.setAttribute("href", "category.html?cat=" + cat.id);
    }
    $("[data-crumb-title]").textContent = product.title.length > 48 ? product.title.slice(0, 48) + "…" : product.title;

    /* ---------- گالری ---------- */
    var images = (product.gallery && product.gallery.length ? product.gallery : [product.image]).slice();
    if (images.indexOf(product.image) === -1) images.unshift(product.image);
    var mainImg = $("[data-gallery-main]");
    var thumbs = $("[data-gallery-thumbs]");
    var zoomImg = $("[data-zoom-image]");

    mainImg.setAttribute("src", images[0]);
    mainImg.setAttribute("alt", product.title);
    if (zoomImg) zoomImg.setAttribute("src", images[0]);

    thumbs.innerHTML = images.map(function (src, i) {
      return '<button class="gallery__thumb" type="button" data-thumb="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="تصویر ' + toFa(i + 1) + '">' +
        '<img src="' + esc(src) + '" alt="" width="64" height="64" loading="lazy"></button>';
    }).join("");

    function selectImage(i) {
      mainImg.setAttribute("src", images[i]);
      if (zoomImg) zoomImg.setAttribute("src", images[i]);
      $$("[data-thumb]", thumbs).forEach(function (b) {
        b.setAttribute("aria-pressed", String(Number(b.getAttribute("data-thumb")) === i));
      });
    }
    thumbs.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-thumb]");
      if (!btn) return;
      selectImage(Number(btn.getAttribute("data-thumb")));
    });

    var zoomDialog = document.getElementById("zoomDialog");
    var galleryOpen = $("[data-gallery-open]");
    if (zoomDialog && galleryOpen) {
      galleryOpen.addEventListener("click", function () {
        if (typeof zoomDialog.showModal === "function") zoomDialog.showModal();
      });
      $$("[data-dialog-close]", zoomDialog).forEach(function (btn) {
        btn.addEventListener("click", function () { zoomDialog.close(); });
      });
      zoomDialog.addEventListener("click", function (e) {
        if (e.target === zoomDialog) zoomDialog.close();
      });
    }

    /* ---------- نشان‌ها ---------- */
    var badges = [];
    if (off) badges.push('<span class="badge">' + toFa(off) + "٪ تخفیف</span>");
    badges.push(product.stock
      ? '<span class="badge badge--success">' + Shop.icons.check + " موجود در انبار</span>"
      : '<span class="badge badge--neutral">ناموجود</span>');
    if (product.tags.indexOf("جدید") > -1) badges.push('<span class="badge badge--soft">جدید</span>');
    if (product.tags.indexOf("پرفروش") > -1) badges.push('<span class="badge badge--soft">پرفروش</span>');
    $("[data-product-badges]").innerHTML = badges.join("");

    /* ---------- متا ---------- */
    $("[data-product-rating]").innerHTML = Shop.icons.star + "<b>" + toFa(product.rating.toFixed(1)) + "</b>" +
      '<span>(' + money(product.reviews) + " دیدگاه)</span>";
    $("[data-product-brand]").innerHTML = "برند: " +
      '<a href="category.html?brand=' + product.brand + '">' + esc(Shop.brandName(product.brand)) + "</a>";
    $("[data-product-code]").textContent = "کد کالا: " + product.id.toUpperCase();

    /* ---------- مشخصات کوتاه ---------- */
    var brief = Object.keys(product.specs || {}).slice(0, 4);
    $("[data-product-brief]").innerHTML = "<h2>خلاصهٔ مشخصات</h2><dl>" + brief.map(function (key) {
      return "<div><dt>" + esc(key) + "</dt><dd>" + esc(product.specs[key]) + "</dd></div>";
    }).join("") + "</dl>";

    /* ---------- فروشنده و قیمت ---------- */
    $("[data-product-seller]").textContent = product.seller;
    $("[data-product-warranty]").textContent = product.warranty;
    $("[data-product-stock]").innerHTML = product.stock
      ? '<span class="stock">آمادهٔ ارسال</span>'
      : '<span class="stock stock--out">ناموجود</span>';

    var priceHTML = (off ? '<span class="price-old">' + money(product.oldPrice) + "</span>" : "") +
      '<span class="price"><span class="price__num">' + money(product.price) + '</span><span class="price__cur">تومان</span></span>';
    $("[data-product-price]").innerHTML = priceHTML;
    var buybarPrice = $("[data-buybar-price]");
    if (buybarPrice) buybarPrice.innerHTML = priceHTML;

    /* ---------- خرید ---------- */
    var addBtn = $("[data-add-to-cart]");
    if (addBtn) {
      if (product.stock) addBtn.setAttribute("data-add", product.id);
      else {
        addBtn.disabled = true;
        addBtn.textContent = "فعلاً ناموجود";
      }
    }
    var buyNow = $("[data-buy-now]");
    if (buyNow) {
      if (product.stock) buyNow.addEventListener("click", function () {
        Shop.cart.add(product.id, 1);
        window.location.href = "cart.html";
      });
      else buyNow.disabled = true;
    }
    var buybarAdd = $("[data-buybar-add]");
    if (buybarAdd) {
      if (product.stock) buybarAdd.setAttribute("data-add", product.id);
      else buybarAdd.disabled = true;
    }
    var buybar = $("[data-buybar]");
    if (buybar) buybar.hidden = false;

    var wishBtn = $("[data-wish]");
    if (wishBtn) {
      wishBtn.setAttribute("data-wish", product.id);
      Shop.syncWishButtons();
      wishBtn.setAttribute("aria-pressed", String(Shop.wishlist.has(product.id)));
      wishBtn.textContent = Shop.wishlist.has(product.id) ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها";
      wishBtn.addEventListener("click", function () {
        setTimeout(function () {
          wishBtn.textContent = Shop.wishlist.has(product.id) ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها";
        }, 0);
      });
    }

    /* ---------- تب‌ها ---------- */
    var specRows = Object.keys(product.specs || {}).map(function (key) {
      return "<tr><th scope=\"row\">" + esc(key) + "</th><td>" + esc(product.specs[key]) + "</td></tr>";
    }).join("");
    specRows += "<tr><th scope=\"row\">برند</th><td>" + esc(Shop.brandName(product.brand)) + "</td></tr>";
    specRows += "<tr><th scope=\"row\">گارانتی</th><td>" + esc(product.warranty) + "</td></tr>";
    specRows += "<tr><th scope=\"row\">فروشنده</th><td>" + esc(product.seller) + "</td></tr>";
    $("[data-panel-specs] tbody").innerHTML = specRows;

    var catTitle = cat ? cat.title : "محصولات";
    $("[data-panel-intro]").innerHTML =
      "<p>" + esc(product.title) + " از برند " + esc(Shop.brandName(product.brand)) + " در دستهٔ " + esc(catTitle) + " عرضه شده است. " +
      "این کالا با ضمانت اصالت و " + esc(product.warranty) + " از لاجورد ارسال می‌شود.</p>" +
      "<p>ویژگی‌های کلیدی:</p><ul>" + brief.map(function (key) {
        return "<li><b>" + esc(key) + ":</b> " + esc(product.specs[key]) + "</li>";
      }).join("") + "</ul>" +
      "<p>ارسال سفارش‌ها در تهران معمولاً یک روز کاری و در شهرستان‌ها دو تا سه روز کاری زمان می‌برد. " +
      "در صورت باز نکردن بستهٔ پلمب، تا هفت روز پس از تحویل می‌توانید کالا را بازگردانید.</p>";

    var reviewNames = ["سارا محمدی", "امیر رضایی", "نگین کریمی"];
    var reviewTexts = [
      "کیفیت ساخت خیلی خوبه و دقیقاً همون چیزی بود که تو تصاویر دیدم. بسته‌بندی سالم رسید.",
      "قیمت نسبت به بازار منصفانه بود. ارسال یک روزه انجام شد و از خرید راضی‌ام.",
      "رنگش کمی متفاوت از عکس بود ولی در کل راضی‌ام. پشتیبانی هم سریع جواب داد."
    ];
    $("[data-panel-reviews]").innerHTML = reviewNames.map(function (name, i) {
      return '<article class="review"><div class="review__head"><b>' + esc(name) + "</b>" +
        '<span class="rating">' + Shop.icons.star + "<b>" + toFa(5 - i) + "</b></span>" +
        '<span class="review__buy">خرید تأییدشده</span></div>' +
        "<p>" + esc(reviewTexts[i]) + "</p></article>";
    }).join("");

    $("[data-panel-qa]").innerHTML =
      '<article class="review"><div class="review__head"><b>پرسش: گارانتی شامل چه مواردی است؟</b></div>' +
      "<p>گارانتی شرکتی شامل ایرادهای سخت‌افزاری می‌شود؛ آسیب فیزیکی و نفوذ مایعات مشمول گارانتی نیست.</p></article>" +
      '<article class="review"><div class="review__head"><b>پرسش: امکان ارسال به شهرستان وجود دارد؟</b></div>' +
      "<p>بله، ارسال به سراسر ایران انجام می‌شود و برای خریدهای بالای ۵۰۰ هزار تومان رایگان است.</p></article>";

    /* ---------- مشابه ---------- */
    var similar = Shop.data.products.filter(function (p) {
      return p.cat === product.cat && p.id !== product.id;
    }).sort(function (a, b) {
      return Math.abs(a.price - product.price) - Math.abs(b.price - product.price);
    }).slice(0, 10);

    Shop.renderCards($("[data-similar]"), similar);
    Shop.initRails();
    Shop.syncBadges();

    var similarLink = $("[data-similar-link]");
    if (similarLink && cat) similarLink.setAttribute("href", "category.html?cat=" + cat.id);

    /* ---------- JSON-LD ---------- */
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      image: [product.image],
      description: "خرید " + product.title + " با ضمانت اصالت از لاجورد.",
      brand: { "@type": "Brand", name: Shop.brandName(product.brand) },
      offers: {
        "@type": "Offer",
        priceCurrency: "IRR",
        price: product.price,
        availability: product.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: "https://lajvard.example/product.html?id=" + product.id
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews
      }
    });
    document.head.appendChild(ld);
  });
})();
