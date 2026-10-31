/* ==========================================================================
   Home page — ساخت بخش‌ها از دادهٔ محلی
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
    var data = Shop.data;
    var products = data.products;
    var $ = Shop.$;

    function discount(p) { return Shop.discountOf(p); }

    function listFor(key) {
      if (key.indexOf("cat:") === 0) {
        var cat = key.slice(4);
        return products.filter(function (p) { return p.cat === cat; });
      }
      if (key === "deals") {
        return products.filter(function (p) { return p.oldPrice; })
          .sort(function (a, b) { return discount(b) - discount(a); });
      }
      if (key === "bestseller") {
        return products.slice().sort(function (a, b) { return b.reviews - a.reviews; });
      }
      if (key === "newest") {
        return products.slice().sort(function (a, b) {
          var an = a.tags.indexOf("جدید") > -1 ? 1 : 0;
          var bn = b.tags.indexOf("جدید") > -1 ? 1 : 0;
          return bn - an || (b.id > a.id ? 1 : -1);
        });
      }
      if (key === "recommended") {
        return products.filter(function (p) { return p.stock; })
          .sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; });
      }
      return products;
    }

    /* ---------- لیست‌های محصول ---------- */
    Shop.$$("[data-list]").forEach(function (container) {
      var key = container.getAttribute("data-list");
      var limit = parseInt(container.getAttribute("data-limit"), 10) || 8;
      var list = listFor(key).slice(0, limit);
      Shop.renderCards(container, list);
    });

    Shop.initRails();

    /* ---------- دسته‌های سریع ---------- */
    var quick = $("[data-quick-cats]");
    if (quick) {
      quick.innerHTML = data.quickCats.map(function (cat) {
        var href = cat.cat === "audio" && cat.title === "تلویزیون"
          ? "category.html?cat=audio&sub=" + encodeURIComponent("تلویزیون")
          : "category.html?cat=" + cat.cat;
        return '<a class="quick-cat" href="' + href + '">' +
          '<span class="quick-cat__img"><img src="' + Shop.esc(cat.image) + '" alt="" width="64" height="64" loading="lazy"></span>' +
          "<span>" + Shop.esc(cat.title) + "</span></a>";
      }).join("");
    }

    /* ---------- برندها ---------- */
    var brands = $("[data-brands]");
    if (brands) {
      brands.innerHTML = data.brands.map(function (brand) {
        return '<a class="brand-chip" href="category.html?brand=' + brand.id + '">' + Shop.esc(brand.fa) + "</a>";
      }).join("");
    }

    /* ---------- متن سئو ---------- */
    var seoBlock = $("[data-seo-block]");
    var seoToggle = $("[data-seo-toggle]");
    if (seoBlock && seoToggle) {
      seoToggle.addEventListener("click", function () {
        var open = seoBlock.classList.toggle("is-open");
        seoToggle.setAttribute("aria-expanded", String(open));
        seoToggle.textContent = open ? "مشاهده کمتر" : "مشاهده بیشتر";
      });
    }
  });
})();
