//===========================================================================
//CẤU HÌNH CHUNG
//===========================================================================
var NL_MOBILE_BP = 768;
var NL_GPT_SRC = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
var NL_ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
var NL_INSERT_POS = ['beforeend', 'afterbegin', 'beforebegin', 'afterend'];

//===========================================================================
//ADX
//===========================================================================

//_insertPosition = 0: beforeend, 1: afterbegin, 2: beforebegin, 3: afterend
function NetlinkAdx(_adUnit, _adSize, _mapping = [], _element, _insertPosition = 0, _set_min = 0) {
  var element = nlQuery(_element);
  if (!element) return;
  checkGPTExists();
  var id = randomID();
  var box = nlHtml(
    '<div class="netlink-banner-ad">' +
      '<center><div id="' + id + '" style="' + (_set_min != 0 ? nlMinSizeStyle(_adSize) : '') + '"></div></center>' +
    '</div>');
  nlInsert(element, box, _insertPosition);
  nlShowSlot(_adUnit, _adSize, id, { mapping: nlLegacyMapping(_mapping) });
}

function NetlinkAdxInterstitial(_adUnit) {
  checkGPTExists();
  nlShowOutOfPage(_adUnit, 'INTERSTITIAL');
}

//_insertPosition = 0: beforeend, 1: afterbegin, 2: beforebegin, 3: afterend
function NetlinkAdxAutoAds(_adUnit, _start, _end, _adSize, _mapping = [], _elements, _insertPosition = 2, _set_min = 0, _minScreen = 1, _position_start = 0, _position_end = 0) {
  nlAutoPlace(_elements, _start, _end, _insertPosition, _minScreen, _position_start, _position_end, function (index, el, pos) {
    NetlinkAdx(_adUnit + index, _adSize, _mapping, el, pos, _set_min);
  });
}

// Anchor của Google (không có nút đóng riêng)
function NetlinkAdxSticky(_adUnit, _adPosition = 0) {
  checkGPTExists();
  var top = document.body.clientWidth < NL_MOBILE_BP && _adPosition != 0;
  nlShowOutOfPage(_adUnit, top ? 'TOP_ANCHOR' : 'BOTTOM_ANCHOR');
}

// Anchor của Google + nút CLOSE dùng chung
function NetlinkAdxStickyExt(_adUnit, _adPosition = 0, _closeBtnPos = 1) {
  checkGPTExists();
  var top = document.body.clientWidth < NL_MOBILE_BP && _adPosition != 0;
  nlShowOutOfPage(_adUnit, top ? 'TOP_ANCHOR' : 'BOTTOM_ANCHOR', function (slot) {
    if (!slot) return;
    nlOnSlotRender(slot, function (e) {
      if (e.isEmpty) return;
      var c = document.querySelector('.google-anchor-ad-container') || document.querySelector('div[id^="googletag_anchor_container"]');
      if (!c) return;
      if (!c.id) c.id = 'nl-sticky-wrapper-' + randomID();
      renderNetlinkMegaClose(c.id, slot, top ? 1 : 0, _closeBtnPos);
    });
  });
}

// _element: selector trỏ thẳng vào ảnh (vd ".content img") hoặc vùng nội dung (vd "detail-content")
function NetlinkAdxInImage(_adUnit, _adSize, _mapping = [], _element, _image = 1, _marginBottom = 0) {
  var image = nlResolveImages(_element)[_image - 1];
  if (!image) return;
  nlAdxInImageAt(_adUnit, _adSize, _mapping, image, _marginBottom);
}

function NetlinkAdxInImages(_adUnit, _start, _end, _adSize, _mapping = [], _element, _image = [], _marginBottom = 0) {
  var images = nlResolveImages(_element);
  for (var i = 1; i <= images.length; i++) {
    if (_start > _end) break;
    if (_image.length > 0 && !_image.includes(i)) continue;
    nlAdxInImageAt(_adUnit + (_start++), _adSize, _mapping, images[i - 1], _marginBottom);
  }
}

// Cách gọi cũ: NetlinkAdxInPage(adUnit, element, marginTop = -1) — chỉ Mobile, chèn giữa element
// Cách gọi mới: NetlinkAdxInPage(adUnit, marginTop = -1) — chèn tại vị trí thẻ <script>
function NetlinkAdxInPage(_adUnit, _a2, _a3) {
  if (typeof _a2 === 'string' || (_a2 && _a2.nodeType === 1)) {
    return nlAdxInPageLegacy(_adUnit, _a2, _a3 === undefined ? -1 : _a3);
  }
  return nlAdxInPageInline(_adUnit, _a2 === undefined ? -1 : _a2);
}

//_insertPosition = 0: beforeend, 1: afterbegin, 2: beforebegin, 3: afterend
function NetlinkAdxMultipleSize(_adUnit, _element, _insertPosition = 0, _marginTop = 0) {
  if (!nlIsMobile()) return;
  MultipleSizeAdd(_adUnit, _element, _insertPosition);
  MultipleSizeScroll(_marginTop);
}

//_insertPosition = 0: beforeend, 1: afterbegin, 2: beforebegin, 3: afterend
function NetlinkAdxMultipleSizes(_adUnit, _start, _end, _elements, _insertPosition = 2, _marginTop = 0, _minScreen = 1, _position_start = 0, _position_end = 0) {
  if (!nlIsMobile()) return;
  var found = nlAutoPlace(_elements, _start, _end, _insertPosition, _minScreen, _position_start, _position_end, function (index, el, pos) {
    MultipleSizeAdd(_adUnit + index, el, pos);
  });
  if (found) MultipleSizeScroll(_marginTop);
}

//_insertPosition = 0: beforeend, 1: afterbegin, 2: beforebegin, 3: afterend
function MultipleSizeAdd(_adUnit, _element, _insertPosition = 0) {
  var element = nlQuery(_element);
  if (!element) return;
  checkGPTExists();
  var id = randomID();
  var label = '<span style="display:inline-block;width:100%;font-size:14px;text-align:center;color:#9e9e9e;background-color:#f1f1f1;">';
  var box = nlHtml(
    '<div class="netlink-multiplesize" style="margin-top:10px;margin-bottom:10px;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);">' +
      label + 'Ads By Netlink</span>' +
      '<div class="ms-content-ad" style="position:relative;min-height:600px;">' +
        '<center class="ms-ad"><div id="' + id + '"></div></center>' +
      '</div>' +
      label + 'Scroll to Continue</span>' +
    '</div>');
  nlInsert(element, box, _insertPosition);
  nlShowSlot(_adUnit, [[300, 250], [300, 600]], id);
}

