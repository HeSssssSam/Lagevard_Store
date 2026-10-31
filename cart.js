/* ==========================================================================
   Cart page — نمایش، تغییر تعداد، حذف و ثبت سفارش آزمایشی
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

    var els = {
      layout: $("[data-cart-layout]"),
      list: $("[data-cart-list]"),
      empty: $("[data-cart-empty]"),
      count: $("[data-summary-count]"),
      price: $("[data-summary-price]"),
      discount: $("[data-summary-discount]"),
      shipping: $("[data-summary-shipping]"),
      total: $("[data-summary-total]"),
      note: $("[data-shipping-note]"),
      checkout: $("[data-checkout]")
    };

    var FREE_SHIPPING = 500000;

    function lineHTML(line) {
      var p = line.product;
      return '<article class="cart-item" data-line="' + p.id + '">' +
        '<a class="cart-item__img" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" width="110" height="110" loading="lazy">' +
        "</a>" +
        '<div class="cart-item__body">' +
          '<h2 class="cart-item__title"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + "</a></h2>" +
          '<div class="cart-item__meta">' +
            "<span>فروشنده: " + esc(p.seller) + "</span>" +
            "<span>گارانتی: " + esc(p.warranty) + "</span>" +
            (p.stock ? '<span class="stock">موجود</span>' : '<span class="stock stock--out">ناموجود</span>') +
          "</div>" +
          '<div class="cart-item__foot">' +
            '<div class="qty" role="group" aria-label="تعداد ' + esc(p.title) + '">' +
              '<button type="button" data-qty="dec" data-id="' + p.id + '" aria-label="کاهش تعداد"' + (line.qty <= 1 ? " disabled" : "") + ">−</button>" +
              '<output aria-live="polite">' + toFa(line.qty) + "</output>" +
              '<button type="button" data-qty="inc" data-id="' + p.id + '" aria-label="افزایش تعداد"' + (line.qty >= 10 ? " disabled" : "") + ">+</button>" +
            "</div>" +
            '<div class="price-block">' +
              (p.oldPrice ? '<span class="price-old">' + money(p.oldPrice * line.qty) + "</span>" : "") +
              '<span class="price"><span class="price__num">' + money(line.total) + '</span><span class="price__cur">تومان</span></span>' +
            "</div>" +
          "</div>" +
          '<button class="cart-item__remove" type="button" data-remove="' + p.id + '">' + Shop.icons.trash + "حذف از سبد</button>" +
        "</div>" +
      "</article>";
    }

    function render() {
      var t = Shop.cart.totals();

      if (!t.lines.length) {
        els.layout.hidden = true;
        els.empty.hidden = false;
        return;
      }

      els.layout.hidden = false;
      els.empty.hidden = true;
      els.list.innerHTML = t.lines.map(lineHTML).join("");

      els.count.textContent = toFa(t.count);
      els.price.textContent = money(t.old) + " تومان";
      els.discount.textContent = t.discount > 0 ? money(t.discount) + " تومان" : "۰ تومان";
      els.shipping.textContent = t.shipping === 0 ? "رایگان" : money(t.shipping) + " تومان";
      els.total.textContent = money(t.payable) + " تومان";

      if (t.price >= FREE_SHIPPING) {
        els.note.textContent = "ارسال این سفارش رایگان است.";
        els.note.classList.add("summary__saving");
      } else {
        els.note.textContent = money(FREE_SHIPPING - t.price) + " تومان تا ارسال رایگان باقی مانده است.";
        els.note.classList.remove("summary__saving");
      }
    }

    els.list.addEventListener("click", function (e) {
      var qtyBtn = e.target.closest("[data-qty]");
      if (qtyBtn) {
        var id = qtyBtn.getAttribute("data-id");
        var line = Shop.cart.lines().filter(function (l) { return l.product.id === id; })[0];
        if (!line) return;
        var next = qtyBtn.getAttribute("data-qty") === "inc" ? line.qty + 1 : line.qty - 1;
        Shop.cart.set(id, Math.max(0, Math.min(10, next)));
        if (next <= 0) Shop.toast("کالا از سبد خرید حذف شد.");
        return;
      }

      var remove = e.target.closest("[data-remove]");
      if (remove) {
        var pid = remove.getAttribute("data-remove");
        var p = Shop.productById(pid);
        Shop.cart.remove(pid);
        Shop.toast("«" + (p ? p.title.slice(0, 30) : "کالا") + "…» از سبد حذف شد.");
      }
    });

    document.addEventListener("shop:cart", render);

    /* ---------- ثبت سفارش ---------- */
    var orderDialog = document.getElementById("orderDialog");
    if (orderDialog) {
      $$("[data-dialog-close]", orderDialog).forEach(function (btn) {
        btn.addEventListener("click", function () { orderDialog.close(); });
      });
      orderDialog.addEventListener("click", function (e) {
        if (e.target === orderDialog) orderDialog.close();
      });
    }

    function isLoggedIn() {
      try {
        var raw = localStorage.getItem("shop_user_v1");
        var user = raw ? JSON.parse(raw) : null;
        return !!(user && user.phone);
      } catch (e) { return false; }
    }

    if (els.checkout) {
      els.checkout.addEventListener("click", function () {
        var t = Shop.cart.totals();
        if (!t.lines.length) {
          Shop.toast("سبد خرید شما خالی است.", "error");
          return;
        }
        if (!isLoggedIn()) {
          var dlg = document.getElementById("loginDialog");
          if (dlg && typeof dlg.showModal === "function") {
            dlg.showModal();
            var phoneInput = dlg.querySelector("[data-phone-input]");
            if (phoneInput) phoneInput.focus();
          }
          Shop.toast("برای نهایی‌کردن سفارش، وارد حساب خود شوید.");
          return;
        }

        var code = "ORD-" + toFa(String(Math.floor(100000 + Math.random() * 900000)));
        var total = money(t.payable) + " تومان";
        var codeEl = $("[data-order-code]", orderDialog);
        var totalEl = $("[data-order-total]", orderDialog);
        if (codeEl) codeEl.textContent = code;
        if (totalEl) totalEl.textContent = total;

        if (orderDialog && typeof orderDialog.showModal === "function") orderDialog.showModal();
        else Shop.toast("سفارش آزمایشی ثبت شد. کد پیگیری: " + code);

        t.lines.slice().forEach(function (line) {
          Shop.cart.set(line.product.id, 0);
        });
        Shop.syncBadges();
      });
    }

    render();
  });
})();
