/* ==========================================================================
   NUTRISYNC – app.js
   Logic dùng chung cho cả 3 trang:
   - Header sticky + menu mobile
   - Quản lý dialog (giỏ hàng, sản phẩm, liên hệ, xác nhận, thành công)
   - Accordion trang Về chúng tôi
   - Hiệu ứng reveal khi cuộn
   - Toast, điền thông tin liên hệ, tìm kiếm, nút "sắp ra mắt"
   Lưu ý: script chạy với defer nên DOM đã sẵn sàng.
   ========================================================================== */

window.NUTRISYNC = window.NUTRISYNC || {};

(function (NS) {
  'use strict';

  // Đánh dấu JS đã chạy – CSS dùng class này để bật hiệu ứng reveal.
  document.documentElement.classList.add('js');

  var doc = document;
  var body = doc.body;

  /* ------------------------------------------------------------------------
     TIỆN ÍCH NHỎ
     ------------------------------------------------------------------------ */

  // Tạo icon SVG tham chiếu tới sprite trong HTML
  function createIcon(symbolId) {
    var svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var use = doc.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', '#' + symbolId);
    svg.appendChild(use);
    return svg;
  }

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  /* ------------------------------------------------------------------------
     TOAST – thông báo nhỏ ở góc màn hình
     ------------------------------------------------------------------------ */
  var toastStack = doc.querySelector('[data-toast-stack]');
  var toastTimers = [];

  function toast(message, options) {
    if (!toastStack) return;

    options = options || {};

    // Giới hạn 3 toast cùng lúc để không che nội dung
    var current = toastStack.querySelectorAll('.toast');
    if (current.length >= 3) {
      current[0].remove();
    }

    var el = doc.createElement('div');
    el.className = 'toast' + (options.type === 'error' ? ' toast--error' : '');

    var iconWrap = doc.createElement('span');
    iconWrap.className = 'toast__icon';
    iconWrap.appendChild(createIcon(options.type === 'error' ? 'i-close' : 'i-check'));

    var text = doc.createElement('p');
    text.textContent = message;

    el.appendChild(iconWrap);
    el.appendChild(text);
    toastStack.appendChild(el);

    // Tự ẩn sau 3.6 giây
    var timer = window.setTimeout(function () {
      el.classList.add('is-leaving');
      window.setTimeout(function () {
        el.remove();
      }, 300);
    }, options.duration || 3600);

    toastTimers.push(timer);
  }

  /* ------------------------------------------------------------------------
     DIALOG MANAGER
     ------------------------------------------------------------------------ */
  var dialogs = toArray(doc.querySelectorAll('dialog'));
  var lastTrigger = null;

  function openDialog(dialog, trigger) {
    if (!dialog || !dialog.tagName || dialog.tagName.toLowerCase() !== 'dialog') return;

    // Chỉ mở một dialog tại một thời điểm
    dialogs.forEach(function (item) {
      if (item !== dialog && item.open) item.close();
    });

    lastTrigger = trigger || doc.activeElement;

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    body.classList.add('modal-open');

    // Cho các module khác (cart.js) biết dialog vừa mở
    doc.dispatchEvent(
      new CustomEvent('nutrisync:dialogopen', { detail: { id: dialog.id, dialog: dialog } })
    );
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      syncModalLock();
    }
  }

  // Chỉ khoá scroll khi còn ít nhất một dialog mở
  function syncModalLock() {
    var anyOpen = dialogs.some(function (dialog) {
      return dialog.open;
    });
    body.classList.toggle('modal-open', anyOpen);
  }

  dialogs.forEach(function (dialog) {
    // Bấm vùng nền tối (backdrop) để đóng
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog(dialog);
    });

    // Đồng bộ trạng thái khoá scroll khi dialog đóng bằng Esc / nút
    dialog.addEventListener('close', function () {
      syncModalLock();
      if (lastTrigger && typeof lastTrigger.focus === 'function' && doc.contains(lastTrigger)) {
        lastTrigger.focus({ preventScroll: true });
      }
    });
  });

  // Mở / đóng dialog thông qua thuộc tính data-*
  doc.addEventListener('click', function (event) {
    var openCart = event.target.closest('[data-open-cart]');
    var openContact = event.target.closest('[data-open-contact]');
    var closeBtn = event.target.closest('[data-close-dialog]');

    if (openCart) {
      openDialog(doc.getElementById('cart-modal'), openCart);
      return;
    }

    if (openContact) {
      openDialog(doc.getElementById('contact-modal'), openContact);
      return;
    }

    if (closeBtn) {
      var dialog = closeBtn.closest('dialog');
      if (dialog) closeDialog(dialog);
    }
  });

  /* ------------------------------------------------------------------------
     HEADER STICKY
     ------------------------------------------------------------------------ */
  var header = doc.querySelector('[data-header]');
  var lastScrollState = false;

  function onScroll() {
    if (!header) return;
    var scrolled = window.scrollY > 10;
    if (scrolled !== lastScrollState) {
      header.classList.toggle('is-scrolled', scrolled);
      lastScrollState = scrolled;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------------
     MENU MOBILE
     ------------------------------------------------------------------------ */
  var navToggle = doc.querySelector('[data-nav-toggle]');
  var mobileMenu = doc.querySelector('[data-mobile-menu]');
  var navOpen = false;

  function setNav(open) {
    if (!navToggle || !mobileMenu) return;

    navOpen = open;
    navToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.inert = !open;
    body.classList.toggle('nav-open', open);

    var srLabel = navToggle.querySelector('.sr-only');
    if (srLabel) srLabel.textContent = open ? 'Đóng menu' : 'Mở menu';

    if (open) {
      var firstLink = mobileMenu.querySelector('a, button, input');
      if (firstLink) {
        window.setTimeout(function () {
          firstLink.focus({ preventScroll: true });
        }, 80);
      }
    }
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      setNav(!navOpen);
    });

    // Bấm một liên kết trong menu thì đóng menu
    mobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    // Đổi kích thước lên desktop thì đóng menu mobile
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && navOpen) setNav(false);
    });
  }

  // Esc đóng menu mobile
  doc.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navOpen) {
      setNav(false);
      if (navToggle) navToggle.focus();
    }
  });

