/* ==========================================================================
   Static pages — اعتبارسنجی فرم تماس (بدون بک‌اند)
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

    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var success = document.querySelector("[data-contact-success]");

    var rules = {
      name: function (v) {
        if (!v.trim()) return "نام خود را وارد کنید.";
        if (v.trim().length < 3) return "نام باید حداقل ۳ حرف باشد.";
        return "";
      },
      phone: function (v) {
        var digits = Shop.toEnDigits(v).replace(/[\s()-]/g, "");
        if (!digits) return "شمارهٔ موبایل را وارد کنید.";
        if (!/^(?:\+98|0098|0)?9\d{9}$/.test(digits)) return "شمارهٔ موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷).";
        return "";
      },
      email: function (v) {
        if (!v.trim()) return "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "ایمیل معتبر نیست.";
        return "";
      },
      subject: function (v) {
        return v ? "" : "موضوع پیام را انتخاب کنید.";
      },
      message: function (v) {
        if (!v.trim()) return "متن پیام را بنویسید.";
        if (v.trim().length < 10) return "پیام باید حداقل ۱۰ حرف باشد.";
        return "";
      }
    };

    function setError(name, message) {
      var field = form.elements[name];
      var error = form.querySelector('[data-error-for="' + name + '"]');
      if (error) error.textContent = message;
      if (field) {
        if (message) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
      }
    }

    function validateField(name) {
      var field = form.elements[name];
      if (!field || !rules[name]) return "";
      var message = rules[name](field.value);
      setError(name, message);
      return message;
    }

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", function () { validateField(name); });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(name);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;

      Object.keys(rules).forEach(function (name) {
        if (validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
      });

      if (firstInvalid) {
        firstInvalid.focus();
        Shop.toast("لطفاً خطاهای فرم را بررسی کنید.", "error");
        return;
      }

      form.reset();
      Object.keys(rules).forEach(function (name) { setError(name, ""); });
      if (success) {
        success.hidden = false;
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
      Shop.toast("پیام شما ثبت شد. ممنون از تماس شما!");
    });
  });
})();
