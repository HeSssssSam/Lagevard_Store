/* ==========================================================================
   Category / listing — فیلتر، مرتب‌سازی، صفحه‌بندی تدریجی
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
    var data = Shop.data;
    var products = data.products;
    var params = new URLSearchParams(window.location.search);

    var COLOR_GROUPS = [
      { name: "مشکی", hex: "#111827" },
      { name: "سفید", hex: "#ffffff" },
      { name: "نقره‌ای", hex: "#c0c5ce" },
      { name: "آبی", hex: "#2563eb" },
      { name: "قرمز", hex: "#dc2626" },
      { name: "نارنجی", hex: "#f97316" },
      { name: "طلایی", hex: "#fcd34d" },
      { name: "سبز", hex: "#0f766e" },
      { name: "قهوه‌ای", hex: "#78350f" }
    ];

    var PAGE_SIZE = 12;
    var state = {
      cat: params.get("cat") || "",
      q: params.get("q") || "",
      sub: params.get("sub") || "",
      deals: params.get("deals") === "1",
      sort: params.get("sort") || "relevant",
      brands: (params.get("brand") || "").split(",").filter(Boolean),
      minPrice: 0,
      maxPrice: null,
      inStock: false,
      minRating: 0,
      colors: [],
      shown: PAGE_SIZE
    };

    var els = {
      results: $("[data-results]"),
      count: $("[data-result-count]"),
      title: $("[data-listing-title]"),
      crumb: $("[data-crumb]"),
      empty: $("[data-empty]"),
      loadMore: $("[data-load-more]"),
      brandBox: $("[data-brand-filters]"),
      colorBox: $("[data-color-filters]"),
      ratingBox: $("[data-rating-filters]"),
      priceMin: $("[data-price-min]"),
      priceMax: $("[data-price-max]"),
      priceMinOut: $("[data-price-min-out]"),
      priceMaxOut: $("[data-price-max-out]"),
      active: $("[data-active-filters]"),
      panel: $("[data-filters-panel]"),
      toggle: $("[data-filters-toggle]")
    };

    /* ---------- رنگ ---------- */
    function hexToRgb(hex) {
      var h = String(hex).replace("#", "");
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return {
        r: parseInt(h.slice(0, 2), 16) || 0,
        g: parseInt(h.slice(2, 4), 16) || 0,
        b: parseInt(h.slice(4, 6), 16) || 0
      };
    }
    function colorName(hex) {
      var c = hexToRgb(hex), best = COLOR_GROUPS[0], bestD = Infinity;
      COLOR_GROUPS.forEach(function (g) {
        var t = hexToRgb(g.hex);
        var d = Math.pow(c.r - t.r, 2) * 0.3 + Math.pow(c.g - t.g, 2) * 0.59 + Math.pow(c.b - t.b, 2) * 0.11;
        if (d < bestD) { bestD = d; best = g; }
      });
      return best.name;
    }
    function productColors(p) {
      var names = [];
      (p.colors || []).forEach(function (c) {
        var name = colorName(c);
        if (names.indexOf(name) === -1) names.push(name);
      });
      return names;
    }

    /* ---------- استخر اولیه ---------- */
    function basePool() {
      return products.filter(function (p) {
        if (state.cat && p.cat !== state.cat) return false;
        if (state.deals && !p.oldPrice) return false;
        if (state.sub && Shop.normalize(p.title).indexOf(Shop.normalize(state.sub)) === -1) return false;
        if (state.q) {
          var hay = Shop.normalize(p.title + " " + Shop.brandName(p.brand) + " " + (Shop.categoryById(p.cat) || {}).title);
          if (hay.indexOf(Shop.normalize(state.q)) === -1) return false;
        }
        return true;
      });
    }

    var pool = basePool();
    var priceCeiling = 0;

    function updateCeiling() {
      var prices = pool.map(function (p) { return p.oldPrice || p.price; });
      var next = Math.ceil((prices.length ? Math.max.apply(null, prices) : 0) / 1000000) * 1000000 || 1000000;
      var atMax = state.maxPrice === null || state.maxPrice >= priceCeiling;
      priceCeiling = next;
      if (atMax || state.maxPrice > next) state.maxPrice = next;
      if (state.minPrice > next) state.minPrice = next;
      els.priceMin.max = next;
      els.priceMax.max = next;
    }
    updateCeiling();
    els.priceMin.value = state.minPrice;
    els.priceMax.value = state.maxPrice;

    /* ---------- عنوان ---------- */
    function updateHeading() {
      var cat = state.cat ? Shop.categoryById(state.cat) : null;
      var title = state.q ? "نتایج جست‌وجو برای «" + state.q + "»"
        : cat ? cat.title
        : state.deals ? "تخفیف‌ها و پیشنهادهای ویژه"
        : "همهٔ محصولات";
      if (state.sub) title += " — " + state.sub;
      els.title.textContent = title;
      els.crumb.textContent = title;
      document.title = title + " | لاجورد";
    }

    /* ---------- فیلترها ---------- */
    function matches(p) {
      var price = p.price;
      if (price < state.minPrice || price > state.maxPrice) return false;
      if (state.inStock && !p.stock) return false;
      if (state.minRating && p.rating < state.minRating) return false;
      if (state.brands.length && state.brands.indexOf(p.brand) === -1) return false;
      if (state.colors.length) {
        var pc = productColors(p);
        var ok = state.colors.some(function (c) { return pc.indexOf(c) > -1; });
        if (!ok) return false;
      }
      return true;
    }

    function sortList(list) {
      var copy = list.slice();
      switch (state.sort) {
        case "bestseller": return copy.sort(function (a, b) { return b.reviews - a.reviews; });
        case "cheapest": return copy.sort(function (a, b) { return a.price - b.price; });
        case "expensive": return copy.sort(function (a, b) { return b.price - a.price; });
        case "newest": return copy.sort(function (a, b) { return (a.id < b.id ? 1 : -1); });
        default: return copy;
      }
    }

    function filtered() {
      return sortList(pool.filter(matches));
    }

    /* ---------- رندر ---------- */
    function render() {
      var list = filtered();
      var slice = list.slice(0, state.shown);

      Shop.renderCards(els.results, slice);
      els.empty.hidden = list.length !== 0;
      els.results.hidden = list.length === 0;

      els.count.textContent = list.length
        ? "نمایش " + Shop.toFa(slice.length) + " از " + Shop.toFa(list.length) + " محصول"
        : "محصولی یافت نشد";

      if (els.loadMore) {
        els.loadMore.hidden = slice.length >= list.length;
        els.loadMore.textContent = "مشاهدهٔ " + Shop.toFa(Math.min(PAGE_SIZE, list.length - slice.length)) + " محصول بیشتر";
      }
      renderActiveChips(list.length);
      syncControls();
    }

    function renderActiveChips(total) {
      var chips = [];
      var cat = state.cat ? Shop.categoryById(state.cat) : null;
      if (cat) chips.push({ key: "cat", label: cat.title });
      if (state.q) chips.push({ key: "q", label: "جست‌وجو: " + state.q });
      if (state.sub) chips.push({ key: "sub", label: state.sub });
      if (state.deals) chips.push({ key: "deals", label: "فقط تخفیف‌دار" });
      state.brands.forEach(function (b) {
        chips.push({ key: "brand:" + b, label: Shop.brandName(b) });
      });
      if (state.minPrice > 0 || state.maxPrice < priceCeiling) {
        chips.push({ key: "price", label: "قیمت " + Shop.money(state.minPrice) + " تا " + Shop.money(state.maxPrice) });
      }
      if (state.inStock) chips.push({ key: "stock", label: "فقط موجود" });
      if (state.minRating) chips.push({ key: "rating", label: Shop.toFa(state.minRating) + " ستاره و بالاتر" });
      state.colors.forEach(function (c) { chips.push({ key: "color:" + c, label: c }); });

      els.active.innerHTML = chips.map(function (chip) {
        return '<button class="chip is-active" type="button" data-chip="' + Shop.esc(chip.key) + '">' +
          Shop.esc(chip.label) + '<span class="chip__x" aria-hidden="true">×</span>' +
          "<span class=\"visually-hidden\">حذف فیلتر</span></button>";
      }).join("");

      els.active.hidden = !chips.length;
    }

    function syncControls() {
      $$("[data-brand-filters] input").forEach(function (input) {
        input.checked = state.brands.indexOf(input.value) > -1;
      });
      $$("[data-color-filters] button").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(state.colors.indexOf(btn.getAttribute("data-color")) > -1));
      });
      $$("[data-rating]").forEach(function (input) {
        input.checked = Number(input.value) === state.minRating;
      });
      var stock = $("[data-in-stock]");
      if (stock) stock.checked = state.inStock;
      els.priceMin.value = state.minPrice;
      els.priceMax.value = state.maxPrice;
      els.priceMinOut.textContent = Shop.money(state.minPrice) + " تومان";
      els.priceMaxOut.textContent = Shop.money(state.maxPrice) + " تومان";
      $$("[data-sort]").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.getAttribute("data-sort") === state.sort));
      });
    }

    /* ---------- فیلترهای پویا ---------- */
    function renderFacets() {
      var brandCounts = {}, colorCounts = {};
      pool.forEach(function (p) {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
        productColors(p).forEach(function (c) { colorCounts[c] = (colorCounts[c] || 0) + 1; });
      });

      var brandIds = Object.keys(brandCounts).sort(function (a, b) { return brandCounts[b] - brandCounts[a]; });
      els.brandBox.innerHTML = brandIds.map(function (id) {
        return '<label class="check"><input type="checkbox" value="' + id + '">' +
          Shop.esc(Shop.brandName(id)) + '<span class="check__count">' + Shop.toFa(brandCounts[id]) + "</span></label>";
      }).join("");

      var colors = Object.keys(colorCounts);
      els.colorBox.innerHTML = colors.map(function (name) {
        var g = COLOR_GROUPS.filter(function (x) { return x.name === name; })[0] || COLOR_GROUPS[0];
        return '<button class="chip" type="button" data-color="' + Shop.esc(name) + '" aria-pressed="false">' +
          '<span class="swatch" style="--c:' + g.hex + '" aria-hidden="true"></span>' + Shop.esc(name) +
          '<span class="check__count">' + Shop.toFa(colorCounts[name]) + "</span></button>";
      }).join("");

      els.brandBox.querySelectorAll("input").forEach(function (input) {
        input.addEventListener("change", function () {
          var b = input.value;
          var i = state.brands.indexOf(b);
          if (input.checked && i === -1) state.brands.push(b);
          if (!input.checked && i > -1) state.brands.splice(i, 1);
          changed();
        });
      });

      els.colorBox.querySelectorAll("button").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var c = btn.getAttribute("data-color");
          var i = state.colors.indexOf(c);
          if (i > -1) state.colors.splice(i, 1); else state.colors.push(c);
          changed();
        });
      });
    }

    function changed(structural) {
      if (structural) {
        pool = basePool();
        updateCeiling();
        renderFacets();
        updateHeading();
      }
      state.shown = PAGE_SIZE;
      syncUrl();
      render();
    }

    function syncUrl() {
      var p = new URLSearchParams();
      if (state.cat) p.set("cat", state.cat);
      if (state.q) p.set("q", state.q);
      if (state.sub) p.set("sub", state.sub);
      if (state.deals) p.set("deals", "1");
      if (state.brands.length) p.set("brand", state.brands.join(","));
      if (state.sort && state.sort !== "relevant") p.set("sort", state.sort);
      var qs = p.toString();
      history.replaceState(null, "", "category.html" + (qs ? "?" + qs : ""));
    }

    /* ---------- رویدادها ---------- */
    els.priceMin.addEventListener("input", function () {
      state.minPrice = Math.min(Number(els.priceMin.value), state.maxPrice);
      els.priceMinOut.textContent = Shop.money(state.minPrice) + " تومان";
    });
    els.priceMin.addEventListener("change", changed);

    els.priceMax.addEventListener("input", function () {
      state.maxPrice = Math.max(Number(els.priceMax.value), state.minPrice);
      els.priceMaxOut.textContent = Shop.money(state.maxPrice) + " تومان";
    });
    els.priceMax.addEventListener("change", changed);

    $$("[data-sort]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.sort = btn.getAttribute("data-sort");
        state.shown = PAGE_SIZE;
        syncUrl();
        render();
      });
    });

    var stockInput = $("[data-in-stock]");
    if (stockInput) {
      stockInput.addEventListener("change", function () {
        state.inStock = stockInput.checked;
        changed();
      });
    }

    $$("[data-rating]").forEach(function (input) {
      input.addEventListener("change", function () {
        state.minRating = input.checked ? Number(input.value) : 0;
        changed();
      });
    });

    if (els.loadMore) {
      els.loadMore.addEventListener("click", function () {
        state.shown += PAGE_SIZE;
        render();
      });
    }

    els.active.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-chip]");
      if (!chip) return;
      var key = chip.getAttribute("data-chip");
      if (key === "cat") state.cat = "";
      else if (key === "q") state.q = "";
      else if (key === "sub") state.sub = "";
      else if (key === "deals") state.deals = false;
      else if (key === "price") { state.minPrice = 0; state.maxPrice = priceCeiling; }
      else if (key === "stock") state.inStock = false;
      else if (key === "rating") state.minRating = 0;
      else if (key.indexOf("brand:") === 0) {
        var b = key.slice(6);
        state.brands = state.brands.filter(function (x) { return x !== b; });
      } else if (key.indexOf("color:") === 0) {
        var c = key.slice(6);
        state.colors = state.colors.filter(function (x) { return x !== c; });
      }
      if (key === "cat" || key === "q" || key === "sub" || key === "deals") {
        changed(true);
      } else {
        changed(false);
      }
    });

    function resetAll() {
      state.brands = [];
      state.colors = [];
      state.minPrice = 0;
      state.maxPrice = priceCeiling;
      state.inStock = false;
      state.minRating = 0;
      state.sort = "relevant";
      state.shown = PAGE_SIZE;
      changed();
    }
    $$("[data-reset-filters]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        resetAll();
      });
    });

    if (els.toggle && els.panel) {
      els.toggle.addEventListener("click", function () {
        var open = els.panel.hidden;
        els.panel.hidden = !open;
        els.toggle.setAttribute("aria-expanded", String(open));
      });
    }

    /* ---------- شروع ---------- */
    updateHeading();
    renderFacets();
    render();
  });
})();
