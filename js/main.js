/* ==========================================================================
   MERIDIAN — Main application logic
   Organized into small, reusable functions grouped by feature area.
   ========================================================================== */

(function(){
  'use strict';

  /* ---------------------------------------------------------------------
     Utilities
  --------------------------------------------------------------------- */
  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const fmt = (n) => '$' + n.toLocaleString('en-US', {minimumFractionDigits:0});
  const byId = (id) => PRODUCTS.find(p => p.id === id);
  const debounce = (fn, wait=200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(()=>fn(...a), wait); }; };
  const store = {
    get(key, fallback){ try{ const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch(e){ return fallback; } },
    set(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); } catch(e){ /* storage unavailable */ } }
  };
  const ratingStars = (r) => '★★★★★☆☆☆☆☆'.slice(5 - Math.round(r), 10 - Math.round(r));

  /* ---------------------------------------------------------------------
     State
  --------------------------------------------------------------------- */
  let cart = store.get('meridian_cart', []);        // [{id, color, size, qty}]
  let wishlist = store.get('meridian_wishlist', []); // [id]
  let currentProduct = null;
  let currentColorIdx = 0;
  let currentSizeIdx = 0;
  let productsShown = 8;
  let activeCategory = 'all';
  let activeSort = 'featured';
  let searchQuery = '';

  const persistCart = () => store.set('meridian_cart', cart);
  const persistWishlist = () => store.set('meridian_wishlist', wishlist);

  /* ---------------------------------------------------------------------
     Toasts
  --------------------------------------------------------------------- */
  function toast(msg, icon='check_circle', isError=false){
    const stack = $('#toastStack');
    const el = document.createElement('div');
    el.className = 'toast' + (isError ? ' error' : '');
    el.innerHTML = `<span class="material-symbols-outlined">${icon}</span><span>${msg}</span>`;
    stack.appendChild(el);
    requestAnimationFrame(()=> el.classList.add('show'));
    setTimeout(()=>{
      el.classList.remove('show');
      setTimeout(()=> el.remove(), 400);
    }, 3200);
  }

  /* ---------------------------------------------------------------------
     Preloader
  --------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    setTimeout(()=> $('#loader')?.classList.add('hidden'), 500);
  });

  /* ---------------------------------------------------------------------
     Navbar: scroll state, active link, mobile menu
  --------------------------------------------------------------------- */
  const navbar = $('#navbar');
  function onScroll(){
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateScrollProgress();
    updateScrollTopBtn();
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive:true });

  const navLinks = $$('.nav-links a, .mobile-menu a');
  function updateActiveNav(){
    const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    let current = sections[0];
    for(const sec of sections){
      if(sec.getBoundingClientRect().top - 120 <= 0) current = sec;
    }
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current?.id));
  }

  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  const mobileOverlay = $('#mobileOverlay');
  function closeMobileMenu(){ mobileMenu.classList.remove('open'); mobileOverlay.classList.remove('open'); }
  navToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
  });
  mobileOverlay?.addEventListener('click', closeMobileMenu);
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', closeMobileMenu));

  /* ---------------------------------------------------------------------
     Theme toggle
  --------------------------------------------------------------------- */
  const root = document.documentElement;
  const savedTheme = store.get('meridian_theme', 'dark');
  root.setAttribute('data-theme', savedTheme);
  $$('.theme-toggle').forEach(btn => btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('meridian_theme', next);
  }));

  /* ---------------------------------------------------------------------
     Scroll progress + scroll-to-top
  --------------------------------------------------------------------- */
  const progressBar = $('#scrollProgress');
  function updateScrollProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  const scrollTopBtn = $('#scrollTopBtn');
  function updateScrollTopBtn(){ scrollTopBtn.classList.toggle('visible', window.scrollY > 600); }
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------------------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  function observeReveals(ctx=document){ $$('.reveal, .reveal-scale', ctx).forEach(el => revealObserver.observe(el)); }

  /* ---------------------------------------------------------------------
     Ripple effect on .ripple buttons
  --------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const dot = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.4;
    dot.className = 'ripple-dot';
    dot.style.width = dot.style.height = size + 'px';
    dot.style.left = (e.clientX - rect.left - size/2) + 'px';
    dot.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(dot);
    setTimeout(()=> dot.remove(), 650);
  });

  /* ---------------------------------------------------------------------
     Categories
  --------------------------------------------------------------------- */
  function renderCategories(){
    const grid = $('#categoryGrid');
    grid.innerHTML = CATEGORIES.map((c, i) => `
      <article class="category-card card reveal-scale" style="--i:${i % 5}" data-cat-id="${c.id}">
        <img src="${c.img}" alt="${c.name} watch collection" loading="lazy">
        <span class="category-icon"><span class="material-symbols-outlined" aria-hidden="true">${c.icon}</span></span>
        <div class="category-overlay">
          <div class="category-name">${c.name}</div>
          <div class="category-count">${c.count} styles</div>
          <button class="category-link" data-cat-detail="${c.id}">Read more <span class="material-symbols-outlined" style="font-size:1em">arrow_forward</span></button>
        </div>
      </article>`).join('');
    observeReveals(grid);

    grid.addEventListener('click', (e) => {
      const detailBtn = e.target.closest('[data-cat-detail]');
      const card = e.target.closest('.category-card');
      if(detailBtn){ openCategoryModal(detailBtn.dataset.catDetail); return; }
      if(card){ filterByCategory(card.dataset.catId); }
    });
  }

  function filterByCategory(catId){
    const cat = CATEGORIES.find(c => c.id === catId);
    if(!cat) return;
    activeCategory = cat.name;
    $$('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.filter === cat.name));
    productsShown = 8;
    renderProducts();
    document.querySelector('#products').scrollIntoView({ behavior:'smooth' });
  }

  function openCategoryModal(catId){
    const cat = CATEGORIES.find(c => c.id === catId);
    if(!cat) return;
    const modal = $('#categoryModal');
    $('#categoryModalBody').innerHTML = `
      <img src="${cat.img}" alt="${cat.name}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--radius-md);margin-bottom:var(--space-md)">
      <span class="tag tag-limited">${cat.count} STYLES</span>
      <h3 class="pd-title">${cat.name}</h3>
      <p class="pd-desc">${cat.desc}</p>
      <button class="btn btn-primary ripple" id="catShopBtn" data-cat-id="${cat.id}">Shop ${cat.name} <span class="material-symbols-outlined">arrow_forward</span></button>
    `;
    openModal(modal);
    $('#catShopBtn').addEventListener('click', () => { closeModal(modal); filterByCategory(cat.id); });
  }

  /* ---------------------------------------------------------------------
     Products: filter / sort / search / render
  --------------------------------------------------------------------- */
  function getFilteredProducts(){
    let list = PRODUCTS.slice();
    if(activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if(searchQuery.trim()){
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    switch(activeSort){
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
      case 'newest': list.sort((a,b)=> (b.badge==='new') - (a.badge==='new')); break;
      case 'popularity': list.sort((a,b)=>b.reviews-a.reviews); break;
      default: break;
    }
    return list;
  }

  function highlight(text){
    if(!searchQuery.trim()) return text;
    const q = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${q})`, 'ig'), '<mark>$1</mark>');
  }

  function productCard(p, i){
    const inWishlist = wishlist.includes(p.id);
    const badgeHtml = p.badge ? `<span class="tag tag-${p.badge}">${p.badge === 'new' ? 'New' : p.badge === 'sale' ? 'Sale' : 'Limited'}</span>` : '';
    const stockHtml = p.stock === 'out' ? `<div class="stock-note out">Out of stock</div>` : p.stock === 'low' ? `<div class="stock-note low">Only a few left</div>` : `<div class="stock-note">In stock</div>`;
    return `
      <article class="product-card card reveal" style="--i:${i % 4}" data-id="${p.id}">
        <div class="product-media">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <div class="product-badges">${badgeHtml}${p.stock==='out' ? '<span class="tag tag-out">Sold out</span>' : ''}</div>
          <div class="product-quick">
            <button class="btn-wishlist ${inWishlist ? 'wishlisted' : ''}" data-action="wishlist" aria-label="Toggle wishlist"><span class="material-symbols-outlined">favorite</span></button>
            <button data-action="quickview" aria-label="Quick view"><span class="material-symbols-outlined">visibility</span></button>
            <button data-action="share" aria-label="Share product"><span class="material-symbols-outlined">ios_share</span></button>
          </div>
          <div class="product-cta">
            <button class="btn btn-primary btn-block btn-sm ripple" data-action="add" ${p.stock==='out' ? 'disabled' : ''}>${p.stock==='out' ? 'Notify me' : 'Add to cart'}</button>
          </div>
        </div>
        <div class="product-body">
          <div class="product-category">${p.category}</div>
          <h3 class="product-name">${highlight(p.name)}</h3>
          <div class="rating"><span class="stars">${ratingStars(p.rating)}</span> ${p.rating} (${p.reviews})</div>
          <div class="product-price-row">
            <span class="price">${fmt(p.price)}</span>
            ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span><span class="discount-pct">-${Math.round((1-p.price/p.oldPrice)*100)}%</span>` : ''}
          </div>
          ${stockHtml}
        </div>
      </article>`;
  }

  function renderProducts(){
    const grid = $('#productGrid');
    const filtered = getFilteredProducts();
    const visible = filtered.slice(0, productsShown);
    grid.innerHTML = visible.length ? visible.map(productCard).join('') :
      `<div class="no-results"><span class="material-symbols-outlined">search_off</span><p>No watches match your search. Try a different keyword or filter.</p></div>`;
    observeReveals(grid);
    $('#loadMoreBtn').style.display = productsShown < filtered.length ? 'inline-flex' : 'none';
    $('#resultsCount').textContent = `${filtered.length} ${filtered.length === 1 ? 'watch' : 'watches'}`;
  }

  $('#loadMoreBtn')?.addEventListener('click', () => { productsShown += 8; renderProducts(); });

  $('#filterPills')?.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if(!pill) return;
    $$('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.filter;
    productsShown = 8;
    renderProducts();
  });

  $('#sortSelect')?.addEventListener('change', (e) => { activeSort = e.target.value; renderProducts(); });

  $('#productSearchInput')?.addEventListener('input', debounce((e) => {
    searchQuery = e.target.value;
    productsShown = 8;
    renderProducts();
  }, 180));

  $('#productGrid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if(!card) return;
    const id = card.dataset.id;
    const action = e.target.closest('[data-action]')?.dataset.action;
    if(action === 'wishlist'){ toggleWishlist(id, e.target.closest('button')); return; }
    if(action === 'quickview'){ openProductModal(id); return; }
    if(action === 'share'){ shareProduct(id); return; }
    if(action === 'add'){ addToCart(id, null, null, 1); return; }
    openProductModal(id);
  });

  function shareProduct(id){
    const p = byId(id);
    const shareData = { title: p.name, text: `Check out the ${p.name} from Meridian.`, url: location.href.split('#')[0] + '#products' };
    if(navigator.share){ navigator.share(shareData).catch(()=>{}); }
    else { navigator.clipboard?.writeText(shareData.url).catch(()=>{}); toast('Product link copied to clipboard', 'link'); }
  }

  /* ---------------------------------------------------------------------
     Wishlist
  --------------------------------------------------------------------- */
  function toggleWishlist(id, btn){
    const idx = wishlist.indexOf(id);
    if(idx > -1){ wishlist.splice(idx,1); toast('Removed from wishlist', 'heart_broken'); }
    else { wishlist.push(id); toast('Added to wishlist', 'favorite'); btn?.classList.add('bump'); }
    persistWishlist();
    renderWishlistBadge();
    renderProducts();
    renderWishlistDrawer();
    if(currentProduct?.id === id) syncProductModalWishlistBtn();
  }
  function renderWishlistBadge(){
    const badge = $('#wishlistCount');
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length ? 'flex' : 'none';
  }
  function renderWishlistDrawer(){
    const wrap = $('#wishlistItems');
    if(!wishlist.length){
      wrap.innerHTML = `<div class="drawer-empty"><span class="material-symbols-outlined">favorite_border</span><p>Your wishlist is empty.<br>Tap the heart on any watch to save it here.</p></div>`;
      return;
    }
    wrap.innerHTML = wishlist.map(id => {
      const p = byId(id); if(!p) return '';
      return `<div class="cart-line" data-id="${id}">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div class="cart-line-name">${p.name}</div>
          <div class="cart-line-meta">${fmt(p.price)}</div>
          <button class="remove-line" data-remove-wish="${id}">Remove</button>
        </div>
        <button class="btn btn-sm btn-outline" data-move-cart="${id}">Add to cart</button>
      </div>`;
    }).join('');
  }
  $('#wishlistItems')?.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove-wish]');
    const mv = e.target.closest('[data-move-cart]');
    if(rm){ toggleWishlist(rm.dataset.removeWish); }
    if(mv){ addToCart(mv.dataset.moveCart, null, null, 1); }
  });

  /* ---------------------------------------------------------------------
     Cart
  --------------------------------------------------------------------- */
  function addToCart(id, color, size, qty){
    const p = byId(id);
    color = color ?? p.colors[0].n;
    size = size ?? p.sizes[0];
    const existing = cart.find(l => l.id === id && l.color === color && l.size === size);
    if(existing){ existing.qty += qty; } else { cart.push({ id, color, size, qty }); }
    persistCart();
    renderCartBadge();
    renderCartDrawer();
    toast(`${p.name} added to bag`, 'shopping_bag');
    const badge = $('#cartCount'); badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
  }
  function updateCartQty(index, delta){
    cart[index].qty += delta;
    if(cart[index].qty <= 0) cart.splice(index,1);
    persistCart(); renderCartBadge(); renderCartDrawer();
  }
  function removeCartLine(index){ cart.splice(index,1); persistCart(); renderCartBadge(); renderCartDrawer(); }

  function renderCartBadge(){
    const count = cart.reduce((s,l)=>s+l.qty,0);
    const badge = $('#cartCount');
    badge.textContent = count;
    badge.style.display = count ? 'flex' : 'none';
  }

  function cartTotals(){
    const subtotal = cart.reduce((s,l)=> s + byId(l.id).price * l.qty, 0);
    const shipping = subtotal === 0 || subtotal >= 500 ? 0 : 24;
    const tax = Math.round(subtotal * 0.07);
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  }

  function renderCartDrawer(){
    const wrap = $('#cartItems');
    if(!cart.length){
      wrap.innerHTML = `<div class="drawer-empty"><span class="material-symbols-outlined">shopping_bag</span><p>Your bag is empty.<br>Browse the collection to find your next watch.</p></div>`;
    } else {
      wrap.innerHTML = cart.map((l, i) => {
        const p = byId(l.id);
        return `<div class="cart-line">
          <img src="${p.img}" alt="${p.name}">
          <div>
            <div class="cart-line-name">${p.name}</div>
            <div class="cart-line-meta">${l.color} · ${l.size}</div>
            <div class="qty-stepper">
              <button data-qty-down="${i}" aria-label="Decrease quantity">−</button>
              <span>${l.qty}</span>
              <button data-qty-up="${i}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div style="text-align:right">
            <div class="price" style="font-size:0.9rem">${fmt(p.price * l.qty)}</div>
            <button class="remove-line" data-remove-cart="${i}">Remove</button>
          </div>
        </div>`;
      }).join('');
    }
    const t = cartTotals();
    $('#cartSubtotal').textContent = fmt(t.subtotal);
    $('#cartShipping').textContent = t.subtotal === 0 ? '—' : (t.shipping === 0 ? 'Free' : fmt(t.shipping));
    $('#cartTax').textContent = fmt(t.tax);
    $('#cartTotal').textContent = fmt(t.total);
    $('#checkoutBtn').disabled = cart.length === 0;
  }
  $('#cartItems')?.addEventListener('click', (e) => {
    const up = e.target.closest('[data-qty-up]');
    const down = e.target.closest('[data-qty-down]');
    const rm = e.target.closest('[data-remove-cart]');
    if(up) updateCartQty(+up.dataset.qtyUp, 1);
    if(down) updateCartQty(+down.dataset.qtyDown, -1);
    if(rm) removeCartLine(+rm.dataset.removeCart);
  });
  $('#checkoutBtn')?.addEventListener('click', () => {
    toast('This is a portfolio demo — checkout is not connected to real payment.', 'info');
  });

  /* ---------------------------------------------------------------------
     Drawers open/close
  --------------------------------------------------------------------- */
  function openDrawer(drawer, overlay){ drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeDrawer(drawer, overlay){ drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow=''; }

  const cartDrawer = $('#cartDrawer'), cartOverlay = $('#cartOverlay');
  const wishDrawer = $('#wishlistDrawer'), wishOverlay = $('#wishlistOverlay');
  $$('[data-open="cart"]').forEach(b => b.addEventListener('click', () => openDrawer(cartDrawer, cartOverlay)));
  $$('[data-open="wishlist"]').forEach(b => b.addEventListener('click', () => openDrawer(wishDrawer, wishOverlay)));
  $('#cartCloseBtn')?.addEventListener('click', () => closeDrawer(cartDrawer, cartOverlay));
  $('#wishlistCloseBtn')?.addEventListener('click', () => closeDrawer(wishDrawer, wishOverlay));
  cartOverlay?.addEventListener('click', () => closeDrawer(cartDrawer, cartOverlay));
  wishOverlay?.addEventListener('click', () => closeDrawer(wishDrawer, wishOverlay));

  /* ---------------------------------------------------------------------
     Generic modal open/close
  --------------------------------------------------------------------- */
  function openModal(modal){ modal.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeModal(modal){ modal.classList.remove('open'); document.body.style.overflow=''; }
  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(overlay); });
    $$('.modal-close', overlay).forEach(btn => btn.addEventListener('click', () => closeModal(overlay)));
  });
  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Escape') return;
    $$('.modal-overlay.open').forEach(closeModal);
    closeDrawer(cartDrawer, cartOverlay);
    closeDrawer(wishDrawer, wishOverlay);
    closeSearch();
    const vid = $('#videoModal video'); if(vid) vid.pause();
  });

  /* ---------------------------------------------------------------------
     Product detail modal
  --------------------------------------------------------------------- */
  function openProductModal(id){
    currentProduct = byId(id);
    currentColorIdx = 0; currentSizeIdx = 0;
    renderProductModal();
    openModal($('#productModal'));
  }

  function syncProductModalWishlistBtn(){
    const btn = $('#pdWishlistBtn');
    if(!btn || !currentProduct) return;
    btn.classList.toggle('wishlisted', wishlist.includes(currentProduct.id));
  }

  function renderProductModal(){
    const p = currentProduct;
    const body = $('#productModalBody');
    const related = PRODUCTS.filter(r => r.category === p.category && r.id !== p.id).slice(0,4);
    body.innerHTML = `
      <div class="pd-grid">
        <div class="pd-gallery">
          <div class="pd-gallery-main" id="pdZoom"><img id="pdMainImg" src="${p.img}" alt="${p.name}"></div>
          <div class="pd-thumbs">
            ${[p.img, p.colors[0]?.h ? p.img : p.img, p.img].map((im,i)=>`<img src="${im}" class="${i===0?'active':''}" data-thumb="${i}" alt="View ${i+1}">`).join('')}
          </div>
        </div>
        <div class="pd-info">
          <div class="pd-category">${p.category} · SKU ${p.sku}</div>
          <h3 class="pd-title">${p.name}</h3>
          <div class="rating" style="margin-bottom:0.8rem"><span class="stars">${ratingStars(p.rating)}</span> ${p.rating} (${p.reviews} reviews)</div>
          <div class="pd-price-row">
            <span class="pd-price">${fmt(p.price)}</span>
            ${p.oldPrice ? `<span class="price-old">${fmt(p.oldPrice)}</span><span class="discount-pct">-${Math.round((1-p.price/p.oldPrice)*100)}%</span>` : ''}
          </div>
          <p class="pd-desc">${p.desc}</p>

          <div class="pd-option-label">Color — <span id="pdColorName">${p.colors[0].n}</span></div>
          <div class="pd-colors" id="pdColors">
            ${p.colors.map((c,i)=>`<button class="pd-color-swatch ${i===0?'active':''}" style="background:${c.h}" data-color-idx="${i}" aria-label="${c.n}"></button>`).join('')}
          </div>

          <div class="pd-option-label">Case size</div>
          <div class="pd-sizes" id="pdSizes">
            ${p.sizes.map((s,i)=>`<button class="pd-size-opt ${i===0?'active':''}" data-size-idx="${i}">${s}</button>`).join('')}
          </div>

          <div class="pd-qty-row">
            <div class="pd-option-label" style="margin:0">Quantity</div>
            <div class="qty-stepper" id="pdQtyStepper">
              <button data-pd-qty="-1">−</button><span id="pdQtyVal">1</span><button data-pd-qty="1">+</button>
            </div>
          </div>

          <div class="pd-actions">
            <button class="btn btn-primary ripple" id="pdAddToCart" ${p.stock==='out'?'disabled':''}>
              <span class="material-symbols-outlined">shopping_bag</span> ${p.stock==='out' ? 'Notify me' : 'Add to cart'}
            </button>
            <button class="btn-icon" id="pdWishlistBtn" aria-label="Toggle wishlist"><span class="material-symbols-outlined">favorite</span></button>
            <button class="btn-icon" id="pdShareBtn" aria-label="Share"><span class="material-symbols-outlined">ios_share</span></button>
          </div>

          <ul class="pd-meta-list">
            <li><span class="material-symbols-outlined">local_shipping</span> Free shipping on orders over $500, arrives in 3–5 business days.</li>
            <li><span class="material-symbols-outlined">replay</span> 30-day returns on unworn watches in original packaging.</li>
            <li><span class="material-symbols-outlined">verified</span> 3-year international movement warranty included.</li>
          </ul>
        </div>

        <div class="pd-tabs">
          <button class="pd-tab-btn active" data-tab="desc">Description</button>
          <button class="pd-tab-btn" data-tab="specs">Specifications</button>
          <button class="pd-tab-btn" data-tab="features">Features</button>
        </div>
        <div class="pd-tab-panel active" data-panel="desc"><p>${p.desc}</p></div>
        <div class="pd-tab-panel" data-panel="specs">
          <table class="spec-table">${Object.entries(p.specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
        </div>
        <div class="pd-tab-panel" data-panel="features"><ul>${p.features.map(f=>`<li>${f}</li>`).join('')}</ul></div>

        ${related.length ? `<div class="related-strip">
          <h4>You may also like</h4>
          <div class="related-grid">
            ${related.map(r => `<div class="related-mini" data-related="${r.id}">
              <img src="${r.img}" alt="${r.name}">
              <div class="rm-name">${r.name}</div>
              <div class="rm-price">${fmt(r.price)}</div>
            </div>`).join('')}
          </div>
        </div>` : ''}
      </div>
    `;
    syncProductModalWishlistBtn();
    bindProductModalEvents();
  }

  function bindProductModalEvents(){
    const p = currentProduct;
    $('#pdZoom').addEventListener('click', function(){ this.classList.toggle('zoomed'); });
    $$('.pd-thumbs img').forEach(thumb => thumb.addEventListener('click', () => {
      $('#pdMainImg').src = thumb.src;
      $$('.pd-thumbs img').forEach(t=>t.classList.remove('active'));
      thumb.classList.add('active');
    }));
    $$('#pdColors button').forEach(btn => btn.addEventListener('click', () => {
      currentColorIdx = +btn.dataset.colorIdx;
      $$('#pdColors button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      $('#pdColorName').textContent = p.colors[currentColorIdx].n;
    }));
    $$('#pdSizes button').forEach(btn => btn.addEventListener('click', () => {
      currentSizeIdx = +btn.dataset.sizeIdx;
      $$('#pdSizes button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
    }));
    $$('[data-pd-qty]').forEach(btn => btn.addEventListener('click', () => {
      const el = $('#pdQtyVal');
      let val = +el.textContent + (+btn.dataset.pdQty);
      if(val < 1) val = 1;
      el.textContent = val;
    }));
    $('#pdAddToCart').addEventListener('click', () => {
      const qty = +$('#pdQtyVal').textContent;
      addToCart(p.id, p.colors[currentColorIdx].n, p.sizes[currentSizeIdx], qty);
    });
    $('#pdWishlistBtn').addEventListener('click', (e) => toggleWishlist(p.id, e.currentTarget));
    $('#pdShareBtn').addEventListener('click', () => shareProduct(p.id));
    $$('.pd-tab-btn').forEach(btn => btn.addEventListener('click', () => {
      $$('.pd-tab-btn').forEach(b=>b.classList.remove('active'));
      $$('.pd-tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      $(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    }));
    $$('.related-mini').forEach(el => el.addEventListener('click', () => openProductModal(el.dataset.related)));
  }

  /* ---------------------------------------------------------------------
     Live search overlay
  --------------------------------------------------------------------- */
  const searchOverlay = $('#searchOverlay');
  const searchInput = $('#searchInput');
  function openSearch(){ searchOverlay.classList.add('open'); document.body.style.overflow='hidden'; setTimeout(()=>searchInput.focus(), 200); }
  function closeSearch(){ searchOverlay.classList.remove('open'); document.body.style.overflow=''; }
  $$('[data-open="search"]').forEach(b => b.addEventListener('click', openSearch));
  $('#searchCloseBtn')?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', (e) => { if(e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', (e) => { if((e.key === '/' ) && document.activeElement.tagName !== 'INPUT'){ e.preventDefault(); openSearch(); } });

  searchInput?.addEventListener('input', debounce((e) => {
    const q = e.target.value.trim().toLowerCase();
    const results = $('#searchResults');
    if(!q){ results.innerHTML = ''; $('#searchHint').style.display='block'; return; }
    $('#searchHint').style.display='none';
    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0,8);
    results.innerHTML = matches.length ? matches.map(p => `
      <a href="#products" class="search-result-item" data-search-goto="${p.id}">
        <img src="${p.img}" alt="">
        <div><div>${p.name.replace(new RegExp(`(${q})`,'ig'), '<mark>$1</mark>')}</div><div style="font-size:0.75rem;color:var(--text-secondary)">${p.category} · ${fmt(p.price)}</div></div>
      </a>`).join('') : `<p class="search-hint">No watches found for "${e.target.value}".</p>`;
  }, 150));

  $('#searchResults')?.addEventListener('click', (e) => {
    const item = e.target.closest('[data-search-goto]');
    if(!item) return;
    e.preventDefault();
    closeSearch();
    searchQuery = '';
    $('#productSearchInput').value = '';
    renderProducts();
    document.querySelector('#products').scrollIntoView({behavior:'smooth'});
    setTimeout(()=> openProductModal(item.dataset.searchGoto), 400);
  });

  /* ---------------------------------------------------------------------
     Flash sale countdown
  --------------------------------------------------------------------- */
  function startCountdown(){
    const end = Date.now() + (2*24*60*60*1000) + (14*60*60*1000); // ~2 days 14 hours from load
    function tick(){
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      $('#cdDays').textContent = String(d).padStart(2,'0');
      $('#cdHours').textContent = String(h).padStart(2,'0');
      $('#cdMins').textContent = String(m).padStart(2,'0');
      $('#cdSecs').textContent = String(s).padStart(2,'0');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------------
     Features "read more"
  --------------------------------------------------------------------- */
  $$('.feature-more').forEach(btn => btn.addEventListener('click', () => {
    const card = btn.closest('.feature-card');
    card.classList.toggle('expanded');
    btn.textContent = card.classList.contains('expanded') ? 'Read less' : 'Read more';
  }));

  /* ---------------------------------------------------------------------
     About "read more"
  --------------------------------------------------------------------- */
  $('#aboutMoreBtn')?.addEventListener('click', (e) => {
    const more = $('#aboutMore');
    more.classList.toggle('open');
    e.currentTarget.textContent = more.classList.contains('open') ? 'Read less' : 'Read our full story';
  });

  /* ---------------------------------------------------------------------
     Video lightbox
  --------------------------------------------------------------------- */
  const videoModal = $('#videoModal');
  $('#videoTrigger')?.addEventListener('click', () => {
    openModal(videoModal);
    $('#atelierVideo').play().catch(()=>{});
  });
  $$('#videoModal .modal-close').forEach(b => b.addEventListener('click', () => $('#atelierVideo').pause()));

  /* ---------------------------------------------------------------------
     Testimonials carousel
  --------------------------------------------------------------------- */
  function renderTestimonials(){
    $('#testimonialTrack').innerHTML = TESTIMONIALS.map(t => `
      <div class="testimonial-slide">
        <div class="testimonial-card card">
          <div class="rating" style="justify-content:center;margin-bottom:0.8rem"><span class="stars">${ratingStars(t.rating)}</span></div>
          <p class="testimonial-quote">${t.quote}</p>
          <div class="testimonial-person">
            <img src="${t.avatar}" alt="${t.name}">
            <div style="text-align:left">
              <div class="testimonial-name">${t.name}</div>
              <div class="testimonial-role">${t.role}</div>
            </div>
          </div>
        </div>
      </div>`).join('');
    $('#carouselDots').innerHTML = TESTIMONIALS.map((_,i)=>`<button class="carousel-dot ${i===0?'active':''}" data-dot="${i}" aria-label="Go to testimonial ${i+1}"></button>`).join('');
  }
  let tIndex = 0, tTimer;
  function goToSlide(i){
    tIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    $('#testimonialTrack').style.transform = `translateX(-${tIndex*100}%)`;
    $$('.carousel-dot').forEach((d,idx)=>d.classList.toggle('active', idx===tIndex));
  }
  function startAutoplay(){ tTimer = setInterval(()=>goToSlide(tIndex+1), 5500); }
  function resetAutoplay(){ clearInterval(tTimer); startAutoplay(); }
  $('#carouselPrev')?.addEventListener('click', ()=>{ goToSlide(tIndex-1); resetAutoplay(); });
  $('#carouselNext')?.addEventListener('click', ()=>{ goToSlide(tIndex+1); resetAutoplay(); });
  $('#carouselDots')?.addEventListener('click', (e)=>{ const d = e.target.closest('[data-dot]'); if(!d) return; goToSlide(+d.dataset.dot); resetAutoplay(); });

  /* ---------------------------------------------------------------------
     Team
  --------------------------------------------------------------------- */
  const socialIcon = { linkedin:'work', instagram:'photo_camera', x:'tag', behance:'palette' };
  function renderTeam(){
    $('#teamGrid').innerHTML = TEAM.map((m,i) => `
      <article class="team-card card reveal" style="--i:${i}">
        <div class="team-photo"><img src="${m.photo}" alt="${m.name}" loading="lazy"></div>
        <div class="team-body">
          <div class="team-name">${m.name}</div>
          <div class="team-role">${m.role}</div>
          <p class="team-bio">${m.bio}</p>
          <div class="team-socials">${m.socials.map(s=>`<a href="#" onclick="return false" aria-label="${s}"><span class="material-symbols-outlined" style="font-size:1rem">${socialIcon[s]||'link'}</span></a>`).join('')}</div>
        </div>
      </article>`).join('');
    observeReveals($('#teamGrid'));
  }

  /* ---------------------------------------------------------------------
     Stats counters
  --------------------------------------------------------------------- */
  function animateCounter(el){
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    function step(now){
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting){ animateCounter(entry.target); statObserver.unobserve(entry.target); } });
  }, { threshold: 0.5 });
  $$('.stat-num').forEach(el => statObserver.observe(el));

  /* ---------------------------------------------------------------------
     Blog
  --------------------------------------------------------------------- */
  function renderBlog(){
    $('#blogGrid').innerHTML = BLOG.map((b,i) => `
      <article class="blog-card card reveal" style="--i:${i%4}" data-blog="${i}">
        <div class="blog-media"><img src="${b.img}" alt="${b.title}" loading="lazy"><span class="tag tag-limited blog-cat">${b.cat}</span></div>
        <div class="blog-body">
          <div class="blog-meta">${b.author} · ${b.date}</div>
          <h3 class="blog-title">${b.title}</h3>
          <p class="blog-excerpt">${b.excerpt}</p>
          <button class="blog-readmore" data-blog-open="${i}">Read article <span class="material-symbols-outlined" style="font-size:1em">arrow_forward</span></button>
        </div>
      </article>`).join('');
    observeReveals($('#blogGrid'));
  }
  $('#blogGrid')?.addEventListener('click', (e) => {
    const el = e.target.closest('[data-blog-open], [data-blog]');
    if(!el) return;
    const idx = +(el.dataset.blogOpen ?? el.dataset.blog);
    openArticleModal(idx);
  });
  function openArticleModal(idx){
    const b = BLOG[idx];
    $('#articleModalBody').innerHTML = `
      <span class="tag tag-limited">${b.cat}</span>
      <h3 class="pd-title">${b.title}</h3>
      <div class="blog-meta" style="margin-bottom:var(--space-md)">By ${b.author} · ${b.date}</div>
      <img class="article-hero-img" src="${b.img}" alt="${b.title}">
      <div class="article-body">${b.content.map(p=>`<p>${p}</p>`).join('')}</div>
    `;
    openModal($('#articleModal'));
  }

  /* ---------------------------------------------------------------------
     FAQ
  --------------------------------------------------------------------- */
  let faqCategory = 'All';
  function renderFaqCats(){
    const cats = ['All', ...new Set(FAQS.map(f=>f.cat))];
    $('#faqCats').innerHTML = cats.map(c=>`<button class="filter-pill ${c==='All'?'active':''}" data-faq-cat="${c}">${c}</button>`).join('');
  }
  function renderFaq(){
    const list = FAQS.filter(f => faqCategory==='All' || f.cat===faqCategory);
    $('#faqList').innerHTML = list.map((f,i) => `
      <div class="accordion-item" data-idx="${i}">
        <button class="accordion-trigger" aria-expanded="false">
          <span>${f.q}</span>
          <span class="material-symbols-outlined">add</span>
        </button>
        <div class="accordion-panel"><div class="accordion-panel-inner">${f.a}</div></div>
      </div>`).join('');
  }
  $('#faqCats')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-faq-cat]');
    if(!btn) return;
    faqCategory = btn.dataset.faqCat;
    $$('#faqCats .filter-pill').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    renderFaq();
  });
  $('#faqList')?.addEventListener('click', (e) => {
    const trigger = e.target.closest('.accordion-trigger');
    if(!trigger) return;
    const item = trigger.closest('.accordion-item');
    const panel = item.querySelector('.accordion-panel');
    const isOpen = item.classList.contains('open');
    $$('.accordion-item', $('#faqList')).forEach(it => { it.classList.remove('open'); it.querySelector('.accordion-panel').style.maxHeight = null; it.querySelector('.accordion-trigger').setAttribute('aria-expanded','false'); });
    if(!isOpen){ item.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; trigger.setAttribute('aria-expanded','true'); }
  });

  /* ---------------------------------------------------------------------
     Newsletter + Contact forms
  --------------------------------------------------------------------- */
  function handleAsyncForm(form, statusEl, successMsg){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      $$('input[required], textarea[required]', form).forEach(input => {
        const field = input.closest('.field') || input.parentElement;
        const isEmail = input.type === 'email';
        const ok = input.value.trim() !== '' && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        if(field.classList){ field.classList.toggle('has-error', !ok); field.classList.toggle('has-success', ok); }
        if(!ok) valid = false;
      });
      if(!valid){ statusEl.className = 'form-status visible'; statusEl.style.color='var(--danger)'; statusEl.innerHTML = '<span class="material-symbols-outlined">error</span> Please fill in all fields correctly.'; return; }
      statusEl.className = 'form-status visible loading';
      statusEl.innerHTML = '<span class="spinner"></span> Sending…';
      const submitBtn = form.querySelector('[type="submit"]');
      if(submitBtn) submitBtn.disabled = true;
      setTimeout(() => {
        statusEl.className = 'form-status visible success';
        statusEl.innerHTML = `<span class="material-symbols-outlined">check_circle</span> ${successMsg}`;
        if(submitBtn) submitBtn.disabled = false;
        form.reset();
        $$('.field', form).forEach(f => f.classList.remove('has-success','has-error'));
      }, 1300);
    });
  }
  handleAsyncForm($('#newsletterForm'), $('#newsletterStatus'), 'You are subscribed. Watch for our next dispatch.');
  handleAsyncForm($('#footerNewsletterForm'), $('#footerNewsletterStatus'), 'Subscribed! Check your inbox for a welcome note.');
  handleAsyncForm($('#contactForm'), $('#contactStatus'), 'Message sent. Our concierge team replies within one business day.');

  /* ---------------------------------------------------------------------
     Init
  --------------------------------------------------------------------- */
  function init(){
    renderCategories();
    renderProducts();
    renderTestimonials();
    renderTeam();
    renderBlog();
    renderFaqCats();
    renderFaq();
    renderCartBadge();
    renderWishlistBadge();
    renderCartDrawer();
    renderWishlistDrawer();
    startCountdown();
    startAutoplay();
    observeReveals(document);
    onScroll();
  }
  document.addEventListener('DOMContentLoaded', init);
})();
