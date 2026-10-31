/* ==========================================================================
   Store — وضعیت سبد/علاقه‌مندی، هدر، جست‌وجو، مگا‌منو، مودال‌ها، کاروسل
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.SHOP_DATA || { products: [], categories: [], brands: [] };
  var FA = new Intl.NumberFormat("fa-IR");
  var STORAGE = { cart: "shop_cart_v1", wish: "shop_wish_v1", user: "shop_user_v1", city: "shop_city_v1", promo: "shop_promo_v1" };

  /* ---------------- Utils ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) { return FA.format(Math.round(n || 0)); }
  function toFa(n) { return String(n).replace(/\d/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; }); }
  function toEnDigits(str) {
    return String(str)
      .replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); })
      .replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); });
  }
  function normalize(str) {
    return String(str || "")
      .replace(/[يى]/g, "ی").replace(/ك/g, "ک")
      .replace(/[\u200c\u200f\u200e]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait || 180);
    };
  }

  function productById(id) {
    for (var i = 0; i < DATA.products.length; i++) if (DATA.products[i].id === id) return DATA.products[i];
    return null;
  }
  function categoryById(id) {
    for (var i = 0; i < DATA.categories.length; i++) if (DATA.categories[i].id === id) return DATA.categories[i];
    return null;
  }
  var brandNames = {};
  DATA.brands.forEach(function (b) { brandNames[b.id] = b.fa; });
  function brandName(id) { return brandNames[id] || id; }
  function discountOf(p) {
    if (!p.oldPrice || p.oldPrice <= p.price) return 0;
    return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  }

  /* ---------------- Icons ---------------- */
  var I = {
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 3h2l2.4 11.2A2 2 0 0 0 9.4 16h8.2a2 2 0 0 0 2-1.6L21 7H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 3.7C19 15.6 12 20 12 20Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 10 8-7 8 7v10h-6v-6h-4v6H4V10Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 11h4l3 3v2h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="7" cy="18.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="18.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m9 11 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    support: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 0 1 14 0" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="3" y="12" width="4" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="17" y="12" width="4" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M19 19a4 4 0 0 1-4 3h-2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    return: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9a8 8 0 1 1 2 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M4 4v5h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4 10-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c4 0 7-2.7 7-6.3 0-3.9-2.8-5.7-3.7-9.7-2 1.6-3.1 3.6-3.2 5.6-1-.7-1.6-1.8-1.8-3.1C8.2 9.4 5 11.9 5 14.7 5 18.3 8 21 12 21Z" fill="currentColor"/></svg>'
  };

  /* ---------------- State ---------------- */
  var cart = read(STORAGE.cart, {});
  var wish = read(STORAGE.wish, []);
  var user = read(STORAGE.user, null);
  var city = { name: read(STORAGE.city, "تهران") };

  function cartCount() {
    return Object.keys(cart).reduce(function (sum, id) { return sum + (cart[id] || 0); }, 0);
  }
  function cartLines() {
    return Object.keys(cart).filter(function (id) { return cart[id] > 0; }).map(function (id) {
      var p = productById(id);
      return p ? { product: p, qty: cart[id], total: p.price * cart[id] } : null;
    }).filter(Boolean);
  }
  function cartTotals() {
    var lines = cartLines();
    var price = 0, old = 0;
    lines.forEach(function (l) {
      price += l.total;
      old += (l.product.oldPrice || l.product.price) * l.qty;
    });
    var shipping = price > 0 && price < 500000 ? 39000 : 0;
    return { count: cartCount(), price: price, old: old, discount: old - price, shipping: shipping, payable: price + shipping, lines: lines };
  }

  function saveCart() {
    write(STORAGE.cart, cart);
    syncBadges();
  }
  function addToCart(id, qty) {
    var p = productById(id);
    if (!p || !p.stock) { toast("این محصول فعلاً ناموجود است.", "error"); return; }
    cart[id] = (cart[id] || 0) + (qty || 1);
    saveCart();
    toast("«" + p.title.slice(0, 34) + "…» به سبد خرید اضافه شد.", "success");
    document.dispatchEvent(new CustomEvent("shop:cart"));
  }
  function setQty(id, qty) {
    if (qty <= 0) delete cart[id]; else cart[id] = qty;
    saveCart();
    document.dispatchEvent(new CustomEvent("shop:cart"));
  }
  function removeFromCart(id) {
    delete cart[id];
    saveCart();
    document.dispatchEvent(new CustomEvent("shop:cart"));
  }
  function inWish(id) { return wish.indexOf(id) > -1; }
  function toggleWish(id) {
    var i = wish.indexOf(id);
    if (i > -1) { wish.splice(i, 1); toast("از علاقه‌مندی‌ها حذف شد."); }
    else { wish.push(id); toast("به علاقه‌مندی‌ها اضافه شد."); }
    write(STORAGE.wish, wish);
    syncWishButtons();
    return i === -1;
  }
  function syncWishButtons() {
    $$("[data-wish]").forEach(function (btn) {
      var on = inWish(btn.getAttribute("data-wish"));
      btn.setAttribute("aria-pressed", String(on));
      var p = productById(btn.getAttribute("data-wish"));
      btn.setAttribute("aria-label", (on ? "حذف " : "افزودن ") + (p ? p.title : "محصول") + (on ? " از علاقه‌مندی‌ها" : " به علاقه‌مندی‌ها"));
    });
  }
  function syncBadges() {
    var n = cartCount();
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = toFa(n);
      el.hidden = n === 0;
    });
    $$("[data-cart-label]").forEach(function (el) {
      el.textContent = n ? "سبد خرید (" + toFa(n) + " کالا)" : "سبد خرید";
    });
  }

  /* ---------------- Toast ---------------- */
  function toast(message, type) {
    var region = $(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    var el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast--error" : "");
    var p = document.createElement("p");
    p.textContent = message;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "بستن";
    btn.addEventListener("click", function () { el.remove(); });
    el.appendChild(p);
    el.appendChild(btn);
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 4000);
  }

  /* ---------------- Product card ---------------- */
  function cardHTML(p) {
    var off = discountOf(p);
    var wished = inWish(p.id);
    var colors = (p.colors || []).slice(0, 3).map(function (c) {
      return '<span class="swatch" style="--c:' + esc(c) + '"></span>';
    }).join("");
    var more = p.colors && p.colors.length > 3 ? '<span class="swatch--more">+' + toFa(p.colors.length - 3) + "</span>" : "";
    return '' +
      '<article class="p-card">' +
        '<a class="p-card__media" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" width="300" height="300" loading="lazy" decoding="async">' +
          (off ? '<span class="badge p-card__badge">' + toFa(off) + "٪</span>" : "") +
        "</a>" +
        '<button class="wish" type="button" data-wish="' + p.id + '" aria-pressed="' + wished + '" aria-label="' + (wished ? "حذف " : "افزودن ") + esc(p.title) + (wished ? " از علاقه‌مندی‌ها" : " به علاقه‌مندی‌ها") + '">' + I.heart + "</button>" +
        (p.stock
          ? '<button class="p-card__quick" type="button" data-add="' + p.id + '" aria-label="افزودن ' + esc(p.title) + ' به سبد خرید">' + I.plus + "</button>"
          : "") +
        '<div class="p-card__body">' +
          '<h3 class="p-card__title clamp-2"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + "</a></h3>" +
          '<div class="p-card__meta">' +
            '<span class="rating">' + I.star + "<b>" + toFa(p.rating.toFixed(1)) + "</b><span>(" + money(p.reviews) + ")</span></span>" +
            (p.stock ? '<span class="stock">موجود</span>' : '<span class="stock stock--out">ناموجود</span>') +
          "</div>" +
          (colors ? '<div class="swatches" aria-hidden="true">' + colors + more + "</div>" : "") +
          '<div class="p-card__price price-block">' +
            (off ? '<span class="price-old">' + money(p.oldPrice) + "</span>" : "") +
            '<span class="price"><span class="price__num">' + money(p.price) + '</span><span class="price__cur">تومان</span></span>' +
          "</div>" +
        "</div>" +
      "</article>";
  }

  function renderCards(container, list) {
    if (!container) return;
    container.innerHTML = list.map(cardHTML).join("");
    syncWishButtons();
  }

  /* ---------------- Header / interactions ---------------- */
  function initPromo() {
    var bar = $("[data-promo-bar]");
    if (!bar) return;
    if (read(STORAGE.promo, false)) { bar.hidden = true; return; }
    var close = $("[data-promo-close]", bar);
    if (close) close.addEventListener("click", function () {
      bar.hidden = true;
      write(STORAGE.promo, true);
    });
  }

  function initMega() {
    var mega = $("[data-mega]");
    if (!mega) return;
    var nav = $("[data-cat-nav]");
    var allBtn = $("[data-mega-toggle]");
    var closeTimer;

    mega.innerHTML = '<div class="container mega__grid">' + DATA.categories.map(function (cat) {
      return '<div class="mega__col"><h3><a href="category.html?cat=' + cat.id + '">' + esc(cat.title) + "</a></h3>" +
        cat.children.map(function (child) {
          return '<a href="category.html?cat=' + cat.id + '&sub=' + encodeURIComponent(child) + '">' + esc(child) + "</a>";
        }).join("") + "</div>";
    }).join("") + "</div>";

    function open() {
      clearTimeout(closeTimer);
      mega.classList.add("is-open");
      if (allBtn) allBtn.setAttribute("aria-expanded", "true");
    }
    function close() {
      mega.classList.remove("is-open");
      if (allBtn) allBtn.setAttribute("aria-expanded", "false");
    }
    function scheduleClose() {
      closeTimer = setTimeout(close, 180);
    }

    if (allBtn) {
      allBtn.addEventListener("click", function () {
        if (mega.classList.contains("is-open")) close(); else open();
      });
    }
    if (nav) {
      $$("[data-cat-link]", nav).forEach(function (link) {
        link.addEventListener("mouseenter", open);
        link.addEventListener("focus", open);
      });
      nav.addEventListener("mouseleave", scheduleClose);
      nav.addEventListener("focusout", function (e) {
        if (!nav.contains(e.relatedTarget)) scheduleClose();
      });
    }
    mega.addEventListener("mouseenter", function () { clearTimeout(closeTimer); });
    mega.addEventListener("mouseleave", scheduleClose);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    document.addEventListener("click", function (e) {
      if (!mega.classList.contains("is-open")) return;
      if (mega.contains(e.target) || (nav && nav.contains(e.target)) || (allBtn && allBtn.contains(e.target))) return;
      close();
    });
  }

  function initSearch() {
    var form = $("[data-search]");
    if (!form) return;
    var input = $("[data-search-input]", form);
    var list = $("[data-search-list]", form);
    if (!input || !list) return;
    var active = -1;
    var catSelect = $("[data-search-cat]", form);
    if (catSelect && catSelect.options.length <= 1) {
      DATA.categories.forEach(function (cat) {
        var opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.title;
        catSelect.appendChild(opt);
      });
    }

    function close() {
      list.hidden = true;
      list.innerHTML = "";
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
    }
    function render(q) {
      var query = normalize(q);
      if (query.length < 2) { close(); return; }
      var results = DATA.products.filter(function (p) {
        return normalize(p.title + " " + brandName(p.brand) + " " + (categoryById(p.cat) || {}).title).indexOf(query) > -1;
      }).slice(0, 6);

      if (!results.length) {
        list.innerHTML = '<li class="suggest-empty" role="option" aria-disabled="true">نتیجه‌ای پیدا نشد.</li>';
      } else {
        list.innerHTML = results.map(function (p, idx) {
          return '<li role="none"><a class="suggest-item" role="option" id="sug-' + idx + '" href="product.html?id=' + p.id + '">' +
            '<img src="' + esc(p.image) + '" alt="" width="36" height="36" loading="lazy">' +
            "<span>" + esc(p.title) + "</span>" +
            '<span class="suggest-item__meta num">' + money(p.price) + " تومان</span></a></li>";
        }).join("");
      }
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      active = -1;
    }

    input.addEventListener("input", debounce(function () { render(input.value); }, 150));
    input.addEventListener("focus", function () { if (input.value.trim().length >= 2) render(input.value); });
    input.addEventListener("keydown", function (e) {
      var options = $$(".suggest-item", list);
      if (e.key === "Escape") { close(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!options.length) return;
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
        options.forEach(function (o, i) {
          o.setAttribute("aria-selected", String(i === active));
          if (i === active) input.setAttribute("aria-activedescendant", o.id);
        });
      } else if (e.key === "Enter" && active > -1 && options[active]) {
        e.preventDefault();
        window.location.href = options[active].getAttribute("href");
      }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      var cat = catSelect ? catSelect.value : "";
      var params = [];
      if (cat) params.push("cat=" + encodeURIComponent(cat));
      if (q) params.push("q=" + encodeURIComponent(q));
      window.location.href = "category.html" + (params.length ? "?" + params.join("&") : "");
    });
    document.addEventListener("click", function (e) {
      if (!form.contains(e.target)) close();
    });
  }

  function initDialogs() {
    $$("[data-dialog-open]").forEach(function (opener) {
      var dlg = document.getElementById(opener.getAttribute("data-dialog-open"));
      if (!dlg || opener.dataset.dialogReady === "1") return;
      opener.dataset.dialogReady = "1";
      opener.addEventListener("click", function () {
        if (typeof dlg.showModal === "function") dlg.showModal();
        else dlg.setAttribute("open", "");
        var focusTarget = dlg.querySelector("[data-autofocus]") || dlg.querySelector("button, input, a[href]");
        if (focusTarget) focusTarget.focus();
      });
      if (dlg.dataset.dialogReady !== "1") {
        dlg.dataset.dialogReady = "1";
        dlg.addEventListener("close", function () { opener.focus(); });
        dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
        $$("[data-dialog-close]", dlg).forEach(function (btn) {
          btn.addEventListener("click", function () { dlg.close(); });
        });
      }
    });
  }

  function initLocation() {
    var label = $("[data-city-label]");
    if (label) label.textContent = city.name;
    $$("[data-city]").forEach(function (btn) {
      btn.setAttribute("aria-checked", String(btn.getAttribute("data-city") === city.name));
      btn.addEventListener("click", function () {
        city.name = btn.getAttribute("data-city");
        write(STORAGE.city, city.name);
        if (label) label.textContent = city.name;
        $$("[data-city]").forEach(function (b) {
          b.setAttribute("aria-checked", String(b.getAttribute("data-city") === city.name));
        });
        var dlg = btn.closest("dialog");
        if (dlg) dlg.close();
        toast("شهر شما به «" + city.name + "» تغییر کرد.");
      });
    });
  }

  function renderUser() {
    var slot = $("[data-user-slot]");
    if (!slot) return;
    if (user && user.phone) {
      slot.innerHTML =
        '<div class="user-chip"><span class="user-chip__avatar" aria-hidden="true">' + esc(user.phone.slice(-2)) + "</span>" +
        '<span class="user-chip__text"><span class="user-chip__label">کاربر</span><b class="num" dir="ltr">' + toFa("0" + user.phone.slice(-10)) + "</b></span>" +
        '<button class="btn btn--sm btn--ghost" type="button" data-logout>خروج</button></div>';
    } else {
      slot.innerHTML = '<button class="login-btn" type="button" data-dialog-open="loginDialog">ورود | ثبت‌نام</button>';
      initDialogs();
    }
  }

  function initAuth() {
    var dlg = $("[data-login-dialog]");
    if (!dlg) return;
    var phoneStep = $("[data-step-phone]", dlg);
    var otpStep = $("[data-step-otp]", dlg);
    var phoneForm = $("[data-phone-form]", dlg);
    var otpForm = $("[data-otp-form]", dlg);
    var phoneInput = $("[data-phone-input]", dlg);
    var phoneError = $("[data-phone-error]", dlg);
    var otpError = $("[data-otp-error]", dlg);
    var otpInputs = $$(".otp-row input", dlg);
    var resend = $("[data-resend]", dlg);
    var timerId, seconds = 30;

    function startResendTimer() {
      clearInterval(timerId);
      seconds = 30;
      if (!resend) return;
      resend.disabled = true;
      resend.textContent = "ارسال دوباره تا " + toFa(seconds) + " ثانیه";
      timerId = setInterval(function () {
        seconds -= 1;
        if (seconds <= 0) {
          clearInterval(timerId);
          resend.disabled = false;
          resend.textContent = "ارسال دوبارهٔ کد";
        } else {
          resend.textContent = "ارسال دوباره تا " + toFa(seconds) + " ثانیه";
        }
      }, 1000);
    }

    function goOtp() {
      phoneStep.hidden = true;
      otpStep.hidden = false;
      phoneStep.setAttribute("aria-hidden", "true");
      otpStep.removeAttribute("aria-hidden");
      startResendTimer();
      if (otpInputs[0]) otpInputs[0].focus();
    }
    function goPhone() {
      otpStep.hidden = true;
      phoneStep.hidden = false;
      otpStep.setAttribute("aria-hidden", "true");
      phoneStep.removeAttribute("aria-hidden");
      clearInterval(timerId);
    }

    if (phoneForm) {
      phoneForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var value = toEnDigits(phoneInput.value).replace(/[\s()-]/g, "");
        if (!/^(?:\+98|0098|0)?9\d{9}$/.test(value)) {
          phoneError.textContent = "شمارهٔ موبایل را درست وارد کنید (مثال: ۰۹۱۲۱۲۳۴۵۶۷).";
          phoneInput.setAttribute("aria-invalid", "true");
          phoneInput.focus();
          return;
        }
        phoneError.textContent = "";
        phoneInput.removeAttribute("aria-invalid");
        dlg.dataset.phone = value;
        goOtp();
      });
    }

    otpInputs.forEach(function (input, idx) {
      input.addEventListener("input", function () {
        input.value = toEnDigits(input.value).replace(/\D/g, "").slice(-1);
        if (input.value && otpInputs[idx + 1]) otpInputs[idx + 1].focus();
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !input.value && otpInputs[idx - 1]) otpInputs[idx - 1].focus();
      });
      input.addEventListener("paste", function (e) {
        var text = toEnDigits((e.clipboardData || window.clipboardData).getData("text")).replace(/\D/g, "").slice(0, 4);
        if (!text) return;
        e.preventDefault();
        otpInputs.forEach(function (inp, i) { inp.value = text[i] || ""; });
        if (otpInputs[Math.min(text.length, 4) - 1]) otpInputs[Math.min(text.length, 4) - 1].focus();
      });
    });

    if (otpForm) {
      otpForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var code = otpInputs.map(function (i) { return i.value; }).join("");
        if (code !== "1234") {
          otpError.textContent = "کد وارد شده درست نیست. کد آزمایشی: ۱۲۳۴";
          otpInputs.forEach(function (i) { i.setAttribute("aria-invalid", "true"); });
          otpInputs[0].focus();
          return;
        }
        otpInputs.forEach(function (i) { i.removeAttribute("aria-invalid"); });
        otpError.textContent = "";
        user = { phone: toEnDigits(dlg.dataset.phone || phoneInput.value) };
        write(STORAGE.user, user);
        renderUser();
        syncBadges();
        dlg.close();
        goPhone();
        toast("خوش آمدید! ورود با موفقیت انجام شد.");
      });
    }

    if (resend) {
      resend.addEventListener("click", function () {
        startResendTimer();
        otpInputs.forEach(function (i) { i.value = ""; });
        otpError.textContent = "";
        if (otpInputs[0]) otpInputs[0].focus();
        toast("کد تأیید دوباره ارسال شد (آزمایشی: ۱۲۳۴).");
      });
    }

    dlg.addEventListener("close", function () {
      clearInterval(timerId);
      goPhone();
      otpInputs.forEach(function (i) { i.value = ""; });
      otpError.textContent = "";
      phoneError.textContent = "";
    });

    document.addEventListener("click", function (e) {
      var logout = e.target.closest("[data-logout]");
      if (!logout) return;
      user = null;
      write(STORAGE.user, null);
      renderUser();
      toast("از حساب خارج شدید.");
    });
  }

  function initDelegates() {
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      if (add) { e.preventDefault(); addToCart(add.getAttribute("data-add")); return; }
      var wishBtn = e.target.closest("[data-wish]");
      if (wishBtn) { e.preventDefault(); toggleWish(wishBtn.getAttribute("data-wish")); }
    });
  }

  /* ---------------- Carousels ---------------- */
  function initRails(scope) {
    $$("[data-rail]", scope || document).forEach(function (wrap) {
      var track = $("[data-rail-track]", wrap);
      var prev = $("[data-rail-prev]", wrap);
      var next = $("[data-rail-next]", wrap);
      if (!track) return;

      function update() {
        var max = track.scrollWidth - track.clientWidth;
        var pos = Math.abs(track.scrollLeft);
        if (prev) prev.disabled = pos < 4;
        if (next) next.disabled = pos >= max - 4;
      }
      function move(dir) {
        var amount = Math.max(220, track.clientWidth * 0.8);
        var before = track.scrollLeft;
        track.scrollBy({ left: -dir * amount, behavior: "smooth" });
        setTimeout(function () {
          if (Math.abs(track.scrollLeft - before) < 2) {
            track.scrollBy({ left: dir * amount, behavior: "smooth" });
          }
        }, 320);
      }
      if (prev) prev.addEventListener("click", function () { move(-1); });
      if (next) next.addEventListener("click", function () { move(1); });
      track.addEventListener("scroll", debounce(update, 80), { passive: true });
      update();
      setTimeout(update, 400);
    });
  }

  /* ---------------- Hero slider ---------------- */
  function initSlider() {
    var slider = $("[data-slider]");
    if (!slider) return;
    var track = $("[data-slider-track]", slider);
    var slides = $$(".slide", track);
    var dotsWrap = $("[data-slider-dots]", slider);
    var prev = $("[data-slider-prev]", slider);
    var next = $("[data-slider-next]", slider);
    if (!track || slides.length < 2) return;

    var index = 0, timer = null;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    dotsWrap.innerHTML = slides.map(function (_, i) {
      return '<button type="button" data-dot="' + i + '" aria-label="اسلاید ' + toFa(i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + "></button>";
    }).join("");
    var dots = $$("[data-dot]", dotsWrap);

    function go(i, smooth) {
      index = (i + slides.length) % slides.length;
      slides[index].scrollIntoView({ behavior: smooth === false ? "auto" : "smooth", inline: "start", block: "nearest" });
      dots.forEach(function (d, di) { d.setAttribute("aria-current", String(di === index)); });
    }
    function start() {
      stop();
      if (reduce.matches) return;
      timer = setInterval(function () { go(index + 1); }, 6000);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    if (prev) prev.addEventListener("click", function () { go(index - 1); start(); });
    if (next) next.addEventListener("click", function () { go(index + 1); start(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { go(i); start(); });
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", function (e) {
      if (!slider.contains(e.relatedTarget)) start();
    });
    track.addEventListener("scroll", debounce(function () {
      var width = track.clientWidth;
      var pos = Math.abs(track.scrollLeft);
      var i = Math.round(pos / width);
      if (i !== index && slides[i]) {
        index = i;
        dots.forEach(function (d, di) { d.setAttribute("aria-current", String(di === index)); });
      }
    }, 100), { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    start();
  }

  /* ---------------- Countdown ---------------- */
  function initCountdown() {
    var el = $("[data-countdown]");
    if (!el) return;
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    function pad(n) { return toFa(String(n).padStart(2, "0")); }
    function tick() {
      var diff = Math.max(0, end - Date.now());
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var hEl = $("[data-cd-h]", el), mEl = $("[data-cd-m]", el), sEl = $("[data-cd-s]", el);
      if (hEl) hEl.textContent = pad(h);
      if (mEl) mEl.textContent = pad(m);
      if (sEl) sEl.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- Tabs ---------------- */
  function initTabs(scope) {
    $$("[data-tabs]", scope || document).forEach(function (root) {
      var tabs = $$('[role="tab"]', root);
      if (!tabs.length) return;
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () { select(tab, false); });
        tab.addEventListener("keydown", function (e) {
          var rtl = getComputedStyle(tab).direction === "rtl";
          var nextKey = rtl ? "ArrowLeft" : "ArrowRight";
          var prevKey = rtl ? "ArrowRight" : "ArrowLeft";
          var i = tabs.indexOf(tab);
          if (e.key === nextKey || e.key === prevKey) {
            e.preventDefault();
            select(tabs[(i + (e.key === nextKey ? 1 : -1) + tabs.length) % tabs.length], true);
          } else if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
          else if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
        });
      });
      select(tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0], false);
    });
  }

  function initNewsletter() {
    $$("[data-newsletter]").forEach(function (form) {
      if (form.dataset.ready === "1") return;
      form.dataset.ready = "1";
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = form.querySelector('input[type="email"]');
        if (!email) return;
        if (!email.value.trim() || (email.checkValidity && !email.checkValidity())) {
          if (email.reportValidity) email.reportValidity();
          return;
        }
        toast("عضویت شما در خبرنامه ثبت شد. ممنون!");
        form.reset();
      });
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initPromo();
    initMega();
    initSearch();
    initDialogs();
    initLocation();
    initAuth();
    initDelegates();
    initNewsletter();
    initSlider();
    initCountdown();
    initTabs();
    renderUser();
    syncBadges();
    syncWishButtons();
  }

  window.Shop = {
    data: DATA,
    $: $, $$: $$, esc: esc, money: money, toFa: toFa, toEnDigits: toEnDigits, normalize: normalize,
    productById: productById, categoryById: categoryById, brandName: brandName, discountOf: discountOf,
    icons: I, cardHTML: cardHTML, renderCards: renderCards,
    cart: { add: addToCart, set: setQty, remove: removeFromCart, lines: cartLines, totals: cartTotals, count: cartCount },
    wishlist: { toggle: toggleWish, has: inWish, all: function () { return wish.slice(); } },
    toast: toast, syncBadges: syncBadges, syncWishButtons: syncWishButtons,
    initRails: initRails, initTabs: initTabs, initDialogs: initDialogs
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