// Chỉ gắn 1 listener cuộn cho mọi khối MultipleSize; mỗi khối nhớ _marginTop riêng
var nlMsBound = false;
function MultipleSizeScroll(_marginTop = 0) {
  var els = document.getElementsByClassName('netlink-multiplesize');
  for (var i = 0; i < els.length; i++) {
    if (!els[i].hasAttribute('data-nl-mt')) els[i].setAttribute('data-nl-mt', _marginTop);
  }
  if (nlMsBound) return;
  nlMsBound = true;
  document.addEventListener('scroll', nlMultipleSizeUpdate, { passive: true });
}

function nlMultipleSizeUpdate() {
  var els = document.getElementsByClassName('netlink-multiplesize');
  for (var i = 0; i < els.length; i++) {
    var mt = Number(els[i].getAttribute('data-nl-mt')) || 0;
    var content = els[i].querySelector('.ms-content-ad');
    var ad = els[i].querySelector('.ms-ad');
    if (!content || !ad) continue;
    var h = content.clientHeight, ch = ad.clientHeight;
    var ap = content.getBoundingClientRect().top;
    var s = ad.style;
    if (ch < h && ap < mt) {
      if (Math.abs(ap) + ch < h - mt) {
        s.position = 'fixed';
        s.top = mt + 'px';
        s.bottom = '';
      } else {
        s.position = 'absolute';
        s.top = '';
        s.bottom = '0';
      }
      s.left = '50%';
      s.transform = 'translateX(-50%)';
    } else {
      s.position = s.top = s.bottom = s.left = s.transform = '';
    }
  }
}

// Cách gọi cũ: NetlinkAdxFirstView(adUnit, adSize) — chỉ Mobile, overlay trắng
// Cách gọi mới: NetlinkAdxFirstView(adUnit) — mọi thiết bị, popup nền tối, tự mapping size
function NetlinkAdxFirstView(_adUnit, _adSize) {
  if (Array.isArray(_adSize)) {
    if (!nlIsMobile()) return;
    return nlAdxFirstViewLegacy(_adUnit, _adSize, NL_FV_CLOSE.adx);
  }
  nlAdxPopup(_adUnit, {
    containerPrefix: 'nl-firstview-popup-',
    wrapperPrefix: 'wrapper-',
    overlay: 'rgba(0,0,0,0.7)',
    sizes: [[300, 250], [336, 280], [300, 600], [300, 400], [320, 100]],
    mapping: [
      [[1024, 768], [[300, 600], [300, 400], [336, 280], [300, 250]]],
      [[0, 0], [[300, 250], [336, 280], [320, 100]]]
    ],
    closeBtnPos: 1
  });
}

// Cách gọi cũ: NetlinkAdxFirstViewExt(adUnit, adSize, isDisplay = 0, pageView = [0])
// Cách gọi mới: NetlinkAdxFirstViewExt(adUnit, isDisplay = 0, pageView = [0], closeBtnPos = 1)
function NetlinkAdxFirstViewExt(_adUnit, _a2, _a3, _a4) {
  if (Array.isArray(_a2)) {
    if (!nlDeviceAllowed(_a3)) return;
    if (!nlPageViewAllowed(_a4, nlLegacyPageView())) return;
    return nlAdxFirstViewLegacy(_adUnit, _a2, NL_FV_CLOSE.adxExt);
  }
  if (!nlDeviceAllowed(_a2)) return;
  if (!nlPageViewAllowed(_a3, nlSessionPageView('nl_ext_pv_' + nlCleanKey(_adUnit), true))) return;
  nlAdxPopup(_adUnit, {
    containerPrefix: 'nl-firstview-ext-container-',
    wrapperPrefix: 'wrapper-ext-',
    overlay: 'rgba(0,0,0,0.8)',
    wrapperCss: 'box-shadow:0 0 30px rgba(0,0,0,0.6);max-width:95vw;max-height:95vh;overflow:visible;',
    sizes: [[300, 600], [300, 400], [336, 280], [300, 250], [320, 100], [320, 50]],
    mapping: [
      [[1024, 0], [[300, 600], [300, 400], [336, 280], [300, 250]]],
      [[768, 0], [[336, 280], [300, 250]]],
      [[0, 0], [[300, 250], [336, 280], [320, 100], [320, 50]]]
    ],
    closeBtnPos: _a4 === undefined ? 1 : _a4,
    closeTop: '-15px'
  });
}

function NetlinkAdxRewarded(_adUnit) {
  checkGPTExists();
  function done() { window.netlink_rewarded_done = true; }
  nlShowOutOfPage(_adUnit, 'REWARDED', function (slot) {
    if (!slot) return done();
    var p = googletag.pubads();
    p.addEventListener('rewardedSlotReady', function (e) {
      if (e.slot === slot) e.makeRewardedVisible();
    });
    p.addEventListener('rewardedSlotClosed', function (e) {
      if (e.slot !== slot) return;
      googletag.destroySlots([slot]);
      done();
    });
    nlOnSlotRender(slot, function (e) {
      if (e.isEmpty) done();
    });
  });
}

function NetlinkAdxRewardedExt(_adUnit, _isDisplay = 0, _pageView = [0]) {
  if (!nlDeviceAllowed(_isDisplay)) return;
  if (!nlPageViewAllowed(_pageView, nlLegacyPageView())) return;
  NetlinkAdxRewarded(_adUnit);
}

// Cách gọi cũ: NetlinkAdxCatfish(adUnit, adSize, isDisplay, pageView, bottom) — hiện sau khi cuộn 1.5 màn hình
// Cách gọi mới: NetlinkAdxCatfish(adUnit, adSize = [320, 100], closeBtnPos = 1, bottom = 0) — hiện ngay
function NetlinkAdxCatfish(_adUnit, _adSize, _a3, _a4, _a5) {
  _adSize = _adSize || [320, 100];
  var reveal = arguments.length >= 5 || Array.isArray(_a4);
  var closeBtnPos = 1, bottom = 0;
  if (reveal) {
    if (!nlDeviceAllowed(_a3)) return;
    if (!nlPageViewAllowed(_a4, nlLegacyPageView())) return;
    bottom = Number(_a5) || 0;
  } else {
    closeBtnPos = _a3 === undefined ? 1 : _a3;
    bottom = Number(_a4) || 0;
  }
  checkGPTExists();
  var id = randomID(), cid = 'nl-catfish-container-' + id, wid = 'wrapper-' + id;
  var c = nlHtml(
    '<div id="' + cid + '" style="position:fixed;bottom:' + bottom + 'px;left:0;width:100%;z-index:2147483646;display:' + (reveal ? 'none' : 'flex') + ';justify-content:center;background:transparent;pointer-events:none;">' +
      '<div id="' + wid + '" style="position:relative;pointer-events:auto;background:white;box-shadow:0 -2px 10px rgba(0,0,0,0.1);">' +
        '<div id="' + id + '" style="' + nlMinSizeStyle(_adSize) + '"></div>' +
      '</div>' +
    '</div>');
  document.body.appendChild(c);
  var loaded = false, trigger = window.innerHeight * 1.5;
  function update() {
    if (!loaded || !c.isConnected) return;
    c.style.display = window.scrollY > trigger ? 'flex' : 'none';
  }
  if (reveal) window.addEventListener('scroll', update, { passive: true });
  nlShowSlot(_adUnit, _adSize, id, {
    onRender: function (e, slot) {
      if (e.isEmpty) {
        c.remove();
        return;
      }
      loaded = true;
      renderNetlinkMegaClose(wid, slot, 0, closeBtnPos);
      if (reveal) update();
    }
  });
}