/* ------------------------------------------------------------------------
     ACCORDION (trang Về chúng tôi)
     Cho phép mở đồng thời nhiều mục độc lập.
     ------------------------------------------------------------------------ */
  var accordions = toArray(doc.querySelectorAll('[data-accordion]'));

  function setAccordionItem(item, open) {
    var trigger = item.querySelector('[data-accordion-trigger]');
    var panel = item.querySelector('[data-accordion-panel]');
    if (!trigger || !panel) return;

    item.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
  }

  accordions.forEach(function (accordion) {
    accordion.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-accordion-trigger]');
      if (!trigger || !accordion.contains(trigger)) return;

      var item = trigger.closest('.accordion__item');
      if (!item) return;

      // Kiểm tra trạng thái hiện tại của item được click
      var willOpen = trigger.getAttribute('aria-expanded') !== 'true';

      // Chỉ thay đổi trạng thái của duy nhất item vừa bấm (không đụng đến các item khác)
      setAccordionItem(item, willOpen);
    });
  });

  /* ------------------------------------------------------------------------
     REVEAL KHI CUỘN
     ------------------------------------------------------------------------ */
  var revealItems = toArray(doc.querySelectorAll('[data-reveal]'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealItems.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      // Tạo độ trễ nhỏ giữa các phần tử cùng cấp để hiệu ứng tự nhiên hơn
      revealItems.forEach(function (el) {
        var siblings = toArray(el.parentElement.children).filter(function (child) {
          return child.hasAttribute('data-reveal');
        });
        var index = siblings.indexOf(el);
        el.style.setProperty('--reveal-delay', Math.min(index * 70, 280) + 'ms');
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealItems.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  /* ------------------------------------------------------------------------
     ĐIỀN THÔNG TIN LIÊN HỆ TỪ data.js
     ------------------------------------------------------------------------ */
  var contact = NS.config && NS.config.contact;
  var year = new Date().getFullYear();

  toArray(doc.querySelectorAll('[data-year]')).forEach(function (el) {
    el.textContent = String(year);
  });

  if (contact) {
    toArray(doc.querySelectorAll('[data-contact]')).forEach(function (el) {
      var key = el.getAttribute('data-contact');
      var value = contact[key];
      if (!value) return;

      // Trong hộp liên hệ, hiển thị kèm chức danh
      if (key === 'representative' && el.closest('.contact__list')) {
        value = value + ' – ' + contact.role;
      }

      el.textContent = value;
    });

    var linkMap = {
      email: 'mailto:' + contact.email,
      phone: contact.phoneHref || 'tel:' + contact.phone.replace(/\s/g, ''),
      website: contact.websiteHref || '#'
    };

    toArray(doc.querySelectorAll('[data-contact-link]')).forEach(function (link) {
      var key = link.getAttribute('data-contact-link');
      if (linkMap[key]) link.setAttribute('href', linkMap[key]);
    });
  }

  /* ------------------------------------------------------------------------
     TÌM KIẾM
     - Trang Cửa hàng: lọc trực tiếp (catalog.js lắng nghe sự kiện input)
     - Trang khác: gửi form sang index.html?q=...
     - index.html?q=... sẽ tự điền và lọc khi tải trang
     ------------------------------------------------------------------------ */
  var searchForms = toArray(doc.querySelectorAll('[data-search-form]'));
  var searchInputs = toArray(doc.querySelectorAll('[data-search]'));
  var isStore = body.classList.contains('page-store');

  function syncSearch(value) {
    searchInputs.forEach(function (input) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      // Ở trang Cửa hàng không cần tải lại – lọc ngay tại chỗ
      if (isStore) {
        event.preventDefault();
        var value = (form.querySelector('[data-search]') || {}).value || '';
        syncSearch(value);

        var menu = doc.getElementById('menu');
        if (menu) {
          menu.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });

  // Nút search rút gọn trên header
  var searchLink = doc.querySelector('[data-search-link]');
  if (searchLink) {
    searchLink.addEventListener('click', function (event) {
      if (!isStore) return; // Ở trang khác: chuyển sang index.html#search

      event.preventDefault();
      var inline = doc.querySelector('.inline-search [data-search]');
      var target = doc.getElementById('search');
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
      if (inline) inline.focus({ preventScroll: true });
    });
  }

  // Đọc ?q= trên URL khi vào trang Cửa hàng
  if (isStore) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query) {
      window.setTimeout(function () {
        syncSearch(query);
      }, 60);
    }
  }

  // Vào index.html#search → focus ô tìm kiếm
  if (window.location.hash === '#search') {
    window.setTimeout(function () {
      var input = doc.querySelector('.inline-search [data-search]');
      if (input) input.focus({ preventScroll: true });
    }, 150);
  }

  /* ------------------------------------------------------------------------
     NÚT APP STORE / GOOGLE PLAY / MEAL PLAN – chưa có link thật
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', function (event) {
    var badge = event.target.closest('[data-app-badge]');
    if (!badge) return;

    var label = badge.getAttribute('data-app-badge');
    if (label.indexOf('Meal plan') === 0) {
      toast(label + ' sẽ sớm mở bán cùng ứng dụng NUTRISYNC.');
    } else {
      toast('Ứng dụng NUTRISYNC sẽ sớm có trên ' + label + '. Bạn chờ nhé!');
    }
  });

  /* ------------------------------------------------------------------------
     API DÙNG CHUNG CHO catalog.js & cart.js
     ------------------------------------------------------------------------ */
  NS.ui = {
    toast: toast,
    icon: createIcon,
    openDialog: openDialog,
    closeDialog: closeDialog,
    syncSearch: syncSearch
  };
})(window.NUTRISYNC);
