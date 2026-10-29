/* ==========================================================================
   NUTRISYNC – catalog.js
   Chỉ nạp ở trang Cửa hàng (index.html).
   Nhiệm vụ:
   - Render danh mục + sản phẩm từ data.js
   - Lọc sản phẩm theo từ khoá
   - Mở modal chi tiết, hộp xác nhận thêm vào giỏ
   - Xử lý nút cuộn ngang của từng danh mục
   ========================================================================== */

window.NUTRISYNC = window.NUTRISYNC || {};

(function (NS) {
  'use strict';

  var catalogRoot = document.querySelector('[data-catalog]');
  if (!catalogRoot || !NS.products) return;

  var ui = NS.ui || {};
  var formatPrice = NS.formatPrice;

  /* ------------------------------------------------------------------------
     TIỆN ÍCH
     ------------------------------------------------------------------------ */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Bỏ dấu tiếng Việt để tìm kiếm dễ hơn: "cơm lứt" khớp "com lut"
  function normalizeText(value) {
    return String(value)
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  function iconMarkup(symbolId) {
    return '<svg class="icon" aria-hidden="true"><use href="#' + symbolId + '"></use></svg>';
  }

  function categoryOf(product) {
    return NS.getCategory(product.category) || { title: '', description: '' };
  }

  /* ------------------------------------------------------------------------
     RENDER DANH MỤC
     ------------------------------------------------------------------------ */
  function productCard(product) {
    var category = categoryOf(product);
    var tagClass =
      'product-card__tag' + (product.oldPrice ? ' product-card__tag--sale' : '');

    var oldPrice = product.oldPrice
      ? '<span class="price__old">' + formatPrice(product.oldPrice) + '</span>'
      : '';

    var tag = product.tag
      ? '<span class="' + tagClass + '">' + escapeHtml(product.tag) + '</span>'
      : '';

    var searchText = normalizeText(
      [
        product.name,
        product.short,
        product.ingredients,
        product.tag,
        category.title
      ].join(' ')
    );

    return (
      '<article class="product-card" data-card data-id="' + product.id + '"' +
      ' data-category="' + product.category + '" data-search="' + escapeHtml(searchText) + '">' +
        '<div class="product-card__media">' +
          '<a class="product-card__open" href="#' + product.id + '" data-open-product="' + product.id + '"' +
          ' aria-label="Xem chi tiết ' + escapeHtml(product.name) + '">' +
            '<img src="' + product.image + '" alt="' + escapeHtml(product.name) + '"' +
            ' width="1200" height="896" loading="lazy">' +
          '</a>' +
          tag +
          '<button class="product-card__quick" type="button" data-quick-add="' + product.id + '"' +
          ' aria-label="Thêm ' + escapeHtml(product.name) + ' vào giỏ">' +
            iconMarkup('i-plus') +
          '</button>' +
        '</div>' +
        '<div class="product-card__body">' +
          '<h4><a href="#' + product.id + '" data-open-product="' + product.id + '">' +
            escapeHtml(product.name) +
          '</a></h4>' +
          '<p class="product-card__short">' + escapeHtml(product.short) + '</p>' +
          '<ul class="product-card__macros" aria-label="Dinh dưỡng mỗi phần">' +
            '<li><strong>' + escapeHtml(product.macros.protein) + '</strong><span>Protein</span></li>' +
            '<li><strong>' + escapeHtml(product.macros.carbs) + '</strong><span>Carb</span></li>' +
            '<li><strong>' + escapeHtml(product.macros.fat) + '</strong><span>Fat</span></li>' +
          '</ul>' +
          '<div class="product-card__foot">' +
            '<div class="price">' +
              '<span class="price__now">' + formatPrice(product.price) + '</span>' +
              oldPrice +
            '</div>' +
            '<button class="product-card__add" type="button" data-quick-add="' + product.id + '"' +
            ' aria-label="Thêm ' + escapeHtml(product.name) + ' vào giỏ">' +
              iconMarkup('i-cart') + '<span>Thêm</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderCatalog() {
    var html = '';

    NS.categories.forEach(function (category) {
      var products = NS.products.filter(function (product) {
        return product.category === category.id;
      });

      if (!products.length) return;

      html +=
        '<section class="menu-group" data-group="' + category.id + '" aria-labelledby="group-' + category.id + '">' +
          '<header class="menu-group__head">' +
            '<div>' +
              '<h3 id="group-' + category.id + '">' +
                escapeHtml(category.title) +
                ' <span data-group-count>' + products.length + '</span>' +
              '</h3>' +
              '<p>' + escapeHtml(category.description) + '</p>' +
            '</div>' +
            '<div class="menu-group__nav" data-track-nav>' +
              '<button class="round-btn" type="button" data-track-prev aria-label="Xem món trước">' +
                iconMarkup('i-arrow-left') +
              '</button>' +
              '<button class="round-btn" type="button" data-track-next aria-label="Xem món tiếp theo">' +
                iconMarkup('i-arrow-right') +
              '</button>' +
            '</div>' +
          '</header>' +
          '<div class="product-track" data-track tabindex="0" role="region"' +
          ' aria-label="Danh sách món ' + escapeHtml(category.title) + '">' +
            products.map(productCard).join('') +
          '</div>' +
        '</section>';
    });

    // Khối thông báo khi không tìm thấy món
    html +=
      '<div class="catalog-empty" data-empty hidden>' +
        '<div class="catalog-empty__icon">' + iconMarkup('i-search') + '</div>' +
        '<h3>Không tìm thấy món phù hợp</h3>' +
        '<p>Thử tìm “salad”, “cơm lứt” hoặc xoá từ khoá để xem toàn bộ thực đơn.</p>' +
        '<button class="btn btn--outline" type="button" data-clear-search>Xoá tìm kiếm</button>' +
      '</div>';

    catalogRoot.innerHTML = html;
  }

  renderCatalog();

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
  var searchStatus = document.querySelector('[data-search-status]');
  var emptyState = catalogRoot.querySelector('[data-empty]');
  var allCards = Array.prototype.slice.call(catalogRoot.querySelectorAll('[data-card]'));

  /* ------------------------------------------------------------------------
     TÌM KIẾM / LỌC
     ------------------------------------------------------------------------ */
  function applyFilter(rawQuery) {
    var query = normalizeText(rawQuery);
    var tokens = query ? query.split(/\s+/) : [];
    var totalVisible = 0;

    NS.categories.forEach(function (category) {
      var group = catalogRoot.querySelector('[data-group="' + category.id + '"]');
      if (!group) return;

      var cards = Array.prototype.slice.call(group.querySelectorAll('[data-card]'));
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = card.getAttribute('data-search') || '';
        var matched = tokens.every(function (token) {
          return haystack.indexOf(token) !== -1;
        });

        card.hidden = !matched;
        if (matched) visible += 1;
      });

      group.hidden = visible === 0;
      totalVisible += visible;

      var count = group.querySelector('[data-group-count]');
      if (count) count.textContent = String(visible);
    });

    if (emptyState) emptyState.hidden = totalVisible !== 0;

    if (searchStatus) {
      if (!query) {
        searchStatus.textContent = '';
        searchStatus.classList.remove('is-error');
      } else if (totalVisible === 0) {
        searchStatus.textContent = 'Không tìm thấy món nào cho “' + rawQuery.trim() + '”.';
        searchStatus.classList.add('is-error');
      } else {
        searchStatus.textContent =
          'Tìm thấy ' + totalVisible + ' món phù hợp với “' + rawQuery.trim() + '”.';
        searchStatus.classList.remove('is-error');
      }
    }

    updateAllTrackControls();
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      applyFilter(input.value);
    });
  });

  // Nút xoá từ khoá trong trạng thái trống
  catalogRoot.addEventListener('click', function (event) {
    if (!event.target.closest('[data-clear-search]')) return;

    searchInputs.forEach(function (input) {
      input.value = '';
    });
    applyFilter('');

    var inline = document.querySelector('.inline-search [data-search]');
    if (inline) inline.focus({ preventScroll: true });
  });

  /* ------------------------------------------------------------------------
     NÚT CUỘN NGANG TỪNG DANH MỤC
     ------------------------------------------------------------------------ */
  function trackStep(track) {
    var card = track.querySelector('[data-card]:not([hidden])');
    if (!card) return track.clientWidth * 0.8;

    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function updateTrackControls(group) {
    var track = group.querySelector('[data-track]');
    var nav = group.querySelector('[data-track-nav]');
    var prev = group.querySelector('[data-track-prev]');
    var next = group.querySelector('[data-track-next]');
    if (!track || !nav || !prev || !next) return;

    var maxScroll = track.scrollWidth - track.clientWidth;
    var notScrollable = maxScroll < 8;

    // Ẩn nút nếu danh mục không đủ dài để cuộn
    nav.hidden = notScrollable;
    if (notScrollable) return;

    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll - 2;
  }

  var groups = Array.prototype.slice.call(catalogRoot.querySelectorAll('[data-group]'));

  function updateAllTrackControls() {
    groups.forEach(updateTrackControls);
  }

  groups.forEach(function (group) {
    var track = group.querySelector('[data-track]');
    var prev = group.querySelector('[data-track-prev]');
    var next = group.querySelector('[data-track-next]');
    if (!track) return;

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -trackStep(track), behavior: 'smooth' });
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: trackStep(track), behavior: 'smooth' });
      });
    }

    var ticking = false;
    track.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateTrackControls(group);
          ticking = false;
        });
      },
      { passive: true }
    );
  });

  // Cập nhật khi đổi kích thước màn hình
  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateAllTrackControls, 150);
  });

  // Ảnh tải xong có thể làm thay đổi chiều rộng track
  window.addEventListener('load', updateAllTrackControls);
  updateAllTrackControls();

  /* ------------------------------------------------------------------------
     MODAL CHI TIẾT SẢN PHẨM
     ------------------------------------------------------------------------ */
  var productDialog = document.getElementById('product-modal');
  var productContent = productDialog ? productDialog.querySelector('[data-product-content]') : null;
  var confirmDialog = document.getElementById('confirm-modal');
  var confirmName = confirmDialog ? confirmDialog.querySelector('[data-confirm-name]') : null;
  var confirmQty = confirmDialog ? confirmDialog.querySelector('[data-confirm-qty]') : null;
  var confirmPrice = confirmDialog ? confirmDialog.querySelector('[data-confirm-price]') : null;
  var pendingItem = null;

  function productTemplate(product) {
    var category = categoryOf(product);
    var oldPrice = product.oldPrice
      ? '<span class="price__old">' + formatPrice(product.oldPrice) + '</span>'
      : '';

    var specs = product.specs
      .map(function (row) {
        return (
          '<div><dt>' + escapeHtml(row[0]) + '</dt><dd>' + escapeHtml(row[1]) + '</dd></div>'
        );
      })
      .join('');

    return (
      '<div class="product">' +
        '<div class="product__media">' +
          '<img src="' + product.image + '" alt="' + escapeHtml(product.name) + '"' +
          ' width="1200" height="896">' +
          (product.tag
            ? '<span class="product__tag">' + escapeHtml(product.tag) + '</span>'
            : '') +
        '</div>' +
        '<div class="product__body">' +
          '<p class="eyebrow">' + escapeHtml(category.title) + '</p>' +
          '<h2 class="product__title" id="product-title">' + escapeHtml(product.name) + '</h2>' +
          '<p class="product__desc">' + escapeHtml(product.description) + '</p>' +

          '<div class="product__macros">' +
            '<div><strong>' + escapeHtml(product.macros.protein) + '</strong><span>Protein</span></div>' +
            '<div><strong>' + escapeHtml(product.macros.carbs) + '</strong><span>Carb</span></div>' +
            '<div><strong>' + escapeHtml(product.macros.fat) + '</strong><span>Fat</span></div>' +
          '</div>' +

          '<dl class="product__specs">' + specs + '</dl>' +
          '<p class="product__ingredients"><strong>Thành phần:</strong> ' +
            escapeHtml(product.ingredients) +
          '</p>' +

          '<div class="product__buy">' +
            '<div class="price">' +
              '<span class="price__now">' + formatPrice(product.price) + '</span>' +
              oldPrice +
            '</div>' +
            '<div class="qty" data-product-qty>' +
              '<button type="button" data-qty-step="-1" aria-label="Giảm số lượng">' +
                iconMarkup('i-minus') +
              '</button>' +
              '<input type="number" min="1" max="20" value="1" inputmode="numeric"' +
              ' aria-label="Số lượng" data-product-qty-input>' +
              '<button type="button" data-qty-step="1" aria-label="Tăng số lượng">' +
                iconMarkup('i-plus') +
              '</button>' +
            '</div>' +
            '<button class="btn btn--primary" type="button" data-product-add="' + product.id + '">' +
              iconMarkup('i-cart') + 'Thêm vào giỏ' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function openProduct(productId) {
    var product = NS.getProduct(productId);
    if (!product || !productDialog || !productContent || !ui.openDialog) return;

    productContent.innerHTML = productTemplate(product);
    ui.openDialog(productDialog, document.activeElement);

    // Cho phép chia sẻ đường dẫn #id
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + product.id);
    }
  }

  // Đóng modal sản phẩm → xoá hash tương ứng
  if (productDialog) {
    productDialog.addEventListener('close', function () {
      if (!window.history || !window.history.replaceState) return;
      var hash = window.location.hash.replace('#', '');
      if (hash && NS.getProduct(hash)) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    });
  }

  /* ------------------------------------------------------------------------
     HỘP XÁC NHẬN THÊM VÀO GIỎ
     ------------------------------------------------------------------------ */
  function openConfirm(product, qty) {
    if (!confirmDialog || !ui.openDialog) return;

    pendingItem = { id: product.id, qty: qty };

    if (confirmName) confirmName.textContent = product.name;
    if (confirmQty) confirmQty.textContent = String(qty);
    if (confirmPrice) confirmPrice.textContent = formatPrice(product.price * qty);

    ui.openDialog(confirmDialog, document.activeElement);
  }

  // Nút xác nhận trong hộp thoại
  var confirmAdd = confirmDialog ? confirmDialog.querySelector('[data-confirm-add]') : null;
  if (confirmAdd) {
    confirmAdd.addEventListener('click', function () {
      if (!pendingItem) return;

      if (NS.cart && typeof NS.cart.add === 'function') {
        NS.cart.add(pendingItem.id, pendingItem.qty);
      } else if (ui.toast) {
        ui.toast('Giỏ hàng chưa sẵn sàng, vui lòng thử lại.');
      }

      pendingItem = null;
      if (ui.closeDialog) ui.closeDialog(confirmDialog);
    });
  }

  /* ------------------------------------------------------------------------
     SỰ KIỆN MỞ SẢN PHẨM / THÊM NHANH
     ------------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var openTrigger = event.target.closest('[data-open-product]');
    if (openTrigger) {
      event.preventDefault();
      openProduct(openTrigger.getAttribute('data-open-product'));
      return;
    }

    var quickAdd = event.target.closest('[data-quick-add]');
    if (quickAdd) {
      event.preventDefault();
      var product = NS.getProduct(quickAdd.getAttribute('data-quick-add'));
      if (product) openConfirm(product, 1);
    }
  });

  // Tăng / giảm số lượng trong modal sản phẩm
  if (productContent) {
    productContent.addEventListener('click', function (event) {
      var stepBtn = event.target.closest('[data-qty-step]');
      if (!stepBtn) return;

      var input = productContent.querySelector('[data-product-qty-input]');
      if (!input) return;

      var current = parseInt(input.value, 10) || 1;
      var step = parseInt(stepBtn.getAttribute('data-qty-step'), 10) || 0;
      input.value = String(Math.min(20, Math.max(1, current + step)));
    });

    productContent.addEventListener('change', function (event) {
      var input = event.target.closest('[data-product-qty-input]');
      if (!input) return;
      var value = parseInt(input.value, 10) || 1;
      input.value = String(Math.min(20, Math.max(1, value)));
    });

    productContent.addEventListener('click', function (event) {
      var addBtn = event.target.closest('[data-product-add]');
      if (!addBtn) return;

      var product = NS.getProduct(addBtn.getAttribute('data-product-add'));
      var input = productContent.querySelector('[data-product-qty-input]');
      var qty = input ? parseInt(input.value, 10) || 1 : 1;
      if (product) openConfirm(product, Math.min(20, Math.max(1, qty)));
    });
  }

  /* ------------------------------------------------------------------------
     MỞ SẢN PHẨM TỪ URL (#salad-ca-ngu)
     ------------------------------------------------------------------------ */
  function openFromHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash || hash === 'search') return;

    var product = NS.getProduct(hash);
    if (product) openProduct(product.id);
  }

  window.setTimeout(openFromHash, 80);

  // Cho phép module khác mở sản phẩm nếu cần
  NS.catalog = { openProduct: openProduct };
})(window.NUTRISYNC);