/**
 * NetlinkAdxCatfishExt: Hiện khi cuộn xuống, ẩn khi cuộn lên
 * @param {number} _isDisplay - 0: Cả PC & MB, 1: Chỉ PC, 2: Chỉ Mobile
 * @param {array} _pageView - [1, 3, 5]: Hiện ở lượt xem trang thứ 1, 3, 5
 * @param {number} _closeBtnPos - Vị trí nút đóng (0, 1, 2)
 */
function NetlinkAdxCatfishExt(_adUnit, _isDisplay = 0, _pageView = [0], _closeBtnPos = 1) {
  if (!nlDeviceAllowed(_isDisplay)) return;
  if (!nlPageViewAllowed(_pageView, nlSessionPageView('nl_cat_ext_pv_v2_' + nlCleanKey(_adUnit), false))) return;
  var id = randomID(), cid = 'nl-cat-ext-container-' + id, wid = 'wrapper-cat-' + id;
  var rendered = false, lastTop = 0;
  function show(c) {
    c.style.display = 'flex';
    c.style.opacity = '1';
    c.style.transform = 'translateY(0)';
  }
  function render() {
    checkGPTExists();
    var c = nlHtml(
      '<div id="' + cid + '" style="position:fixed;bottom:0;left:0;width:100%;z-index:2147483646;display:flex;justify-content:center;pointer-events:none;transition:all .4s ease-in-out;opacity:0;transform:translateY(100%);">' +
        '<div id="' + wid + '" style="position:relative;pointer-events:auto;background:transparent;line-height:0;">' +
          '<div id="' + id + '"></div>' +
        '</div>' +
      '</div>');
    document.body.appendChild(c);
    nlShowSlot(_adUnit, [[728, 90], [300, 100], [300, 50], [320, 100], [320, 50]], id, {
      mapping: [
        [[1024, 0], [[728, 90]]],
        [[0, 0], [[300, 100], [300, 50], [320, 100], [320, 50]]]
      ],
      onRender: function (e, slot) {
        if (e.isEmpty) {
          c.remove();
          return;
        }
        var w = document.getElementById(wid);
        c.style.display = 'flex';
        setTimeout(function () { show(c); }, 100);
        if (w) {
          w.style.background = '#ffffff';
          w.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.15)';
          w.style.padding = '2px';
        }
        renderNetlinkMegaClose(wid, slot, 0, _closeBtnPos);
      }
    });
  }
  window.addEventListener('scroll', function () {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var c = document.getElementById(cid);
    if (st > lastTop && st > 100) {
      if (!rendered) {
        rendered = true;
        render();
      } else if (c) {
        show(c);
      }
    } else if (st < lastTop && c) {
      c.style.opacity = '0';
      c.style.transform = 'translateY(100%)';
      setTimeout(function () {
        if (c.style.opacity === '0') c.style.display = 'none';
      }, 400);
    }
    lastTop = st <= 0 ? 0 : st;
  }, { passive: true });
}

/**
 * NetlinkAdxWipe: Quảng cáo 300x250 góc dưới bên phải — CHỈ MOBILE
 * @param {number} _delay - Thời gian chờ hiển thị (ms)
 * @param {number} _closeBtnPos - Vị trí nút đóng (0, 1, 2)
 */
function NetlinkAdxWipe(_adUnit, _delay = 3000, _closeBtnPos = 1) {
  if (!nlIsMobile()) return;
  checkGPTExists();
  setTimeout(function () {
    var id = randomID(), cid = 'nl-wipe-container-' + id, wid = 'wrapper-' + id;
    var c = nlHtml(
      '<div id="' + cid + '" style="position:fixed;bottom:200px;right:10px;z-index:2147483646;display:none;transition:opacity .5s;">' +
        '<div id="' + wid + '" style="position:relative;background:#ffffff;box-shadow:0 0 15px rgba(0,0,0,0.2);padding:2px;border-radius:4px;">' +
          '<div id="' + id + '" style="width:300px;height:250px;"></div>' +
        '</div>' +
      '</div>');
    document.body.appendChild(c);
    nlShowSlot(_adUnit, [300, 250], id, {
      onRender: function (e, slot) {
        if (e.isEmpty) return c.remove();
        c.style.display = 'block';
        renderNetlinkMegaClose(wid, slot, 0, _closeBtnPos);
      }
    });
  }, _delay);
}

/**
 * NetlinkAdxBalloon: Quảng cáo nổi góc dưới bên phải — CHỈ PC
 * @param {array} _adSize - Các size khối được phép
 * @param {number} _closeBtnPos - Vị trí nút đóng (0: trái, 1: phải, 2: giữa)
 */
function NetlinkAdxBalloon(_adUnit, _adSize = [[300, 250], [336, 280], [300, 300], [300, 400]], _closeBtnPos = 1) {
  if (nlIsMobile()) return;
  checkGPTExists();
  var id = randomID(), cid = 'nl-balloon-container-' + id, wid = 'wrapper-' + id;
  var c = nlHtml(
    '<div id="' + cid + '" style="position:fixed;bottom:10px;right:10px;z-index:2147483646;display:none;transition:all .3s;">' +
      '<div id="' + wid + '" style="position:relative;background:#ffffff;box-shadow:0 0 15px rgba(0,0,0,0.2);padding:2px;border-radius:4px;max-width:340px;">' +
        '<div id="' + id + '" style="min-width:300px;"></div>' +
      '</div>' +
    '</div>');
  document.body.appendChild(c);
  nlShowSlot(_adUnit, _adSize, id, {
    onRender: function (e, slot) {
      if (e.isEmpty) return c.remove();
      c.style.display = 'block';
      renderNetlinkMegaClose(wid, slot, 0, _closeBtnPos);
    }
  });
}

