/* ==========================================================================
   NUTRISYNC – cart.js
   Quản lý giỏ hàng phía client:
   - Lưu trong sessionStorage: còn khi chuyển trang / tải lại, mất khi đóng tab
   - Thêm, xoá, tăng giảm số lượng
   - Áp mã giảm giá (demo)
   - Kiểm tra form và mô phỏng đặt hàng thành công
   ========================================================================== */

window.NUTRISYNC = window.NUTRISYNC || {};

(function (NS) {
  'use strict';

  var STORAGE_KEY = 'nutrisync-cart-v1';
  var MAX_QTY = 20;

  var cartDialog = document.getElementById('cart-modal');
  var successDialog = document.getElementById('success-modal');
  if (!cartDialog) return;

  var ui = NS.ui || {};
  var formatPrice = NS.formatPrice || function (value) {
    return String(value) + 'đ';
  };

  /* ------------------------------------------------------------------------
     TRẠNG THÁI GIỎ HÀNG
     ------------------------------------------------------------------------ */
  var items = loadCart();
  var appliedCoupon = null;
  var processing = false;

  function loadCart() {
    var raw;
    try {
      raw = window.sessionStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return [];
    }

    if (!raw) return [];

    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return [];
    }

    if (!Array.isArray(parsed)) return [];

    var safe = [];

    parsed.forEach(function (entry) {
      if (!entry || !entry.id) return;

      var product = NS.getProduct(entry.id);
      var qty = parseInt(entry.qty, 10);

      if (!product || !qty || qty < 1) return;

      // Gộp nếu file lưu cũ có sản phẩm trùng
      var existing = safe.find(function (item) {
        return item.id === entry.id;
      });

      if (existing) {
        existing.qty = Math.min(MAX_QTY, existing.qty + qty);
      } else {
        safe.push({ id: entry.id, qty: Math.min(MAX_QTY, qty) });
      }
    });

    return safe;
  }

  function saveCart() {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      /* Trình duyệt chặn storage: giỏ vẫn hoạt động trong phiên hiện tại */
    }
  }

  function getCount() {
    return items.reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function getSubtotal() {
    return items.reduce(function (sum, item) {
      var product = NS.getProduct(item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  function getDiscount(subtotal) {
    if (!appliedCoupon) return 0;

    var coupon = NS.config.coupons[appliedCoupon];
    if (!coupon) return 0;

    if (coupon.type === 'percent') {
      return Math.round((subtotal * coupon.value) / 100);
    }

    return Math.min(subtotal, coupon.value);
  }

  function getTotals() {
    var subtotal = getSubtotal();
    var discount = getDiscount(subtotal);
    return {
      subtotal: subtotal,
      discount: discount,
      grand: Math.max(0, subtotal - discount)
    };
  }

  /* ------------------------------------------------------------------------
     HIỂN THỊ SỐ LƯỢNG TRÊN HEADER
     ------------------------------------------------------------------------ */
  function updateBadge() {
    var count = getCount();

    Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (badge) {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.hidden = count === 0;
    });
  }

  /* ------------------------------------------------------------------------
     TẠO MARKUP
     ------------------------------------------------------------------------ */
  var iconCache = {};

  function iconMarkup(symbolId) {
    if (!iconCache[symbolId]) {
      iconCache[symbolId] =
        '<svg class="icon" aria-hidden="true"><use href="#' + symbolId + '"></use></svg>';
    }
    return iconCache[symbolId];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cartItemMarkup(item) {
    var product = NS.getProduct(item.id);
    if (!product) return '';

    var lineTotal = product.price * item.qty;

    return (
      '<article class="cart-item" data-cart-item="' + product.id + '">' +
        '<div class="cart-item__media">' +
          '<img src="' + product.image + '" alt="' + escapeHtml(product.name) + '"' +
          ' width="1200" height="896" loading="lazy">' +
        '</div>' +
        '<div class="cart-item__info">' +
          '<h4>' + escapeHtml(product.name) + '</h4>' +
          '<p>' + formatPrice(product.price) + ' / phần</p>' +
        '</div>' +
        '<div class="cart-item__side">' +
          '<span class="cart-item__total">' + formatPrice(lineTotal) + '</span>' +
          '<button class="cart-item__remove" type="button" data-cart-remove="' + product.id + '"' +
          ' aria-label="Xoá ' + escapeHtml(product.name) + ' khỏi giỏ">' +
            iconMarkup('i-trash') +
          '</button>' +
        '</div>' +
        '<div class="cart-item__bottom">' +
          '<div class="qty" role="group" aria-label="Số lượng ' + escapeHtml(product.name) + '">' +
            '<button type="button" data-cart-step="-1" data-id="' + product.id + '"' +
            (item.qty <= 1 ? ' disabled' : '') +
            ' aria-label="Giảm số lượng ' + escapeHtml(product.name) + '">' +
              iconMarkup('i-minus') +
            '</button>' +
            '<output aria-live="polite">' + item.qty + '</output>' +
            '<button type="button" data-cart-step="1" data-id="' + product.id + '"' +
            (item.qty >= MAX_QTY ? ' disabled' : '') +
            ' aria-label="Tăng số lượng ' + escapeHtml(product.name) + '">' +
              iconMarkup('i-plus') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  var emptyMarkup =
    '<div class="cart-empty">' +
      '<div class="cart-empty__icon">' + iconMarkup('i-cart') + '</div>' +
      '<h4>Giỏ hàng đang trống</h4>' +
      '<p>Thêm vài món ngon lành để bắt đầu ngày học của bạn nhé.</p>' +
      '<button class="btn btn--primary" type="button" data-empty-browse>Khám phá thực đơn</button>' +
    '</div>';

  /* ------------------------------------------------------------------------
     RENDER GIỎ HÀNG
     ------------------------------------------------------------------------ */
  var itemsRoot = cartDialog.querySelector('[data-cart-items]');
  var itemsCount = cartDialog.querySelector('[data-cart-items-count]');
  var countLabel = cartDialog.querySelector('[data-cart-count-label]');
  var summaryTotal = cartDialog.querySelector('[data-cart-total]');
  var subtotalEl = cartDialog.querySelector('[data-cart-subtotal]');
  var discountRow = cartDialog.querySelector('[data-discount-row]');
  var discountEl = cartDialog.querySelector('[data-cart-discount]');
  var grandEl = cartDialog.querySelector('[data-cart-grand]');
  var couponLabel = cartDialog.querySelector('[data-coupon-label]');
  var checkoutForm = cartDialog.querySelector('[data-checkout-form]');
  var checkoutBtn = cartDialog.querySelector('[data-checkout-submit]');
  var couponInput = cartDialog.querySelector('[data-coupon-input]');
  var couponBtn = cartDialog.querySelector('[data-apply-coupon]');
  var couponStatus = cartDialog.querySelector('[data-coupon-status]');
  var phoneInput = cartDialog.querySelector('[data-phone]');
  var addressInput = cartDialog.querySelector('[data-address]');

  function renderTotals() {
    var totals = getTotals();
    var count = getCount();

    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (grandEl) grandEl.textContent = formatPrice(totals.grand);
    if (summaryTotal) summaryTotal.textContent = formatPrice(totals.grand);
    if (countLabel) countLabel.textContent = String(count);
    if (itemsCount) itemsCount.textContent = count + ' món';

    if (discountRow && discountEl && couponLabel) {
      discountRow.hidden = totals.discount === 0;
      discountEl.textContent = '-' + formatPrice(totals.discount);
      couponLabel.textContent = appliedCoupon ? '(' + appliedCoupon + ')' : '';
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = count === 0 || processing;
    }
  }

  function renderCart() {
    var count = getCount();

    if (itemsRoot) {
      if (count === 0) {
        itemsRoot.innerHTML = emptyMarkup;
      } else {
        itemsRoot.innerHTML = items
          .map(cartItemMarkup)
          .filter(Boolean)
          .join('');
      }
    }

    // Giỏ trống thì bỏ mã giảm giá đang áp
    if (count === 0 && appliedCoupon) {
      appliedCoupon = null;
      if (couponInput) couponInput.value = '';
      if (couponStatus) {
        couponStatus.textContent = '';
        couponStatus.classList.remove('is-error');
      }
    } else if (appliedCoupon && couponStatus) {
      var coupon = NS.config.coupons[appliedCoupon];
      couponInput.value = appliedCoupon;
      couponStatus.textContent = coupon ? coupon.label + ' đang được áp dụng.' : '';
      couponStatus.classList.remove('is-error');
    }

    renderTotals();
  }

  /* ------------------------------------------------------------------------
     API: THÊM / XOÁ / ĐỔI SỐ LƯỢNG
     ------------------------------------------------------------------------ */
  function add(productId, qty) {
    var product = NS.getProduct(productId);
    if (!product) return;

    var amount = Math.max(1, parseInt(qty, 10) || 1);
    var entry = items.find(function (item) {
      return item.id === productId;
    });

    if (entry) {
      entry.qty = Math.min(MAX_QTY, entry.qty + amount);
    } else {
      items.push({ id: productId, qty: Math.min(MAX_QTY, amount) });
    }

    saveCart();
    updateBadge();

    if (cartDialog.open) renderCart();

    if (ui.toast) {
      ui.toast('Đã thêm “' + product.name + '” vào giỏ hàng.');
    }
  }

  function setQty(productId, qty) {
    var entry = items.find(function (item) {
      return item.id === productId;
    });
    if (!entry) return;

    entry.qty = Math.min(MAX_QTY, Math.max(1, qty));
    saveCart();
    updateBadge();
    renderCart();
  }

  function removeItem(productId) {
    var product = NS.getProduct(productId);
    var before = items.length;

    items = items.filter(function (item) {
      return item.id !== productId;
    });

    if (items.length === before) return;

    saveCart();
    updateBadge();
    renderCart();

    if (product && ui.toast) {
      ui.toast('Đã xoá “' + product.name + '” khỏi giỏ hàng.');
    }
  }

  NS.cart = {
    add: add,
    remove: removeItem,
    setQty: setQty,
    getCount: getCount,
    getTotals: getTotals,
    open: function () {
      if (ui.openDialog) ui.openDialog(cartDialog, document.activeElement);
      renderCart();
    }
  };

  /* ------------------------------------------------------------------------
     SỰ KIỆN TRONG GIỎ HÀNG
     ------------------------------------------------------------------------ */

  // app.js phát sự kiện sau khi mở dialog → render nội dung mới nhất
  document.addEventListener('nutrisync:dialogopen', function (event) {
    if (event.detail && event.detail.id === 'cart-modal') renderCart();
  });

  cartDialog.addEventListener('click', function (event) {
    // Tăng / giảm số lượng
    var stepBtn = event.target.closest('[data-cart-step]');
    if (stepBtn) {
      var id = stepBtn.getAttribute('data-id');
      var step = parseInt(stepBtn.getAttribute('data-cart-step'), 10) || 0;
      var entry = items.find(function (item) {
        return item.id === id;
      });

      if (entry) {
        setQty(id, entry.qty + step);

        // Giữ focus ở nút vừa bấm sau khi render lại
        var selector =
          '[data-cart-step="' + step + '"][data-id="' + id + '"]';
        var nextBtn = cartDialog.querySelector(selector);
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.focus({ preventScroll: true });
        }
      }
      return;
    }

    // Xoá món
    var removeBtn = event.target.closest('[data-cart-remove]');
    if (removeBtn) {
      removeItem(removeBtn.getAttribute('data-cart-remove'));
      return;
    }

    // Nút "Khám phá thực đơn" khi giỏ trống
    var browseBtn = event.target.closest('[data-empty-browse]');
    if (browseBtn) {
      if (ui.closeDialog) ui.closeDialog(cartDialog);

      if (document.body.classList.contains('page-store')) {
        var menu = document.getElementById('menu');
        if (menu) {
          window.setTimeout(function () {
            menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      } else {
        window.location.href = 'index.html#menu';
      }
    }
  });

  /* ------------------------------------------------------------------------
     MÃ GIẢM GIÁ
     ------------------------------------------------------------------------ */
  function setCouponMessage(message, isError) {
    if (!couponStatus) return;
    couponStatus.textContent = message;
    couponStatus.classList.toggle('is-error', Boolean(isError));
  }

  function applyCoupon() {
    if (!couponInput) return;

    var code = couponInput.value.trim().toUpperCase();
    var coupons = (NS.config && NS.config.coupons) || {};

    if (!code) {
      appliedCoupon = null;
      setCouponMessage('Vui lòng nhập mã giảm giá.', true);
      renderTotals();
      return;
    }

    if (coupons[code]) {
      appliedCoupon = code;
      couponInput.value = code;
      setCouponMessage(coupons[code].label + ' đã được áp dụng.', false);
    } else {
      appliedCoupon = null;
      setCouponMessage('Mã “' + code + '” không hợp lệ hoặc đã hết hạn.', true);
    }

    renderTotals();
  }

  if (couponBtn) {
    couponBtn.addEventListener('click', applyCoupon);
  }

  if (couponInput) {
    // Enter trong ô mã giảm giá không submit cả form
    couponInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyCoupon();
      }
    });
  }

  /* ------------------------------------------------------------------------
     VALIDATE FORM
     ------------------------------------------------------------------------ */
  function setFieldError(input, message) {
    if (!input) return;

    var errorEl = checkoutForm.querySelector('[data-error-for="' + input.name + '"]');
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');

    if (errorEl) errorEl.textContent = message || '';
  }

  function validateCheckout() {
    var valid = true;
    var firstInvalid = null;

    var phone = phoneInput ? phoneInput.value.replace(/[\s.-]/g, '') : '';
    var phoneOk = /^(0\d{9}|\+84\d{9})$/.test(phone);

    if (!phoneOk) {
      setFieldError(phoneInput, 'Vui lòng nhập số điện thoại 10 số (ví dụ: 0901234567).');
      valid = false;
      firstInvalid = firstInvalid || phoneInput;
    } else {
      setFieldError(phoneInput, '');
    }

    var address = addressInput ? addressInput.value.trim() : '';
    if (address.length < 8) {
      setFieldError(addressInput, 'Vui lòng nhập địa chỉ nhận hàng chi tiết (ít nhất 8 ký tự).');
      valid = false;
      firstInvalid = firstInvalid || addressInput;
    } else {
      setFieldError(addressInput, '');
    }

    if (firstInvalid) firstInvalid.focus();

    return valid;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      if (phoneInput.classList.contains('is-invalid')) setFieldError(phoneInput, '');
    });
  }

  if (addressInput) {
    addressInput.addEventListener('input', function () {
      if (addressInput.classList.contains('is-invalid')) setFieldError(addressInput, '');
    });
  }

  /* ------------------------------------------------------------------------
     ĐẶT HÀNG (MÔ PHỎNG)
     ------------------------------------------------------------------------ */
  function makeOrderCode() {
    var stamp = String(Date.now()).slice(-6);
    var random = Math.floor(Math.random() * 90) + 10;
    return 'NS' + stamp + random;
  }

  function resetCheckoutForm() {
    if (!checkoutForm) return;

    checkoutForm.reset();
    setFieldError(phoneInput, '');
    setFieldError(addressInput, '');
    setCouponMessage('', false);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (processing) return;

      if (getCount() === 0) {
        if (ui.toast) ui.toast('Giỏ hàng đang trống. Hãy chọn món trước nhé!', { type: 'error' });
        return;
      }

      if (!validateCheckout()) return;

      var totals = getTotals();
      var phone = phoneInput.value.trim();
      var orderCode = makeOrderCode();

      processing = true;

      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Đang xử lý...';
      }

      // Mô phỏng độ trễ gọi API
      window.setTimeout(function () {
        var codeEl = successDialog ? successDialog.querySelector('[data-success-code]') : null;
        var totalEl = successDialog ? successDialog.querySelector('[data-success-total]') : null;
        var phoneEl = successDialog ? successDialog.querySelector('[data-success-phone]') : null;

        if (codeEl) codeEl.textContent = orderCode;
        if (totalEl) totalEl.textContent = formatPrice(totals.grand);
        if (phoneEl) phoneEl.textContent = phone;

        // Đơn demo: xoá giỏ sau khi "đặt hàng"
        items = [];
        appliedCoupon = null;
        saveCart();
        updateBadge();
        renderCart();
        resetCheckoutForm();

        processing = false;

        if (checkoutBtn) {
          checkoutBtn.disabled = true; // giỏ đã trống
          checkoutBtn.textContent = 'Xác nhận thanh toán';
        }

        if (ui.closeDialog) ui.closeDialog(cartDialog);
        if (successDialog && ui.openDialog) ui.openDialog(successDialog, checkoutBtn);
      }, 650);
    });
  }

  /* ------------------------------------------------------------------------
     KHỞI TẠO
     ------------------------------------------------------------------------ */
  updateBadge();
  renderCart();
})(window.NUTRISYNC);