/**
 * NetlinkAdxMultiads: Tự động chèn nhiều quảng cáo theo đoạn văn khi cuộn
 * Mobile: sau mỗi 2 thẻ <p>, PC: sau mỗi 5 thẻ <p>
 */
function NetlinkAdxMultiads(_adUnit) {
  nlLog('[MultiAds] Khởi tạo hệ thống chèn thông minh...');
  var pGap = nlIsMobile() ? 2 : 5;
  var adCount = 0, lastIdx = -1, busy = false, area = null;
  function insert(count, target) {
    checkGPTExists();
    var id = randomID() + '-' + count, cid = 'nl-multi-container-' + id;
    var c = nlHtml(
      '<div id="' + cid + '" style="margin:20px auto;text-align:center;width:100%;clear:both;overflow:hidden;">' +
        '<div id="' + id + '" style="display:inline-block;min-height:50px;"></div>' +
      '</div>');
    target.insertAdjacentElement('afterend', c);
    nlShowSlot(_adUnit, [[336, 280], [300, 250], [320, 100], [320, 50]], id, {
      mapping: [
        [[1024, 0], [[336, 280], [300, 250]]],
        [[0, 0], [[300, 250], [320, 100], [320, 50]]]
      ],
      onRender: function (e) {
        if (e.isEmpty) {
          nlLog('[MultiAds] Ad ' + count + ' TRỐNG');
          c.style.display = 'none';
        } else {
          nlLog('[MultiAds] Ad ' + count + ' HIỂN THỊ');
        }
      }
    });
  }
  window.addEventListener('scroll', function () {
    if (busy) return;
    if (!area || !area.isConnected) area = findSmartContentArea();
    var ps = area.querySelectorAll('p');
    var limit = window.innerHeight + 200;
    for (var i = Math.max(0, lastIdx + pGap); i < ps.length; i++) {
      if (ps[i].getBoundingClientRect().top >= limit) continue;
      if ((ps[i].textContent || '').trim().length < 15) continue;
      busy = true;
      adCount++;
      lastIdx = i;
      nlLog('[MultiAds] Chèn Ad ' + adCount + ' sau thẻ P thứ ' + (i + 1));
      insert(adCount, ps[i]);
      setTimeout(function () { busy = false; }, 800);
      break;
    }
  }, { passive: true });
}

/**
 * NetlinkAdxScrollReveal: Quảng cáo ẩn dưới nội dung, cuộn để lộ (ADX) — CHỈ MOBILE
 * @param {string} _target - (Tùy chọn) Selector vùng nội dung
 */
function NetlinkAdxScrollReveal(_adUnit, _target = null) {
  if (!nlIsMobile()) return;
  var area = findSmartContentArea(_target);
  if (!area) return;
  var ps = area.querySelectorAll('p');
  if (ps.length < 2) return;
  checkGPTExists();
  var id = randomID(), cid = 'nl-reveal-adx-' + id;
  var inner = nlHtml('<div id="inner-' + id + '" style="position:relative;line-height:0;min-width:300px;min-height:250px;"><div id="' + id + '"></div></div>');
  ps[Math.floor(ps.length / 2)].insertAdjacentElement('afterend', nlRevealBox(cid, inner));
  handleScrollReveal(cid, function () {
    nlShowSlot(_adUnit, [[336, 280], [300, 250]], id, {
      onRender: function (e) {
        if (!e.isEmpty) return;
        var w = document.getElementById(cid + '-wrapper');
        if (w) w.remove();
      }
    });
  });
}

//===========================================================================
//ADSENSE
//===========================================================================
function NetlinkAdsense(_adClient, _adSlot, _adSize = [], _responsive = 0, _element, _insertPosition = 0) {
  var element = nlQuery(_element);
  if (!element) return;
  checkAdsenseJSExists(_adClient);
  var ins = _responsive == 0
    ? nlAdsenseIns(_adClient, _adSlot, 'display:inline-block;width:' + _adSize[0] + 'px;height:' + _adSize[1] + 'px')
    : nlAdsenseIns(_adClient, _adSlot, 'display:block', { 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' });
  var box = nlHtml('<div class="netlink-banner-ad"><center></center></div>');
  box.firstElementChild.appendChild(ins);
  nlInsert(element, box, _insertPosition);
  nlAdsensePush();
}

function NetlinkAdsenseInPage(_adClient, _adSlot, _element, _marginTop = -1) {
  if (!nlIsMobile()) return;
  var els = nlQueryAll(_element);
  if (!els.length) return;
  checkAdsenseJSExists(_adClient);
  var w = 300, h = 600;
  var mid = Math.max(1, Math.min(Math.floor(els.length / 2), 4));
  var holder = nlBuildInPageHolder();
  holder.ad.appendChild(nlAdsenseIns(_adClient, _adSlot, 'display:inline-block;width:' + w + 'px;height:' + h + 'px'));
  els[mid - 1].insertAdjacentElement('afterend', holder.root);
  nlBindInPageClip(holder, w, h, _marginTop);
  nlAdsensePush();
}

function NetlinkAdsenseFirstView(_adClient, _adSlot, _adSize = [300, 600]) {
  if (!nlIsMobile()) return;
  checkAdsenseJSExists(_adClient);
  var ins = nlAdsenseIns(_adClient, _adSlot,
    'display:inline-block;width:' + _adSize[0] + 'px;height:' + _adSize[1] + 'px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);');
  nlFirstViewLegacy(ins, function () { return ins.getAttribute('data-ad-status') === 'filled'; }, NL_FV_CLOSE.adsense);
  nlAdsensePush();
}

function NetlinkAdsenseInImage(_adClient, _adSlot, _adSize, _element, _image = 1, _marginBottom = 0) {
  var image = nlResolveImages(_element)[_image - 1];
  if (!image) return;
  checkAdsenseJSExists(_adClient);
  var ins = nlAdsenseIns(_adClient, _adSlot, 'display:inline-block;width:' + _adSize[0] + 'px;height:' + _adSize[1] + 'px');
  var close = nlBuildInImage(image, ins, _marginBottom);
  nlAdsensePush();
  nlWaitFor(function () { return ins.getAttribute('data-ad-status') === 'filled'; }, function () { close.style.display = 'block'; });
}

/**
 * NetlinkAsenseScrollReveal: Quảng cáo ẩn dưới nội dung, cuộn để lộ (Adsense) — CHỈ MOBILE
 * @param {string} _target - (Tùy chọn) Selector vùng nội dung
 */
function NetlinkAsenseScrollReveal(_client, _slot, _target = null) {
  if (!nlIsMobile()) return;
  var area = findSmartContentArea(_target);
  if (!area) return;
  var ps = area.querySelectorAll('p');
  if (ps.length < 2) return;
  checkAdsenseJSExists(_client);
  var cid = 'nl-reveal-asense-' + randomID();
  var inner = document.createElement('div');
  inner.style.cssText = 'width:100%;text-align:center;line-height:0;';
  inner.appendChild(nlAdsenseIns(_client, _slot, 'display:inline-block;width:336px;height:280px'));
  ps[Math.floor(ps.length / 2)].insertAdjacentElement('afterend', nlRevealBox(cid, inner));
  handleScrollReveal(cid, nlAdsensePush);
}

/**
 * NetlinkAdsenseSticky: Banner Adsense cố định dưới chân trang, có nút đóng
 * @param {string} _adClient - Mã ca-pub
 * @param {string} _adSlot - Mã slot quảng cáo
 * @param {array} _adSizePC - Size trên PC (mặc định [728, 90]); màn hình hẹp hơn size này sẽ dùng size Mobile
 * @param {array} _adSizeMB - Size trên Mobile (mặc định [320, 50])
 * @param {number} _closeBtnPos - Vị trí nút đóng (0: trái, 1: phải, 2: giữa)
 * @param {number} _isDisplay - 0: Cả PC & MB, 1: Chỉ PC, 2: Chỉ Mobile
 */
function NetlinkAdsenseSticky(_adClient, _adSlot, _adSizePC = [728, 90], _adSizeMB = [320, 50], _closeBtnPos = 1, _isDisplay = 0) {
  if (!nlDeviceAllowed(_isDisplay)) return;
  if (document.querySelector('.netlink-adsense-sticky')) return;
  checkAdsenseJSExists(_adClient);
  var size = (!nlIsMobile() && window.innerWidth >= _adSizePC[0] + 20) ? _adSizePC : _adSizeMB;
  var id = randomID(), cid = 'nl-adsense-sticky-container-' + id, wid = 'wrapper-' + id;
  var c = nlHtml(
    '<div id="' + cid + '" class="netlink-adsense-sticky" style="position:fixed;left:0;bottom:0;width:100%;z-index:2147483646;display:flex;justify-content:center;pointer-events:none;padding-bottom:env(safe-area-inset-bottom);transform:translateY(150%);transition:transform .4s ease-in-out;">' +
      '<div id="' + wid + '" style="position:relative;pointer-events:auto;background:#fff;box-shadow:0 -2px 8px rgba(0,0,0,.15);padding:3px;line-height:0;"></div>' +
    '</div>');
  var ins = nlAdsenseIns(_adClient, _adSlot, 'display:inline-block;width:' + size[0] + 'px;height:' + size[1] + 'px');
  c.firstElementChild.appendChild(ins);
  document.body.appendChild(c);
  nlAdsensePush();
  var body = document.body, oldPad = body.style.paddingBottom;
  nlWaitFor(function () {
    var s = ins.getAttribute('data-ad-status');
    return s === 'filled' || s === 'unfilled';
  }, function () {
    if (ins.getAttribute('data-ad-status') !== 'filled') return c.remove();
    c.style.transform = 'translateY(0)';
    // Chừa khoảng trống dưới trang để banner không che phần cuối nội dung
    var pad = parseFloat(getComputedStyle(body).paddingBottom) || 0;
    body.style.paddingBottom = (pad + c.offsetHeight) + 'px';
    renderNetlinkMegaClose(wid, null, 0, _closeBtnPos, function () {
      body.style.paddingBottom = oldPad;
    });
  });
}

//===========================================================================
//HÀM HỖ TRỢ DÙNG CHUNG (giữ tên cũ)
//===========================================================================
function checkGPTExists() {
  if (document.querySelector('script[src*="/tag/js/gpt.js"]')) return true;
  var s = document.createElement('script');
  s.src = NL_GPT_SRC;
  s.async = true;
  (document.head || document.documentElement).appendChild(s);
  return false;
}

function checkAdsenseJSExists(client_id) {
  if (document.querySelector('script[src*="adsbygoogle.js"]')) return true;
  var s = document.createElement('script');
  s.src = NL_ADSENSE_SRC + '?client=' + client_id;
  s.async = true;
  s.crossOrigin = 'anonymous';
  (document.head || document.documentElement).appendChild(s);
  return false;
}

var nlUsedIds = {};
function randomID() {
  var r;
  do {
    r = Math.random().toString().substring(2);
  } while (nlUsedIds[r] || document.getElementById('netlink-gpt-ad-' + r + '-0'));
  nlUsedIds[r] = 1;
  return 'netlink-gpt-ad-' + r + '-0';
}

function injectNetlinkStyles() {
  if (document.getElementById('netlink-ads-style')) return;
  var style = document.createElement('style');
  style.id = 'netlink-ads-style';
  style.innerHTML =
    '.nl-mega-close{opacity:0;transition:opacity .5s ease-in-out,transform .2s;z-index:2147483647;' +
    'background:rgba(60,60,60,.95);color:#fff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;' +
    'padding:5px 12px;cursor:pointer;border:none;box-shadow:0 2px 5px rgba(0,0,0,.3);display:flex;' +
    'align-items:center;justify-content:center;white-space:nowrap;}' +
    '.nl-mega-close:hover{background:#000;transform:scale(1.05);}' +
    '.nl-show{opacity:1;}';
  document.head.appendChild(style);
}

// _vPos: 0 = nút nằm trên banner, 1 = nút nằm dưới banner
// _hPos: 0 = trái, 1 = phải, 2 = giữa
// _onClose: (tùy chọn) hàm chạy sau khi đóng
function renderNetlinkMegaClose(_targetId, _slot, _vPos = 0, _hPos = 1, _onClose = null) {
  injectNetlinkStyles();
  var target = document.getElementById(_targetId);
  if (!target) return;
  for (var i = 0; i < target.children.length; i++) {
    if (target.children[i].classList.contains('nl-mega-close')) return;
  }
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nl-mega-close';
  btn.innerHTML = 'CLOSE ✕';
  btn.style.position = 'absolute';
  if (Number(_vPos) === 1) {
    btn.style.top = '100%';
    btn.style.borderRadius = '0 0 5px 5px';
  } else {
    btn.style.bottom = '100%';
    btn.style.borderRadius = '5px 5px 0 0';
  }
  var h = Number(_hPos);
  if (h === 0) {
    btn.style.left = '0';
  } else if (h === 2) {
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
  } else {
    btn.style.right = '0';
  }
  btn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (_slot && window.googletag && googletag.destroySlots) googletag.destroySlots([_slot]);
    // Xoá container gốc (id chứa 'container'), không bao giờ xoá <body>/<html>
    var root = target.id.indexOf('container') > -1 ? target : target.parentElement;
    if (!root || root === document.body || root === document.documentElement) root = target;
    root.remove();
    if (typeof _onClose === 'function') _onClose();
  };
  target.appendChild(btn);
  setTimeout(function () { btn.classList.add('nl-show'); }, 200);
}

// Tìm vùng nội dung bài viết
function findSmartContentArea(_target) {
  if (_target) return nlQuery(_target);
  var sels = ['article', '.post-content', '.entry-content', '.content-detail', '.detail-content', '.fck_detail', '#content_blog'];
  for (var i = 0; i < sels.length; i++) {
    var el = document.querySelector(sels[i]);
    if (el && el.querySelectorAll('p').length > 2) return el;
  }
  var best = null, max = 0;
  document.querySelectorAll('div').forEach(function (d) {
    var n = d.querySelectorAll(':scope > p').length;
    if (n > max) {
      max = n;
      best = d;
    }
  });
  return best || document.body;
}

// Hiện/ẩn khối reveal khi cuộn; _onFirstVisible chạy 1 lần khi khối lần đầu vào màn hình
function handleScrollReveal(_containerId, _onFirstVisible) {
  var fired = false;
  function update() {
    var wrapper = document.getElementById(_containerId + '-wrapper');
    var ad = document.getElementById(_containerId);
    if (!wrapper || !ad) return;
    var r = wrapper.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      ad.style.display = 'flex';
      if (!fired && typeof _onFirstVisible === 'function') {
        fired = true;
        _onFirstVisible();
      }
    } else {
      ad.style.display = 'none';
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

//===========================================================================
//HÀM NỘI BỘ (tiền tố nl)
//===========================================================================
function nlIsMobile() { return window.innerWidth < NL_MOBILE_BP; }

function nlLog() {
  if (window.NETLINK_ADS_DEBUG && window.console) console.log.apply(console, arguments);
}

function nlHtml(html) {
  var t = document.createElement('div');
  t.innerHTML = html.trim();
  return t.firstElementChild;
}

//pos = 0: beforeend, 1: afterbegin, 2: beforebegin, 3: afterend
function nlInsert(target, el, pos) {
  target.insertAdjacentElement(NL_INSERT_POS[pos] || 'beforeend', el);
}

// Nhận selector CSS, tên class trần ("detail-content", "a b" => ".a.b") hoặc 1 Element
function nlQueryAll(sel) {
  if (!sel) return [];
  if (sel.nodeType === 1) return [sel];
  var list = [];
  try { list = document.querySelectorAll(sel); } catch (e) {}
  if (!list.length && typeof sel === 'string' && !/[.#>\[:]/.test(sel)) {
    try { list = document.querySelectorAll('.' + sel.trim().split(/\s+/).join('.')); } catch (e) {}
  }
  return Array.prototype.slice.call(list);
}

function nlQuery(sel) { return nlQueryAll(sel)[0] || null; }

// Selector trỏ thẳng vào ảnh => danh sách ảnh; trỏ vào vùng nội dung => các ảnh bên trong
function nlResolveImages(sel) {
  var nodes = sel ? nlQueryAll(sel) : [document.body];
  if (!nodes.length) return [];
  if (nodes[0].tagName === 'IMG') {
    return nodes.filter(function (n) { return n.tagName === 'IMG'; });
  }
  return Array.prototype.slice.call(nodes[0].querySelectorAll('img'));
}

// Thử check() mỗi giây, tối đa maxTries lần
function nlWaitFor(check, done, maxTries) {
  var n = 0, max = maxTries || 600;
  var timer = setInterval(function () {
    var ok = false;
    try { ok = check(); } catch (e) {}
    if (ok) {
      clearInterval(timer);
      done();
    } else if (++n > max) {
      clearInterval(timer);
    }
  }, 1000);
}

function nlIframeLoaded(el) {
  var f = el && el.querySelector('iframe');
  return !!f && f.getAttribute('data-load-complete') === 'true';
}

function nlMinSizeStyle(size) {
  if (!Array.isArray(size)) return '';
  var w = 0, h = 0;
  if (!Array.isArray(size[0]) && !Array.isArray(size[1])) {
    w = size[0];
    h = size[1];
  } else {
    for (var i = 0; i < size.length; i++) {
      if (!Array.isArray(size[i])) continue;
      w = (w === 0 || size[i][0] < w) ? size[i][0] : w;
      h = (h === 0 || size[i][1] < h) ? size[i][1] : h;
    }
  }
  return 'min-width:' + w + 'px;min-height:' + h + 'px;';
}

function nlCleanKey(s) { return String(s).replace(/[^a-zA-Z0-9]/g, ''); }

// _isDisplay = 0: cả PC & Mobile, 1: chỉ PC, 2: chỉ Mobile
function nlDeviceAllowed(isDisplay) {
  var d = Number(isDisplay) || 0;
  if (d === 1 && nlIsMobile()) return false;
  if (d === 2 && !nlIsMobile()) return false;
  return true;
}

// _pageView: [0] hoặc [] = mọi lượt xem; [1, 3, 5] = chỉ lượt xem thứ 1, 3, 5
function nlPageViewAllowed(list, pv) {
  if (!Array.isArray(list) || !list.length || Number(list[0]) === 0) return true;
  for (var i = 0; i < list.length; i++) {
    if (Number(list[i]) === pv) return true;
  }
  return false;
}

// Bộ đếm lượt xem kiểu cũ (localStorage, reset sau 3 phút). Chỉ tăng 1 lần / lượt tải trang.
var nlLegacyPV = null;
function nlLegacyPageView() {
  if (nlLegacyPV !== null) return nlLegacyPV;
  var count = 1;
  try {
    var now = Date.now();
    var prev = parseInt(localStorage.getItem('pageViewCount'), 10) || 0;
    if (prev === 0 || now - Number(localStorage.getItem('expiry')) > 180000) {
      prev = 0;
      localStorage.setItem('expiry', now);
    }
    count = prev + 1;
    localStorage.setItem('pageViewCount', count);
  } catch (e) {}
  return (nlLegacyPV = count);
}

// Bộ đếm lượt xem kiểu mới (sessionStorage theo từng ad unit), bắt đầu từ 1
var nlSessionPV = {};
function nlSessionPageView(key, storeNext) {
  if (key in nlSessionPV) return nlSessionPV[key];
  var pv = 1;
  try {
    var s = sessionStorage.getItem(key);
    if (s !== null) pv = (parseInt(s, 10) || 0) + (storeNext ? 0 : 1);
    sessionStorage.setItem(key, storeNext ? pv + 1 : pv);
  } catch (e) {}
  return (nlSessionPV[key] = pv);
}

function nlGoogletag() {
  window.googletag = window.googletag || { cmd: [] };
  return window.googletag;
}

var nlServicesEnabled = false;
function nlEnableServices() {
  if (nlServicesEnabled) return;
  nlServicesEnabled = true;
  googletag.pubads().enableSingleRequest();
  googletag.enableServices();
}

function nlRefreshIfNeeded(slot) {
  var p = googletag.pubads();
  if (p.isInitialLoadDisabled && p.isInitialLoadDisabled()) p.refresh([slot]);
}

// 1 listener slotRenderEnded duy nhất cho toàn bộ slot của Netlink
var nlRenderHandlers = [], nlRenderHooked = false;
function nlOnSlotRender(slot, cb) {
  nlRenderHandlers.push({ slot: slot, cb: cb });
  if (nlRenderHooked) return;
  nlRenderHooked = true;
  googletag.pubads().addEventListener('slotRenderEnded', function (e) {
    for (var i = 0; i < nlRenderHandlers.length; i++) {
      if (nlRenderHandlers[i].slot === e.slot) nlRenderHandlers[i].cb(e, e.slot);
    }
  });
}

function nlBuildMapping(tiers) {
  var m = googletag.sizeMapping();
  tiers.forEach(function (t) { m.addSize(t[0], t[1]); });
  return m.build();
}

// Chuyển _mapping dạng cũ [{breakpoint, size}] sang dạng [[breakpoint, sizes]]
function nlLegacyMapping(mapping) {
  if (!Array.isArray(mapping) || !mapping.length) return null;
  return mapping.map(function (m) {
    return [m.breakpoint, Array.isArray(m.size) ? m.size : [m.size]];
  });
}

// Định nghĩa + hiển thị 1 slot thường. Phần tử divId phải có trong DOM trước khi gọi.
function nlShowSlot(adUnit, sizes, divId, opts) {
  opts = opts || {};
  nlGoogletag().cmd.push(function () {
    var slot = googletag.defineSlot(adUnit, sizes, divId);
    if (!slot) return;
    if (opts.mapping) slot.defineSizeMapping(nlBuildMapping(opts.mapping));
    slot.addService(googletag.pubads());
    nlEnableServices();
    if (opts.onRender) nlOnSlotRender(slot, opts.onRender);
    googletag.display(divId);
    nlRefreshIfNeeded(slot);
  });
}

// Slot out-of-page: format = 'INTERSTITIAL' | 'TOP_ANCHOR' | 'BOTTOM_ANCHOR' | 'REWARDED'
function nlShowOutOfPage(adUnit, format, setup) {
  nlGoogletag().cmd.push(function () {
    var slot = googletag.defineOutOfPageSlot(adUnit, googletag.enums.OutOfPageFormat[format]);
    if (!slot) {
      if (setup) setup(null);
      return;
    }
    slot.addService(googletag.pubads());
    if (setup) setup(slot);
    nlEnableServices();
    googletag.display(slot);
    nlRefreshIfNeeded(slot);
  });
}

// Logic chèn tự động theo khoảng cách màn hình (dùng cho AutoAds & MultipleSizes)
function nlAutoPlace(selector, start, end, insertPos, minScreen, posStart, posEnd, place) {
  var els = nlQueryAll(selector);
  if (!els.length) return false;
  insertPos = Number(insertPos);
  var gap = screen.height * minScreen;
  var minAd = 0, position = 1, last = els.length - 1;
  for (var i = 0; i < els.length; i++) {
    if (start > end) break;
    var el = els[i];
    if (insertPos === 0 || insertPos === 3) {
      if (i === 0 || el.offsetTop + el.clientHeight - minAd - gap >= 0) {
        if (posStart <= position++) {
          place(start++, el, insertPos);
          if (posEnd != 0 && posEnd < position) break;
        }
        if (i < last) minAd = els[i + 1].offsetTop;
      }
    } else if (insertPos === 1 || insertPos === 2) {
      if (i === 0 || el.offsetTop - minAd - gap >= 0) {
        if (posStart <= position++) {
          place(start++, el, insertPos);
          if (posEnd != 0 && posEnd < position) break;
        }
        minAd = el.offsetTop;
        if (i < last) continue;
      }
      if (i === last && start <= end && el.offsetTop + el.clientHeight - minAd - gap >= 0) {
        place(start++, el, insertPos === 1 ? 0 : 3);
      }
    }
  }
  return true;
}

// Khung In-Image: chèn ngay sau ảnh, có nút × (hiện khi ad tải xong)
function nlBuildInImage(image, adEl, marginBottom) {
  var wrap = document.createElement('div');
  wrap.className = 'netlink-inimage-ad';
  wrap.style.cssText = 'position:relative;';
  var box = document.createElement('div');
  box.style.cssText = 'position:absolute;bottom:' + marginBottom + 'px;z-index:10;width:100%;';
  var center = document.createElement('center');
  var close = document.createElement('span');
  close.innerHTML = '×';
  close.style.cssText = 'position:absolute;display:none;z-index:1;width:25px !important;height:25px !important;right:2px !important;top:-27px !important;cursor:pointer;font-size:20px;text-align:center;background:white;padding:2px;border-radius:20px;line-height:1;';
  center.appendChild(adEl);
  box.appendChild(center);
  box.appendChild(close);
  wrap.appendChild(box);
  image.insertAdjacentElement('afterend', wrap);
  close.addEventListener('click', function () { wrap.style.visibility = 'hidden'; });
  return close;
}

function nlAdxInImageAt(adUnit, adSize, mapping, image, marginBottom) {
  checkGPTExists();
  var id = randomID();
  var div = document.createElement('div');
  div.id = id;
  var close = nlBuildInImage(image, div, marginBottom);
  nlShowSlot(adUnit, adSize, id, { mapping: nlLegacyMapping(mapping) });
  nlWaitFor(function () { return nlIframeLoaded(div); }, function () { close.style.display = 'block'; });
}

// Khung In-Page (mobile): ad 300x600 cố định, lộ dần theo vùng cuộn
function nlBuildInPageHolder() {
  var root = nlHtml(
    '<div class="netlink-inpage-ad">' +
      '<div class="inpage-content-ad" style="overflow:hidden;position:relative;z-index:2;width:100%;">' +
        '<div class="inpage-ad" style="display:none;"></div>' +
      '</div>' +
    '</div>');
  return { root: root, content: root.firstElementChild, ad: root.firstElementChild.firstElementChild };
}

function nlBindInPageClip(holder, w, h, marginTop) {
  holder.content.style.height = h + 'px';
  function update() {
    if (!nlIsMobile() || !holder.root.isConnected) return;
    var mt = marginTop >= 0 ? marginTop : (window.innerHeight - h) / 2;
    var top = holder.content.getBoundingClientRect().top - mt;
    var bot = top > 0 ? h : h + top;
    holder.ad.style.cssText =
      'display:block;clip:rect(' + top + 'px,' + w + 'px,' + bot + 'px,0px);' +
      'left:' + (window.innerWidth - w) / 2 + 'px;top:' + mt + 'px;position:fixed;z-index:10000;';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function nlAdxInPageLegacy(adUnit, sel, marginTop) {
  if (!nlIsMobile()) return;
  var parent = nlQuery(sel);
  if (!parent || !parent.children.length) return;
  checkGPTExists();
  var w = 300, h = 600, id = randomID();
  var mid = Math.max(1, Math.min(Math.floor(parent.childElementCount / 2), 4));
  var holder = nlBuildInPageHolder();
  holder.ad.appendChild(nlHtml('<div id="' + id + '" style="min-width:' + w + 'px;min-height:' + h + 'px;"></div>'));
  parent.children[mid - 1].insertAdjacentElement('afterend', holder.root);
  nlBindInPageClip(holder, w, h, marginTop);
  nlShowSlot(adUnit, [w, h], id);
}

// In-Page kiểu mới: chèn ngay tại vị trí thẻ <script> gọi hàm
function nlAdxInPageInline(adUnit, marginTop) {
  checkGPTExists();
  var id = randomID();
  var css = 'text-align:center;min-height:100px;' + (marginTop != -1 ? 'margin-top:' + marginTop + 'px;' : '');
  nlLog('[InPage] Khởi tạo AdUnit: ' + adUnit);
  var script = document.currentScript;
  if (script && script.parentNode) {
    var div = document.createElement('div');
    div.id = id;
    div.style.cssText = css;
    script.parentNode.insertBefore(div, script);
  } else if (document.readyState === 'loading') {
    document.write('<div id="' + id + '" style="' + css + '"></div>');
  } else {
    return;
  }
  nlShowSlot(adUnit, [300, 600], id, {
    onRender: function (e) {
      var el = document.getElementById(id);
      if (e.isEmpty) {
        nlLog('[InPage] TRỐNG: ' + adUnit);
        if (el) el.style.display = 'none';
      } else {
        nlLog('[InPage] Đã hiển thị: ' + adUnit);
      }
    }
  });
}

// First View kiểu cũ: overlay trắng, chỉ hiện khi ad tải xong
var NL_FV_CLOSE = {
  adx: { css: 'width:60px !important;height:25px !important;top:80px !important;background:rgba(183,183,183,0.71);', label: 'close', labelCss: 'font-size:15px;' },
  adxExt: { css: 'width:85px !important;height:25px !important;top:80px !important;background:rgba(0,112,186,1);', label: 'CLOSE', labelCss: 'font-size:15px;color:white;' },
  adsense: { css: 'width:160px !important;height:30px !important;top:5% !important;background:rgba(183,183,183,0.71);', label: 'Close', labelCss: 'font-size:20px;' }
};

function nlFirstViewLegacy(contentEl, isReady, close) {
  var overlay = nlHtml(
    '<div class="netlink-firstview" style="display:block;position:fixed;width:100%;height:100vh;top:0;left:0;text-align:center;opacity:1;background-color:rgba(255,255,255,0.7);visibility:hidden;z-index:2147483647;">' +
      '<div class="netlink-firstview-close" style="display:none;position:absolute;right:0 !important;cursor:pointer;padding:2px;border-radius:20px 0 0 20px;z-index:9999;' + close.css + '">' +
        '<span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' + close.labelCss + '">' + close.label + '</span>' +
      '</div>' +
    '</div>');
  overlay.appendChild(contentEl);
  document.body.appendChild(overlay);
  var btn = overlay.querySelector('.netlink-firstview-close');
  btn.addEventListener('click', function () { overlay.style.display = 'none'; });
  nlWaitFor(isReady, function () {
    overlay.style.visibility = 'visible';
    btn.style.display = 'block';
  });
}

function nlAdxFirstViewLegacy(adUnit, adSize, close) {
  checkGPTExists();
  var id = randomID();
  var div = document.createElement('div');
  div.id = id;
  div.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);';
  nlFirstViewLegacy(div, function () { return nlIframeLoaded(div); }, close);
  nlShowSlot(adUnit, adSize, id);
}

// First View kiểu mới: popup nền tối, tự mapping size, nút CLOSE dùng chung
function nlAdxPopup(adUnit, o) {
  checkGPTExists();
  var id = randomID(), cid = o.containerPrefix + id, wid = o.wrapperPrefix + id;
  var c = nlHtml(
    '<div id="' + cid + '" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483646;background:' + o.overlay + ';display:flex;justify-content:center;align-items:center;">' +
      '<div id="' + wid + '" style="position:relative;background:#fff;line-height:0;' + (o.wrapperCss || '') + '">' +
        '<div id="' + id + '"></div>' +
      '</div>' +
    '</div>');
  document.body.appendChild(c);
  nlShowSlot(adUnit, o.sizes, id, {
    mapping: o.mapping,
    onRender: function (e, slot) {
      if (e.isEmpty) {
        c.remove();
        return;
      }
      renderNetlinkMegaClose(wid, slot, 0, o.closeBtnPos);
      if (o.closeTop) {
        var b = c.querySelector('.nl-mega-close');
        if (b) {
          b.style.zIndex = '9999';
          b.style.top = o.closeTop;
        }
      }
    }
  });
}

function nlAdsenseIns(client, slot, style, extra) {
  var ins = document.createElement('ins');
  ins.className = 'adsbygoogle';
  ins.style.cssText = style;
  ins.setAttribute('data-ad-client', client);
  ins.setAttribute('data-ad-slot', slot);
  if (extra) {
    for (var k in extra) ins.setAttribute(k, extra[k]);
  }
  return ins;
}

function nlAdsensePush() {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    nlLog('[Adsense] push error', e);
  }
}

function nlRevealBox(cid, innerEl) {
  var wrap = nlHtml(
    '<div id="' + cid + '-wrapper" style="width:100%;height:350px;margin:30px 0;position:relative;clip-path:inset(0 0 0 0);-webkit-clip-path:inset(0 0 0 0);">' +
      '<div id="' + cid + '" style="position:fixed;bottom:0;left:0;width:100%;height:350px;z-index:-1;display:none;justify-content:center;align-items:center;background:#ffffff;"></div>' +
    '</div>');
  wrap.firstElementChild.appendChild(innerEl);
  return wrap;
}
