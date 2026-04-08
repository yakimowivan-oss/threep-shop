// THREEP Custom JavaScript
console.log('=== THREEP SCRIPT LOADED ===');
console.log('THREEP theme loaded successfully');
console.log('Script.js loaded at:', new Date().toISOString());
console.log('Current URL:', window.location.href);
console.log('Document ready state:', document.readyState);

// WordPress compatible initialization
(function($) {
    'use strict';
    
    // Prevent double initialization
    if (window.threepInitialized) {
        console.log('THREEP already initialized, skipping');
        return;
    }
    
    // Check if jQuery is available (WordPress loads it)
    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
        console.log('jQuery not available, using vanilla JS');
        initVanillaJS();
    } else {
        console.log('jQuery available, using jQuery');
        console.log('jQuery version:', $.fn.jquery);
        initWithjQuery($);
    }
    
    // Mark as initialized
    window.threepInitialized = true;
    
    // Detect Safari browser
    function isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    
    console.log('Safari detected:', isSafari());
    
    // Scroll position variables and global popup lock state
    let savedScrollPosition = 0;
    let popupScrollLockActive = false;
    let preventTouchMoveHandler = null;
    function lockBodyScroll() {
        try {
            // Save current scroll and disable background scroll without reflow jumps
            savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
            document.documentElement.style.overscrollBehavior = 'none';
            document.body.style.overscrollBehavior = 'none';
            // iOS fix: block touchmove outside popup
            if (!preventTouchMoveHandler) {
                preventTouchMoveHandler = function(e) {
                    const popup = document.getElementById('product-popup');
                    if (!popup) return;
                    if (!popup.classList.contains('hidden')) {
                        if (!popup.contains(e.target)) {
                            e.preventDefault();
                        }
                    }
                };
                document.addEventListener('touchmove', preventTouchMoveHandler, { passive: false });
            }
            popupScrollLockActive = true;
        } catch(_) {}
    }
    function unlockBodyScroll() {
        try {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.documentElement.style.overscrollBehavior = '';
            document.body.style.overscrollBehavior = '';
            if (preventTouchMoveHandler) {
                document.removeEventListener('touchmove', preventTouchMoveHandler);
                preventTouchMoveHandler = null;
            }
            if (typeof savedScrollPosition === 'number') {
                window.scrollTo(0, savedScrollPosition);
            }
            popupScrollLockActive = false;
        } catch(_) {}
    }

    // Global guards to suppress background scroll (wheel/touch) when popup is visible (especially iOS)
    (function setupGlobalScrollGuards(){
        const suppressIfPopupOpen = (e) => {
            const popup = document.getElementById('product-popup');
            if (!popup) return;
            const isVisible = !popup.classList.contains('hidden');
            if (!isVisible) return;
            // If event originated outside popup, suppress
            if (!popup.contains(e.target)) {
                try { e.preventDefault(); } catch(_) {}
            }
        };
        document.addEventListener('wheel', suppressIfPopupOpen, { passive: false, capture: true });
        document.addEventListener('touchmove', suppressIfPopupOpen, { passive: false, capture: true });
    })();
    
    // Image loading animation function
    function addImageLoadingAnimation(img) {
        if (!img || !img.classList) return;
        img.classList.add('image-loading');
        
        img.addEventListener('load', function() {
            img.classList.remove('image-loading');
            img.classList.add('image-loaded');
        });
        
        img.addEventListener('error', function() {
            img.classList.remove('image-loading');
            img.classList.add('image-loaded');
        });
    }
    
    function initVanillaJS() {
        console.log('=== INITIALIZING VANILLA JS ===');
        console.log('Initializing with vanilla JS...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeVanillaJS);
        } else {
            initializeVanillaJS();
        }
    }
    
    function initializeVanillaJS() {
        console.log('=== DOM CONTENT LOADED ===');
        console.log('DOM loaded, initializing THREEP theme...');
        
        // Initialize header scroll effect
        initHeaderScrollEffect();
        
        // Double-check elements exist
        const popup = document.getElementById('product-popup');
        const popupClose = document.getElementById('popup-close');
        const popupTitle = document.getElementById('popup-title');
        const popupMainImage = document.getElementById('popup-main-image');
        const popupThumbnails = document.getElementById('popup-thumbnails');
        const popup360View = document.getElementById('popup-360-view');
        
        console.log('Checking elements...');
        console.log('Popup found:', !!popup);
        console.log('Popup close found:', !!popupClose);
        console.log('Popup title found:', !!popupTitle);
        console.log('Popup main image found:', !!popupMainImage);
        
        if (!popup) {
            console.error('Popup element not found! Continuing without popup.');
        }
        
        // Initialize carousels
        initCarousels();
        
        // Initialize popup system
        initPopupSystem();
        
        // Initialize dynamic buttons
        initDynamicButton();
        
        console.log('THREEP theme initialized successfully');
        
        // Force video autoplay on mobile devices
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            // Try to play video immediately
            heroVideo.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
                // If autoplay fails, try again on first user interaction
                document.addEventListener('touchstart', function() {
                    heroVideo.play().catch(function(err) {
                        console.log('Video play on touch failed:', err);
                    });
                }, { once: true });
            });
        }
    }
    
    // Initialize header scroll effect
    function initHeaderScrollEffect() {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
        if (!header || !footer) return;
        
        // Ensure header has smooth transitions for both transform and background
        header.style.transition = 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out';
        
        window.addEventListener('scroll', function() {
            // Check if footer is in viewport
            const footerRect = footer.getBoundingClientRect();
            const isFooterVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;
            
            if (isFooterVisible) {
                // Hide header when footer is visible
                header.style.transform = 'translateY(-100%)';
            } else {
                // Show header and manage background with smooth transition
                header.style.transform = 'translateY(0)';
                
                if (window.scrollY > 50) {
                    header.classList.remove('bg-transparent');
                    header.style.backgroundColor = '#A9342A';
                } else {
                    header.style.backgroundColor = 'transparent';
                    header.classList.add('bg-transparent');
                }
            }
        });
    }
    
    // Initialize carousels for vanilla JS
    function initCarousels() {
        console.log('Initializing carousels...');
        const carousels = document.querySelectorAll('.carousel-track');
        console.log('Found carousels:', carousels.length);

        function centerSlide(carouselEl, activeIndex) {
            const container = carouselEl.closest('.carousel-container');
            if (!container) return;
            // Ensure left is 0 so translateX uses track origin
            carouselEl.style.left = '0px';
            const slides = carouselEl.querySelectorAll('.carousel-slide');
            if (!slides.length) return;
            const containerWidth = container.clientWidth;
            const slideWidth = slides[0].clientWidth; // uniform width
            const offset = -(
                (activeIndex * slideWidth) - (containerWidth / 2) + (slideWidth / 2)
            );
            carouselEl.style.transform = `translateX(${Math.round(offset)}px)`;
        }

        function recenterOnResize(carouselEl) {
            const currentIndex = parseInt(carouselEl.className.match(/current-(\d+)/)?.[1] || '0');
            centerSlide(carouselEl, currentIndex);
        }

        carousels.forEach((carousel, index) => {
            const images = carousel.querySelectorAll('img');
            const slides = carousel.querySelectorAll('.carousel-slide');
            console.log(`Carousel ${index}: ${images.length} images`);

            // Initial state
            carousel.className = 'carousel-track current-0';
            // mark current on slide, not img (CSS targets .carousel-slide.current-slide img)
            slides.forEach(slide => slide.classList.remove('current-slide'));
            if (slides[0]) slides[0].classList.add('current-slide');

            // Prevent jump on init: set transform without transition first
            const prevTransition = carousel.style.transition;
            carousel.style.transition = 'none';
            centerSlide(carousel, 0);
            // Enable smooth transitions for subsequent moves
            requestAnimationFrame(() => {
                carousel.style.transition = prevTransition || 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            // Auto-rotate
            const rotate = () => {
                const currentIndex = parseInt(carousel.className.match(/current-(\d+)/)?.[1] || '0');
                const nextIndex = (currentIndex + 1) % slides.length;
                setActive(nextIndex);
            };
            let rotateTimer = setInterval(rotate, 3000);

            // Helper to set active index consistently
            function setActive(nextIndex) {
                carousel.className = `carousel-track current-${nextIndex}`;
                slides.forEach(slide => slide.classList.remove('current-slide'));
                if (slides[nextIndex]) slides[nextIndex].classList.add('current-slide');
                centerSlide(carousel, nextIndex);
                console.log(`Carousel ${index}: showing image ${nextIndex}`);
            }

            // Click on non-active slide: center it; popup only on active
            let pendingPopupIndex = null;
            slides.forEach((slide, sIdx) => {
                slide.addEventListener('click', (e) => {
                    const currentIndex = parseInt(carousel.className.match(/current-(\d+)/)?.[1] || '0');
                    if (sIdx !== currentIndex) {
                        // Prevent popup when clicking non-active: just center
                        e.stopPropagation();
                        clearInterval(rotateTimer);
                        setActive(sIdx);
                        pendingPopupIndex = null; // reset any pending
                        rotateTimer = setInterval(rotate, 3000);
                        return;
                    }
                    // If already active (centered) — allow popup.
                    // Mark intent and dispatch a custom event the existing popup logic listens to (if any)
                    pendingPopupIndex = sIdx;
                });
            });

            // Optional: listen transitionend to confirm centering completed before any external popup logic fires
            carousel.addEventListener('transitionend', (ev) => {
                if (ev.propertyName !== 'transform') return;
                // When a transition completes, if there was an intent to open popup on active click,
                // ensure the slide is still active; if so, allow subsequent click to open popup normally.
                pendingPopupIndex = null;
            });

            // Recenter on resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => recenterOnResize(carousel), 100);
            });

            // Swipe/drag support (touch + mouse)
            const container = carousel.closest('.carousel-container');
            if (container) {
                let isDragging = false;
                let startX = 0;
                let startY = 0;
                let deltaX = 0;
                const swipeThreshold = 50; // px
                let swipePreventedClick = false;

                const onStart = (clientX, clientY) => {
                    isDragging = true;
                    startX = clientX;
                    startY = clientY;
                    deltaX = 0;
                };

                const onMove = (clientX, clientY, evt) => {
                    if (!isDragging) return;
                    const dx = clientX - startX;
                    const dy = clientY - startY;
                    // If mostly horizontal, prevent vertical scroll while swiping
                    if (Math.abs(dx) > Math.abs(dy)) {
                        if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
                    }
                    deltaX = dx;
                };

                const onEnd = () => {
                    if (!isDragging) return;
                    isDragging = false;
                    if (Math.abs(deltaX) < swipeThreshold) return;
                    const currentIndex = parseInt(carousel.className.match(/current-(\d+)/)?.[1] || '0');
                    let nextIndex = currentIndex;
                    if (deltaX < 0) {
                        // swipe left -> next
                        nextIndex = Math.min(currentIndex + 1, slides.length - 1);
                    } else {
                        // swipe right -> prev
                        nextIndex = Math.max(currentIndex - 1, 0);
                    }
                    if (nextIndex !== currentIndex) {
                        clearInterval(rotateTimer);
                        setActive(nextIndex);
                        rotateTimer = setInterval(rotate, 3000);
                        // suppress click immediately after a swipe
                        swipePreventedClick = true;
                        setTimeout(() => { swipePreventedClick = false; }, 250);
                    }
                };

                // Touch events
                container.addEventListener('touchstart', (e) => {
                    const t = e.changedTouches[0];
                    onStart(t.clientX, t.clientY);
                }, { passive: true });
                container.addEventListener('touchmove', (e) => {
                    const t = e.changedTouches[0];
                    onMove(t.clientX, t.clientY, e);
                }, { passive: false });
                container.addEventListener('touchend', () => onEnd(), { passive: true });
                container.addEventListener('touchcancel', () => { isDragging = false; }, { passive: true });

                // Mouse events (desktop)
                container.addEventListener('mousedown', (e) => {
                    // Блокируем стандартный drag-select картинки на desktop
                    e.preventDefault();
                    onStart(e.clientX, e.clientY);
                });
                window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY, e));
                window.addEventListener('mouseup', onEnd);

                // Prevent click after swipe (capture to run before other handlers)
                container.addEventListener('click', (e) => {
                    if (swipePreventedClick) {
                        e.preventDefault();
                        e.stopPropagation();
                        swipePreventedClick = false;
                    }
                }, true);
            }
        });
    }
    
    // Initialize popup system for vanilla JS
    function initPopupSystem() {
        console.log('Initializing popup system...');
        
        const popup = document.getElementById('product-popup');
        const popupClose = document.getElementById('popup-close');
        const popupTitle = document.getElementById('popup-title');
        const popupMainImage = document.getElementById('popup-main-image');
        const popupThumbnails = document.getElementById('popup-thumbnails');
        const popup360View = document.getElementById('popup-360-view');
        
        console.log('Popup system initialized');
        console.log('Product images found:', document.querySelectorAll('.product-card img').length);
        console.log('Popup element:', popup);
        console.log('Popup close element:', popupClose);
        
        if (!popup || !popupClose) {
            console.error('Critical popup elements not found!');
            return;
        }
        
        // Set up click handlers for product images
        document.querySelectorAll('.product-card img').forEach((img, index) => {
            const alt = img.alt;
            console.log(`Setting up click handler for image ${index}: ${alt}`);
            
            img.addEventListener('click', function(e) {
                console.log('=== CLICK EVENT ===');
                console.log('Product image clicked:', index);
                console.log('Image alt:', alt);
                // Guard: если это картинка внутри карусели — не обрабатываем здесь, пусть обрабатывает carousel handler
                const slideEl = img.closest('.carousel-slide');
                if (slideEl) {
                    console.log('Image is in carousel, skipping product image handler');
                    return;
                }
                
                // Determine product index based on image
                let productIndex = 0;
                if (alt && alt.includes('Dredd Dolphin')) {
                    productIndex = 1;
                } else if (alt && alt.includes('Mouse Deathtrap')) {
                    productIndex = 2;
                }
                
                console.log('Products array length:', products.length);
                console.log('Product to show:', products[productIndex]);
                
                if (products[productIndex]) {
                    showProductPopup(products[productIndex]);
                } else {
                    console.log('Index out of range!');
                }
            });
        });
        
        // Set up click handlers for carousel images
        document.querySelectorAll('.carousel-slide img').forEach((img, index) => {
            const alt = img.alt;
            console.log(`Setting up carousel click handler for image ${index}: ${alt}`);
            
            img.addEventListener('click', function(e) {
                console.log('=== CAROUSEL CLICK EVENT ===');
                console.log('Carousel image clicked:', index);
                console.log('Image alt:', alt);
                console.log('Scroll position at start of carousel click:', window.pageYOffset || document.documentElement.scrollTop);
                
                // Find which carousel this image belongs to
                const carousel = img.closest('.carousel-track');
                const slideEl = img.closest('.carousel-slide');
                const slides = carousel ? carousel.querySelectorAll('.carousel-slide') : [];
                const slideIndex = slides.length ? Array.prototype.indexOf.call(slides, slideEl) : -1;
                const currentIndex = carousel ? parseInt(carousel.className.match(/current-(\d+)/)?.[1] || '0') : 0;
                // Guard: only open popup if this slide is currently active (centered)
                if (slideIndex !== -1 && slideIndex !== currentIndex) {
                    // Разрешаем всплытие до обработчика .carousel-slide для центрирования
                    return;
                }
                const carouselId = carousel.id;
                console.log('Carousel ID:', carouselId);
                
                // Determine product index based on carousel ID
                let productIndex = 0;
                if (carouselId === 'carousel-1') {
                    productIndex = 1;
                } else if (carouselId === 'carousel-2') {
                    productIndex = 2;
                }
                
                console.log('Carousel image clicked, carousel ID:', carouselId, 'product index:', productIndex);
                console.log('Calling showProductPopup from VANILLA JS carousel handler');
                currentProductIndex = productIndex;
                showProductPopup(products[productIndex]);
            });
        });
        
        // Popup close handler
        if (popupClose) {
            console.log('Setting up popup close handler');
            popupClose.addEventListener('click', function() {
                console.log('=== POPUP CLOSE CLICKED ===');
                
                // Add closing class for animation
                popup.classList.add('closing');
                
                // Wait for animation to complete, then hide
                setTimeout(() => {
                    popup.classList.remove('show', 'closing');
                    popup.classList.add('hidden');
                    
                    // Restore scroll position and remove fixed positioning
                    const scrollTop = parseInt(document.body.style.top || '0') * -1;
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    document.body.classList.remove('popup-open');
                    document.body.style.overflow = '';
                    window.scrollTo(0, scrollTop);
                    
                    console.log('Popup closed, scroll restored to:', savedScrollPosition);
                }, 150); // Match CSS transition duration
            });
        } else {
            console.log('Popup close button not found!');
        }
        
        // Product button handlers - handle all product buttons
        document.querySelectorAll('.product-button').forEach(button => {
            button.addEventListener('click', function() {
                const productIndex = parseInt(this.getAttribute('data-product')) || 0;
                console.log('Product button clicked, product index:', productIndex);
                currentProductIndex = productIndex;
                showProductPopup(products[productIndex]);
            });
        });
    }
    
    // Initialize dynamic button for vanilla JS
    function initDynamicButton() {
        console.log('Initializing dynamic button...');
        
        const buttons = [
            document.getElementById('dynamic-button'),
            document.getElementById('dynamic-button-1'),
            document.getElementById('dynamic-button-2')
        ];

        const texts = [
            'Посмотреть',
            'чекнуть',
            'чё, по чём?',
            'скок стоит?',
            'сколько денег?',
            'чё по цене?'
        ];
        
        buttons.forEach((button, index) => {
            if (!button) return;
            
            let currentText = 'Посмотреть';
            button.textContent = currentText;
            
            function changeText() {
                // Fade out and shrink
                button.style.opacity = '0.3';
                button.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    // Get random text that's different from current
                    let newText;
                    do {
                        newText = texts[Math.floor(Math.random() * texts.length)];
                    } while (newText === currentText);
                    
                    // Change text
                    button.textContent = newText;
                    currentText = newText;
                    
                    // Fade in and return to normal size
                    button.style.opacity = '1';
                    button.style.transform = 'scale(1)';
                }, 200);
            }
            
            // Change text every 2 seconds with offset to avoid sync
            setInterval(changeText, 2000 + (index * 500));
        });
    }
    
    // Products array
    const products = [
        {
            title: "Dumbrush",
            price: "5000 ₽",
            mainImage: "images/Test cart 1 cart.jpg",
            gallery: [
                "images/Test cart 1 (2).jpg",
                "images/Test cart 1 (1).jpg",
                "images/Test cart 1 (5).jpg",
                "images/Test cart 1 (4).jpg",
                "images/Test cart 1 (3).jpg"
            ],
            description: "Представим, что мы на пенной вечеринке, выжженной хлоркой. Там есть динозавр, который плюется мыльными пузырями. Рядом тусит тип в костюме коробки и крабоид, который шарит за движ."
        },
        {
            title: "Dredd Dolphin",
            price: "5000 ₽",
            mainImage: "https://readdy.ai/api/search-image?query=young%20male%20model%20wearing%20black%20graphic%20t-shirt%20with%20artistic%20design%2C%20urban%20street%20photography%2C%20moody%20lighting%2C%20contemporary%20fashion%20style%2C%20underground%20culture%20aesthetic&width=800&height=800&seq=prod002&orientation=squarish",
            gallery: [
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-1&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-2&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-3&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-4&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-5&orientation=squarish"
            ],
            description: "Не нанесение. Это след от реакции хлорки которая лишила ткань красителя. Мы не рисуем, а воруем цвет, оставляя прожжённые пятна. Из этих пятен мы собрали историю."
        },
        {
            title: "Mouse Deathtrap",
            price: "5000 ₽",
            mainImage: "https://readdy.ai/api/search-image?query=young%20male%20model%20wearing%20black%20streetwear%20t-shirt%20with%20geometric%20graphic%20design%2C%20industrial%20urban%20background%2C%20dramatic%20shadows%20and%20lighting%2C%20contemporary%20fashion%20photography%2C%20edgy%20underground%20style&width=800&height=800&seq=prod003&orientation=squarish",
            gallery: [
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-1&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-2&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-3&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-4&orientation=squarish",
                "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=gallery-5&orientation=squarish"
            ],
            description: "Хлор не красит ткань. Он её обесцвечивает, выжигая историю прямо из волокон. Так появился принт Mouse Deathtrap — мрачная сказка на ночь."
        }
    ];
    
    // Current product index for tracking
    let currentProductIndex = 0;
    
    // Lightbox functionality
    let currentLightboxIndex = 0;
    let currentImages = [];
    
    // Lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeLightbox = document.getElementById('close-lightbox');
    const prevImage = document.getElementById('prev-image');
    const nextImage = document.getElementById('next-image');
    
    // Lightbox functions
    function showLightbox() {
        if (currentImages.length === 0) return;
        
        lightboxImage.src = currentImages[currentLightboxIndex];
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentImages.length}`;
        lightbox.classList.remove('hidden');
        
        console.log('Lightbox shown with image:', currentLightboxIndex);
    }
    
    function hideLightbox() {
        lightbox.classList.add('hidden');
        console.log('Lightbox hidden');
    }
    
    function nextLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentImages.length;
        lightboxImage.src = currentImages[currentLightboxIndex];
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentImages.length}`;
        console.log('Lightbox next image:', currentLightboxIndex);
    }
    
    function prevLightboxImage() {
        currentLightboxIndex = currentLightboxIndex === 0 ? currentImages.length - 1 : currentLightboxIndex - 1;
        lightboxImage.src = currentImages[currentLightboxIndex];
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentImages.length}`;
        console.log('Lightbox prev image:', currentLightboxIndex);
    }
    
    // Lightbox event listeners
    if (closeLightbox) {
        closeLightbox.addEventListener('click', hideLightbox);
    }
    
    if (prevImage) {
        prevImage.addEventListener('click', prevLightboxImage);
    }
    
    if (nextImage) {
        nextImage.addEventListener('click', nextLightboxImage);
    }
    
    // Close lightbox on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });
    }
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox && !lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                hideLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevLightboxImage();
            } else if (e.key === 'ArrowRight') {
                nextLightboxImage();
            }
        }
    });
    
    // Size button handlers - initialize when popup opens
    function initSizeButtons() {
        const sizeButtons = document.querySelectorAll('.size-btn');
        console.log('Found size buttons:', sizeButtons.length);
        
        // Set default selection to S
        sizeButtons.forEach(button => {
            const size = button.getAttribute('data-size');
            if (size === 'S') {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
        
        sizeButtons.forEach(button => {
            // Remove existing listeners
            button.replaceWith(button.cloneNode(true));
        });
        
        // Add new listeners
        document.querySelectorAll('.size-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remove selected class from all buttons in the same popup
                const popup = this.closest('#product-popup');
                const popupSizeButtons = popup.querySelectorAll('.size-btn');
                popupSizeButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Add selected class to clicked button
                this.classList.add('selected');
                
                console.log('Size selected:', this.getAttribute('data-size'));
            });
        });
    }
    
    // Initialize size buttons on page load
    initSizeButtons();
    
    // Buy button handler
    function initBuyButton() {
        const buyButton = document.getElementById('buy-button');
        if (buyButton) {
            // Remove existing listeners
            buyButton.replaceWith(buyButton.cloneNode(true));
            
            // Add new listener
            document.getElementById('buy-button').addEventListener('click', function() {
                console.log('Buy button clicked');
                
                // Get selected size
                const popup = document.getElementById('product-popup');
                const selectedSizeButton = popup.querySelector('.size-btn.selected');
                const selectedSize = selectedSizeButton ? selectedSizeButton.getAttribute('data-size') : 'S';
                
                // Get product title
                const productTitle = document.getElementById('popup-title').textContent;
                
                // Create Telegram message
                const message = `Привет! Хочу заказать ${productTitle}, размер ${selectedSize}`;
                const telegramUrl = `https://t.me/Arasuka2H?text=${encodeURIComponent(message)}`;
                
                // Open Telegram
                window.open(telegramUrl, '_blank');
            });
        }
    }
    
    // Initialize buy button
    initBuyButton();
    
    // Get current product images for lightbox
    function getCurrentProductImages() {
        const product = products[currentProductIndex];
        console.log('getCurrentProductImages - product:', product);
        console.log('getCurrentProductImages - is360:', product.is360);
        
        if (product.is360) {
            console.log('Returning 360 frames:', product.frames360);
            return product.frames360;
        } else {
            const galleryImages = [product.mainImage, ...product.gallery];
            console.log('Returning gallery images:', galleryImages);
            return galleryImages;
        }
    }
    
    // Setup thumbnails for gallery
    function setupThumbnails(gallery) {
        console.log('setupThumbnails called with gallery:', gallery);
        const thumbnailsContainer = document.getElementById('popup-thumbnails');
        thumbnailsContainer.innerHTML = '';
        // Build thumbnails directly from currentImages to guarantee order parity with slide track
        const sourceImages = Array.isArray(currentImages) && currentImages.length ? currentImages : [products[currentProductIndex]?.mainImage, ...(gallery || [])];
        sourceImages.forEach((imageUrl, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageUrl;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.className = 'w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity';
            thumbnail.addEventListener('click', function() {
                // Move slide track to the clicked index (thumbs map 1:1 with currentImages)
                const track = document.getElementById('popup-slide-track');
                if (track && Array.isArray(currentImages) && currentImages.length) {
                    currentLightboxIndex = index;
                    const offset = -(currentLightboxIndex * (100 / currentImages.length));
                    track.style.transform = `translateX(${offset}%)`;
                    // update active thumb
                    const thumbs = document.querySelectorAll('#popup-thumbnails img');
                    thumbs.forEach(t => t.classList.remove('thumb-active'));
                    thumbnail.classList.add('thumb-active');
                } else {
                    const popupMainImage = document.getElementById('popup-main-image');
                    if (popupMainImage) popupMainImage.src = imageUrl;
                }
                console.log('Thumbnail clicked, switched to image (by absolute index):', index);
            });
            thumbnailsContainer.appendChild(thumbnail);
            console.log('Adding thumbnail:', imageUrl);
        });
        // set initial active thumbnail (index 0 corresponds to main image)
        const firstThumb = thumbnailsContainer.querySelector('img:nth-child(1)');
        if (firstThumb) firstThumb.classList.add('thumb-active');
    }
    
    // Setup 360 view slider
    function setup360View(frames) {
        const slider = document.getElementById('360-slider');
        const frameCounter = document.getElementById('360-frame-counter');
        const track = document.getElementById('popup-slide-track');
        
        if (!slider || !frameCounter || !track) return;
        
        // Build track with all frames
        track.innerHTML = '';
        frames.forEach((src) => {
            const item = document.createElement('div');
            item.className = 'slide-item';
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.className = 'w-full h-full object-cover object-center rounded';
            item.appendChild(img);
            track.appendChild(item);
        });
        track.style.width = (frames.length * 100) + '%';
        [...track.children].forEach(child => { child.style.width = (100 / frames.length) + '%'; });
        
        slider.max = frames.length - 1;
        slider.value = 0;
        frameCounter.textContent = `1 / ${frames.length}`;
        track.style.transform = 'translateX(0%)';
        
        slider.addEventListener('input', function() {
            const frameIndex = parseInt(this.value);
            const offset = -(frameIndex * (100 / frames.length));
            track.style.transform = `translateX(${offset}%)`;
            frameCounter.textContent = `${frameIndex + 1} / ${frames.length}`;
        });
    }
    
    // Show product popup
    function showProductPopup(product) {
        console.log('=== SHOW POPUP (VANILLA JS) ===');
        console.log('showProductPopup called with product:', product);
        console.log('Current scroll position before popup:', window.pageYOffset || document.documentElement.scrollTop);
        
        const popup = document.getElementById('product-popup');
        const popupTitle = document.getElementById('popup-title');
        const popupMainImage = document.getElementById('popup-main-image');
        const popupThumbnails = document.getElementById('popup-thumbnails');
        const popup360View = document.getElementById('popup-360-view');
        
        console.log('Popup element:', popup);
        console.log('Popup title element:', popupTitle);
        
        popupTitle.textContent = product.title;
        
        // Update description
        const popupDescription = document.getElementById('popup-description');
        if (popupDescription && product.description) {
            popupDescription.textContent = product.description;
        }
        
        // Build slide track with all images (main + gallery)
        const track = document.getElementById('popup-slide-track');
        currentImages = getCurrentProductImages();
        // Limit gallery to 5 images max (main + 4)
        if (Array.isArray(currentImages) && currentImages.length > 5) {
            currentImages = currentImages.slice(0, 5);
        }
        if (track && currentImages && currentImages.length) {
            track.innerHTML = '';
            currentImages.forEach((src) => {
                const item = document.createElement('div');
                item.className = 'slide-item';
                const img = document.createElement('img');
                img.src = src;
                img.alt = product.title || '';
                img.className = 'w-full h-full object-cover object-center rounded';
                item.appendChild(img);
                track.appendChild(item);
            });
            track.style.width = (currentImages.length * 100) + '%';
            [...track.children].forEach(child => { child.style.width = (100 / currentImages.length) + '%'; });
            currentLightboxIndex = 0;
            track.style.transform = 'translateX(0%)';
        }
        
        console.log('Current images set for lightbox:', currentImages);
        
        // Show/hide 360 view or thumbnails
        if (product.is360) {
            console.log('Setting up 360 view with frames:', product.frames360);
            popupThumbnails.style.display = 'none';
            popup360View.classList.remove('hidden');
            setup360View(product.frames360);
        } else {
            console.log('Setting up gallery with images:', product.gallery);
            popup360View.classList.add('hidden');
            popupThumbnails.style.display = 'grid';
            setupThumbnails(product.gallery);
        }
        
        // Initialize size buttons for this popup
        initSizeButtons();
        
        // Initialize buy button for this popup
        initBuyButton();
        
        // Save current scroll position and lock body scroll
        savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        console.log('Saved scroll position:', savedScrollPosition);
        
        console.log('Removing hidden class from popup');
        // Ensure popup scroll is at top before showing
        try { popup.style.scrollBehavior = 'auto'; } catch(_) {}
        // Prevent background scrolling and save scroll position
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentScrollTop}px`;
        document.body.style.width = '100%';
        document.body.classList.add('popup-open');
        document.body.style.overflow = 'hidden';
        
        try { popup.scrollTop = 0; } catch(_) {}
        popup.classList.remove('hidden');
        
        // Add show class for CSS transition
        setTimeout(() => {
            popup.classList.add('show');
            // After layout, force scroll to top again (handles iOS/layout delays)
            const scrollTopEnforcer = () => {
                try { popup.scrollTop = 0; } catch(_) {}
                const scrollable = popup.querySelector('.max-w-7xl');
                if (scrollable) {
                    try { scrollable.scrollTop = 0; } catch(_) {}
                }
            };
            scrollTopEnforcer();
            requestAnimationFrame(scrollTopEnforcer);
            setTimeout(scrollTopEnforcer, 50);
            setTimeout(scrollTopEnforcer, 120);
            try { popup.style.scrollBehavior = ''; } catch(_) {}
        }, 10);
        
        console.log('Popup classes after removing hidden:', popup.className);
        console.log('Popup display style:', window.getComputedStyle(popup).display);
        console.log('Popup visibility style:', window.getComputedStyle(popup).visibility);

        // Add swipe/drag navigation on popup gallery (vanilla) using slide track
        try {
            const swipeArea = document.getElementById('popup-main-wrapper');
            if (swipeArea && swipeArea.dataset.swipeBound !== '1') {
                swipeArea.dataset.swipeBound = '1';
                let isDragging = false;
                let startX = 0;
                let startY = 0;
                let deltaX = 0;
                const threshold = 40;
                let touchActive = false; // suppress synthetic mouse events after touch
                let justSwiped = false; // suppress click right after swipe

                const goTo = (idx) => {
                    const track = document.getElementById('popup-slide-track');
                    if (!track || !currentImages || !currentImages.length) return;
                    const len = currentImages.length;
                    currentLightboxIndex = (idx + len) % len;
                    const offset = -(currentLightboxIndex * (100 / len));
                    track.style.transform = `translateX(${offset}%)`;
                    // update active thumbnail highlight (1:1 mapping with currentImages)
                    const thumbsWrap = document.getElementById('popup-thumbnails');
                    if (thumbsWrap) {
                        const thumbs = thumbsWrap.querySelectorAll('img');
                        thumbs.forEach(t => t.classList.remove('thumb-active'));
                        if (thumbs[currentLightboxIndex]) thumbs[currentLightboxIndex].classList.add('thumb-active');
                    }
                };

                const onStart = (x, y, e) => {
                    isDragging = true;
                    startX = x; startY = y; deltaX = 0;
                    if (e && e.preventDefault) e.preventDefault();
                };
                const onMove = (x, y, e) => {
                    if (!isDragging) return;
                    const dx = x - startX; const dy = y - startY;
                    if (Math.abs(dx) > Math.abs(dy)) { if (e && e.preventDefault) e.preventDefault(); }
                    deltaX = dx;
                };
                const onEnd = () => {
                    if (!isDragging) return; isDragging = false;
                    if (Math.abs(deltaX) < threshold) return;
                    justSwiped = true;
                    if (deltaX < 0) {
                        goTo(currentLightboxIndex + 1);
                    } else {
                        goTo(currentLightboxIndex - 1);
                    }
                    setTimeout(() => { justSwiped = false; }, 250);
                };

                // Touch
                swipeArea.addEventListener('touchstart', (e) => { touchActive = true; const t = e.changedTouches[0]; onStart(t.clientX, t.clientY, e); }, { passive: true });
                swipeArea.addEventListener('touchmove', (e) => { const t = e.changedTouches[0]; onMove(t.clientX, t.clientY, e); }, { passive: false });
                swipeArea.addEventListener('touchend', (e) => { onEnd(); setTimeout(() => { touchActive = false; }, 300); }, { passive: true });
                swipeArea.addEventListener('touchcancel', () => { isDragging = false; setTimeout(() => { touchActive = false; }, 300); }, { passive: true });

                // Mouse
                swipeArea.addEventListener('mousedown', (e) => { if (touchActive) return; e.preventDefault(); onStart(e.clientX, e.clientY, e); });
                window.addEventListener('mousemove', (e) => { if (touchActive) return; onMove(e.clientX, e.clientY, e); });
                window.addEventListener('mouseup', () => { if (touchActive) return; onEnd(); });

                // Desktop-only click to open lightbox on main image area
                swipeArea.addEventListener('click', (e) => {
                    // skip on mobile, during/after swipe, or if no images
                    if (window.matchMedia && window.matchMedia('(max-width: 640px)').matches) return;
                    if (touchActive || isDragging || justSwiped) return;
                    if (!Array.isArray(currentImages) || currentImages.length === 0) return;
                    // open lightbox at current slide
                    if (typeof showLightbox === 'function') {
                        showLightbox();
                    }
                });
            }
        } catch(_) { }
    }
    
    // Main image click handler for lightbox with suppression after swipe
    const popupMainImage = document.getElementById('popup-main-image');
    let suppressMainImageClick = false;
    if (popupMainImage) {
        popupMainImage.addEventListener('click', function() {
            if (suppressMainImageClick) { suppressMainImageClick = false; return; }
            console.log('Main image clicked, currentImages length:', currentImages.length);
            if (currentImages.length > 0) {
                currentLightboxIndex = 0;
                showLightbox();
            } else {
                console.log('No images available for lightbox');
            }
        });
    }
    
    // jQuery version starts here
    function initWithjQuery($) {
        console.log('=== INITIALIZING WITH JQUERY ===');
        console.log('jQuery version:', $.fn.jquery);
        
        // Wait for DOM to be ready
        $(document).ready(function() {
            console.log('jQuery DOM ready, initializing THREEP theme...');
            
            // Double-check elements exist
            const popup = $('#product-popup');
            const popupClose = $('#popup-close');
            const popupTitle = $('#popup-title');
            const popupMainImage = $('#popup-main-image');
            const popupThumbnails = $('#popup-thumbnails');
            const popup360View = $('#popup-360-view');
            
            console.log('jQuery: Checking elements...');
            console.log('jQuery: Popup found:', popup.length > 0);
            console.log('jQuery: Popup close found:', popupClose.length > 0);
            console.log('jQuery: Popup title found:', popupTitle.length > 0);
            console.log('jQuery: Popup main image found:', popupMainImage.length > 0);
            
            if (popup.length === 0) {
                console.error('jQuery: Popup element not found! Continuing without popup.');
            }
            
            // Initialize header scroll effect
            initHeaderScrollEffect();
            
            // Initialize carousels
            initCarousels();
            
            // Initialize popup system
            initPopupSystem();
            
            // Initialize dynamic buttons
            initDynamicButton();
            
            console.log('jQuery: THREEP theme initialized successfully');
        });
        
        // Scroll position variable for jQuery
        let savedScrollPosition = 0;
        
        // Initialize header scroll effect for jQuery
        function initHeaderScrollEffect() {
            const header = $('header');
            const footer = $('footer');
            
            if (header.length === 0 || footer.length === 0) return;
            
            // Ensure header has smooth transitions for both transform and background
            header.css('transition', 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out');
            
            $(window).on('scroll', function() {
                // Check if footer is in viewport
                const footerRect = footer[0].getBoundingClientRect();
                const isFooterVisible = footerRect.top < window.innerHeight && footerRect.bottom > 0;
                
                if (isFooterVisible) {
                    // Hide header when footer is visible
                    header.css('transform', 'translateY(-100%)');
                } else {
                    // Show header and manage background with smooth transition
                    header.css('transform', 'translateY(0)');
                    
                    if ($(window).scrollTop() > 50) {
                        header.removeClass('bg-transparent');
                        header.css('background-color', '#A9342A');
                    } else {
                        header.css('background-color', 'transparent');
                        header.addClass('bg-transparent');
                    }
                }
            });
        }
        
        // Initialize carousels for jQuery
        function initCarousels() {
            console.log('jQuery: Initializing carousels...');
            
            const carousels = $('.carousel-track');
            console.log('jQuery: Found carousels:', carousels.length);
            
            carousels.each(function(index) {
                const carousel = $(this);
                const images = carousel.find('img');
                const slides = carousel.find('.carousel-slide');
                console.log(`jQuery: Carousel ${index}: ${images.length} images`);
                
                // Set initial state
                carousel.removeClass().addClass('carousel-track current-0');
                slides.removeClass('current-slide');
                slides.first().addClass('current-slide');
                
                // Center function
                function centerSlideJQ(activeIndex) {
                    const container = carousel.closest('.carousel-container');
                    if (!container.length || !slides.length) return;
                    carousel.css('left', '0px');
                    const containerWidth = container.innerWidth();
                    const slideWidth = slides.first().outerWidth(); // uniform width
                    const offset = -(
                        (activeIndex * slideWidth) - (containerWidth / 2) + (slideWidth / 2)
                    );
                    carousel.css('transform', `translateX(${Math.round(offset)}px)`);
                }

                // Prevent jump on init
                const prevTransition = carousel.css('transition');
                carousel.css('transition', 'none');
                centerSlideJQ(0);
                requestAnimationFrame(() => {
                    carousel.css('transition', prevTransition || 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)');
                });
                
            // Auto-rotate with helper
            function setActiveJQ(nextIndex) {
                carousel.removeClass().addClass(`carousel-track current-${nextIndex}`);
                slides.removeClass('current-slide');
                slides.eq(nextIndex).addClass('current-slide');
                centerSlideJQ(nextIndex);
                console.log(`jQuery: Carousel ${index}: showing image ${nextIndex}`);
            }
            const rotateJQ = () => {
                const currentIndex = parseInt(carousel.attr('class').match(/current-(\d+)/)?.[1] || '0');
                const nextIndex = (currentIndex + 1) % slides.length;
                setActiveJQ(nextIndex);
            };
            let rotateTimerJQ = setInterval(rotateJQ, 3000);

            // Click to center non-active slide; popup only when clicking already-active
            let pendingPopupIndexJQ = null;
            slides.each(function(sIdx) {
                $(this).on('click', function(e) {
                    const currentIndex = parseInt(carousel.attr('class').match(/current-(\d+)/)?.[1] || '0');
                    if (sIdx !== currentIndex) {
                        e.stopPropagation();
                        clearInterval(rotateTimerJQ);
                        setActiveJQ(sIdx);
                        pendingPopupIndexJQ = null;
                        rotateTimerJQ = setInterval(rotateJQ, 3000);
                        return;
                    }
                    pendingPopupIndexJQ = sIdx; // already active, allow popup
                });
            });

            carousel.on('transitionend webkitTransitionEnd oTransitionEnd', function(ev){
                if (ev.originalEvent && ev.originalEvent.propertyName && ev.originalEvent.propertyName !== 'transform') return;
                pendingPopupIndexJQ = null; // centering finished
            });

                // Recenter on resize
                let resizeTimer;
                $(window).on('resize', () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => centerSlideJQ(parseInt(carousel.attr('class').match(/current-(\d+)/)?.[1] || '0')), 100);
                });

                // Swipe/drag support (touch + mouse) for jQuery
                const container = carousel.closest('.carousel-container');
                if (container.length) {
                    let isDragging = false;
                    let startX = 0;
                    let startY = 0;
                    let deltaX = 0;
                    const swipeThreshold = 50; // px

                    const onStart = (clientX, clientY) => {
                        isDragging = true;
                        startX = clientX;
                        startY = clientY;
                        deltaX = 0;
                    };

                    const onMove = (clientX, clientY, evt) => {
                        if (!isDragging) return;
                        const dx = clientX - startX;
                        const dy = clientY - startY;
                        if (Math.abs(dx) > Math.abs(dy)) {
                            if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();
                        }
                        deltaX = dx;
                    };

                    const onEnd = () => {
                        if (!isDragging) return;
                        isDragging = false;
                        if (Math.abs(deltaX) < swipeThreshold) return;
                        const currentIndex = parseInt(carousel.attr('class').match(/current-(\d+)/)?.[1] || '0');
                        let nextIndex = currentIndex;
                        if (deltaX < 0) {
                            nextIndex = Math.min(currentIndex + 1, slides.length - 1);
                        } else {
                            nextIndex = Math.max(currentIndex - 1, 0);
                        }
                        if (nextIndex !== currentIndex) {
                            clearInterval(rotateTimerJQ);
                            setActiveJQ(nextIndex);
                            rotateTimerJQ = setInterval(rotateJQ, 3000);
                        }
                    };

                    // Touch
                    container.on('touchstart', (e) => {
                        const t = e.originalEvent.changedTouches[0];
                        onStart(t.clientX, t.clientY);
                    });
                    container.on('touchmove', (e) => {
                        const t = e.originalEvent.changedTouches[0];
                        onMove(t.clientX, t.clientY, e);
                    });
                    container.on('touchend touchcancel', () => { onEnd(); });

                    // Mouse
                    container.on('mousedown', (e) => onStart(e.clientX, e.clientY));
                    $(window).on('mousemove', (e) => onMove(e.clientX, e.clientY, e));
                    $(window).on('mouseup', onEnd);
                }
            });
        }
        
        // Initialize popup system for jQuery
        function initPopupSystem() {
            console.log('jQuery: Initializing popup system...');
            
            const popup = $('#product-popup');
            const popupClose = $('#popup-close');
            const popupTitle = $('#popup-title');
            const popupMainImage = $('#popup-main-image');
            const popupThumbnails = $('#popup-thumbnails');
            const popup360View = $('#popup-360-view');
            
            console.log('jQuery: Popup system initialized');
            console.log('jQuery: Product images found:', $('.product-card img').length);
            console.log('jQuery: Popup element:', popup[0]);
            console.log('jQuery: Popup close element:', popupClose[0]);
            
            // Set up click handlers for product images
            $('.product-card img').each(function(index) {
                const img = $(this);
                const alt = img.attr('alt');
                console.log(`jQuery: Setting up click handler for image ${index}: ${alt}`);
                
                img.on('click', function(e) {
                    console.log('=== CLICK EVENT ===');
                    console.log('jQuery: Product image clicked:', index);
                    console.log('jQuery: Image alt:', alt);
                    // Guard: если это картинка внутри карусели — не обрабатываем здесь, пусть обрабатывает carousel handler
                    const slideEl = img.closest('.carousel-slide');
                    if (slideEl.length) {
                        console.log('jQuery: Image is in carousel, skipping product image handler');
                        return;
                    }
                    
                    // Determine product index based on image
                    let productIndex = 0;
                    if (alt && alt.includes('Dredd Dolphin')) {
                        productIndex = 1;
                    } else if (alt && alt.includes('Mouse Deathtrap')) {
                        productIndex = 2;
                    }
                    
                    console.log('jQuery: Products array length:', products.length);
                    console.log('jQuery: Product to show:', products[productIndex]);
                    
                    if (products[productIndex]) {
                        showProductPopup(products[productIndex]);
                    } else {
                        console.log('jQuery: Index out of range!');
                    }
                });
            });
            
            // Set up click handlers for carousel images
            $('.carousel-slide img').each(function(index) {
                const img = $(this);
                const alt = img.attr('alt');
                console.log(`jQuery: Setting up carousel click handler for image ${index}: ${alt}`);
                
                img.on('click', function(e) {
                    console.log('=== CAROUSEL CLICK EVENT ===');
                    console.log('jQuery: Carousel image clicked:', index);
                    console.log('jQuery: Image alt:', alt);
                    console.log('jQuery: Scroll position at start of carousel click:', $(window).scrollTop());
                    
                    // Find which carousel this image belongs to
                    const carousel = img.closest('.carousel-track');
                    const carouselId = carousel.attr('id');
                    console.log('jQuery: Carousel ID:', carouselId);
                    // Guard: only open popup if this slide is currently active
                    const slideEl = img.closest('.carousel-slide');
                    const slides = carousel.find('.carousel-slide');
                    const slideIndex = slides.index(slideEl);
                    const currentIndex = parseInt(carousel.attr('class').match(/current-(\d+)/)?.[1] || '0');
                    if (slideIndex !== -1 && slideIndex !== currentIndex) {
                        // Allow event to bubble to .carousel-slide click handler for centering
                        return;
                    }
                    
                    // Determine product index based on carousel ID
                    let productIndex = 0;
                    if (carouselId === 'carousel-1') {
                        productIndex = 1;
                    } else if (carouselId === 'carousel-2') {
                        productIndex = 2;
                    }
                    
                    console.log('jQuery: Carousel image clicked, carousel ID:', carouselId, 'product index:', productIndex);
                    console.log('jQuery: Calling showProductPopup from JQUERY carousel handler');
                    currentProductIndex = productIndex;
                    showProductPopup(products[productIndex]);
                });
            });
            
            // Popup close handler
            popupClose.on('click', function() {
                // Add closing class for animation
                popup.addClass('closing');
                
                // Wait for animation to complete, then hide
                setTimeout(() => {
                    popup.removeClass('show closing');
                    popup.addClass('hidden');
                    
                    // Restore scroll position and remove fixed positioning
                    const scrollTop = parseInt($('body').css('top') || '0') * -1;
                    $('body').css({
                        'position': '',
                        'top': '',
                        'width': '',
                        'overflow': ''
                    }).removeClass('popup-open');
                    $(window).scrollTop(scrollTop);
                    
                    console.log('jQuery: Popup closed, scroll restored to:', savedScrollPosition);
                }, 150); // Match CSS transition duration
            });
            
            // Product button handlers - handle all product buttons
            $('.product-button').on('click', function() {
                const productIndex = parseInt($(this).attr('data-product')) || 0;
                console.log('jQuery: Product button clicked, product index:', productIndex);
                currentProductIndex = productIndex;
                showProductPopup(products[productIndex]);
            });
        }
        
        // Initialize dynamic button for jQuery
        function initDynamicButton() {
            console.log('jQuery: Initializing dynamic button...');
            
            const buttons = [
                $('#dynamic-button'),
                $('#dynamic-button-1'),
                $('#dynamic-button-2')
            ];

            const texts = [
                'Посмотреть',
                'чекнуть',
                'чё, по чём?',
                'скок стоит?',
                'сколько денег?',
                'чё по цене?'
            ];
            
            buttons.forEach((button, index) => {
                if (button.length === 0) return;
                
                let currentText = 'Посмотреть';
                button.text(currentText);
                
                function changeText() {
                    // Fade out and shrink
                    button.css({
                        'opacity': '0.3',
                        'transform': 'scale(0.95)'
                    });
                    
                    setTimeout(() => {
                        // Get random text that's different from current
                        let newText;
                        do {
                            newText = texts[Math.floor(Math.random() * texts.length)];
                        } while (newText === currentText);
                        
                        // Change text
                        button.text(newText);
                        currentText = newText;
                        
                        // Fade in and return to normal size
                        button.css({
                            'opacity': '1',
                            'transform': 'scale(1)'
                        });
                    }, 200);
                }
                
                // Change text every 2 seconds with offset to avoid sync
                setInterval(changeText, 2000 + (index * 500));
            });
        }
        
        // Image loading animation function for jQuery
        function addImageLoadingAnimation(img) {
            $(img).addClass('image-loading');
            
            $(img).on('load', function() {
                $(this).removeClass('image-loading').addClass('image-loaded');
            });
            
            $(img).on('error', function() {
                $(this).removeClass('image-loading').addClass('image-loaded');
            });
        }
        
        // Get current product images for lightbox
        function getCurrentProductImages() {
            const product = products[currentProductIndex];
            console.log('jQuery: getCurrentProductImages - product:', product);
            console.log('jQuery: getCurrentProductImages - is360:', product.is360);
            
            if (product.is360) {
                console.log('jQuery: Returning 360 frames:', product.frames360);
                return product.frames360;
            } else {
                const galleryImages = [product.mainImage, ...product.gallery];
                console.log('jQuery: Returning gallery images:', galleryImages);
                return galleryImages;
            }
        }
        
        // Setup thumbnails for gallery (move slide track)
        function setupThumbnails(gallery) {
            console.log('jQuery: setupThumbnails called with gallery:', gallery);
            const thumbnailsContainer = $('#popup-thumbnails');
            thumbnailsContainer.empty();
            // Build from currentImages to match slide-track order
            const sourceImages = Array.isArray(currentImages) && currentImages.length ? currentImages : [products[currentProductIndex]?.mainImage, ...(gallery || [])];
            sourceImages.forEach((imageUrl, index) => {
                const thumbnail = $('<img>')
                    .attr('src', imageUrl)
                    .attr('alt', `Thumbnail ${index + 1}`)
                    .addClass('w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity')
                    .on('click', function() {
                        const track = $('#popup-slide-track');
                        if (Array.isArray(currentImages) && currentImages.length && track.length) {
                            currentLightboxIndex = index; // thumbnails map 1:1 with currentImages
                            const offset = -(currentLightboxIndex * (100 / currentImages.length));
                            track.css('transform', `translateX(${offset}%)`);
                            // update active state
                            thumbnailsContainer.find('img').removeClass('thumb-active');
                            $(this).addClass('thumb-active');
                        }
                        console.log('jQuery: Thumbnail clicked, switched to absolute image index:', index);
                    });
                thumbnailsContainer.append(thumbnail);
                console.log('jQuery: Adding thumbnail:', imageUrl);
            });
            // initial active thumb (main image index 0)
            thumbnailsContainer.find('img').eq(0).addClass('thumb-active');
        }
        
        // Setup 360 view slider
        function setup360View(frames) {
            const slider = $("#360-slider");
            const frameCounter = $("#360-frame-counter");
            const popupMainImage = $("#popup-main-image");
            
            slider.attr('max', frames.length - 1);
            slider.val(0);
            frameCounter.text(`1 / ${frames.length}`);
            popupMainImage.attr('src', frames[0]);
            
            slider.on('input', function() {
                const frameIndex = parseInt($(this).val());
                popupMainImage.attr('src', frames[frameIndex]);
                frameCounter.text(`${frameIndex + 1} / ${frames.length}`);
            });
        }
        
        // Show product popup
        function showProductPopup(product) {
            console.log('=== SHOW POPUP (JQUERY) ===');
            console.log('jQuery: showProductPopup called with product:', product);
            console.log('jQuery: Current scroll position before popup:', $(window).scrollTop());
            
            const popup = $('#product-popup');
            const popupTitle = $('#popup-title');
            const popupThumbnails = $('#popup-thumbnails');
            const popup360View = $('#popup-360-view');
            
            console.log('jQuery: Popup element:', popup[0]);
            console.log('jQuery: Popup title element:', popupTitle[0]);
            
            popupTitle.text(product.title);
            
            // Update description
            const popupDescription = $('#popup-description');
            if (popupDescription.length && product.description) {
                popupDescription.text(product.description);
            }
            
            // Build slide track with all images (main + gallery)
            const track = $('#popup-slide-track');
            currentImages = getCurrentProductImages();
            if (Array.isArray(currentImages) && currentImages.length > 5) {
                currentImages = currentImages.slice(0, 5);
            }
            console.log('jQuery: Current images set for lightbox:', currentImages);
            if (track.length && currentImages && currentImages.length) {
                track.empty();
                currentImages.forEach((src) => {
                    const item = $('<div>').addClass('slide-item');
                    const img = $('<img>')
                        .attr('src', src)
                        .attr('alt', product.title || '')
                        .addClass('w-full h-full object-cover object-center rounded');
                    item.append(img);
                    track.append(item);
                });
                track.css('width', (currentImages.length * 100) + '%');
                track.children().each(function(){ $(this).css('width', (100 / currentImages.length) + '%'); });
                currentLightboxIndex = 0;
                track.css('transform', 'translateX(0%)');
            }
            
            // Show/hide 360 view or thumbnails
            if (product.is360) {
                console.log('jQuery: Setting up 360 view with frames:', product.frames360);
                popupThumbnails.hide();
                popup360View.removeClass('hidden');
                // Build track for 360 frames too
                const track = $('#popup-slide-track');
                if (track.length) {
                    track.empty();
                    product.frames360.forEach((src) => {
                        const item = $('<div>').addClass('slide-item');
                        const img = $('<img>').attr('src', src).attr('alt', '').addClass('w-full h-full object-cover object-center rounded');
                        item.append(img);
                        track.append(item);
                    });
                    track.css('width', (product.frames360.length * 100) + '%');
                    track.children().each(function(){ $(this).css('width', (100 / product.frames360.length) + '%'); });
                    currentLightboxIndex = 0;
                    track.css('transform', 'translateX(0%)');
                }
                setup360View(product.frames360);
            } else {
                console.log('jQuery: Setting up gallery with images:', product.gallery);
                popup360View.addClass('hidden');
                popupThumbnails.show();
                setupThumbnails(product.gallery);
            }
            
            // Initialize size buttons for this popup
            initSizeButtonsJQ();
            
            // Initialize buy button for this popup
            initBuyButtonJQ();
            
            // Save current scroll position and prevent background scrolling
            const currentScrollTop = $(window).scrollTop();
            savedScrollPosition = currentScrollTop;
            console.log('jQuery: Saved scroll position:', savedScrollPosition);
            
            // Ensure popup scroll is at top before showing
            $('body').css({
                'position': 'fixed',
                'top': `-${currentScrollTop}px`,
                'width': '100%',
                'overflow': 'hidden'
            }).addClass('popup-open');
            
            try { popup[0].scrollTop = 0; } catch(_) {}
            popup.removeClass('hidden');
            
            // Add show class for CSS transition
            setTimeout(() => {
                popup.addClass('show');
                // After layout, force scroll to top again (iOS safety)
                try { popup[0].scrollTop = 0; } catch(_) {}
                requestAnimationFrame(() => { try { popup[0].scrollTop = 0; } catch(_) {} });
                // Also ensure inner scrollable area starts at top
                const scrollable = popup.find('.max-w-7xl')[0];
                if (scrollable) {
                    try { scrollable.scrollTop = 0; } catch(_) {}
                    requestAnimationFrame(() => { try { scrollable.scrollTop = 0; } catch(_) {} });
                }
            }, 10);

            // Swipe/drag navigation on popup gallery (jQuery) using slide track
            try {
                const swipeArea = $('#popup-main-wrapper');
                const track = $('#popup-slide-track');
                if (swipeArea.length && track.length && swipeArea.data('swipeBound') !== 1) {
                    swipeArea.data('swipeBound', 1);
                    let isDragging = false;
                    let startX = 0;
                    let startY = 0;
                    let deltaX = 0;
                    const threshold = 40;
                    let touchActive = false; // suppress synthetic mouse after touch
                    let justSwiped = false;  // suppress click right after swipe

                    const goTo = (idx) => {
                        if (!Array.isArray(currentImages) || !currentImages.length) return;
                        const len = currentImages.length;
                        currentLightboxIndex = (idx + len) % len;
                        const offset = -(currentLightboxIndex * (100 / len));
                        track.css('transform', `translateX(${offset}%)`);
                        // update active thumbnail highlight (1:1 mapping)
                        const thumbs = $('#popup-thumbnails img');
                        thumbs.removeClass('thumb-active');
                        thumbs.eq(currentLightboxIndex).addClass('thumb-active');
                    };

                    const onStart = (x, y, e) => { isDragging = true; startX = x; startY = y; deltaX = 0; if (e && e.preventDefault) e.preventDefault(); };
                    const onMove = (x, y, e) => { if (!isDragging) return; const dx = x - startX; const dy = y - startY; if (Math.abs(dx) > Math.abs(dy)) { if (e && e.preventDefault) e.preventDefault(); } deltaX = dx; };
                    const onEnd = () => { if (!isDragging) return; isDragging = false; if (Math.abs(deltaX) < threshold) return; justSwiped = true; if (deltaX < 0) { goTo(currentLightboxIndex + 1); } else { goTo(currentLightboxIndex - 1); } setTimeout(() => { justSwiped = false; }, 250); };

                    // Touch
                    swipeArea.on('touchstart', (e) => { touchActive = true; const t = e.originalEvent.changedTouches[0]; onStart(t.clientX, t.clientY, e); });
                    swipeArea.on('touchmove', (e) => { const t = e.originalEvent.changedTouches[0]; onMove(t.clientX, t.clientY, e); });
                    swipeArea.on('touchend touchcancel', () => { onEnd(); setTimeout(() => { touchActive = false; }, 300); });
                    // Mouse
                    swipeArea.on('mousedown', (e) => { if (touchActive) return; e.preventDefault(); onStart(e.clientX, e.clientY, e); });
                    $(window).on('mousemove', (e) => { if (touchActive) return; onMove(e.clientX, e.clientY, e); });
                    $(window).on('mouseup', () => { if (touchActive) return; onEnd(); });

                    // Desktop-only click to open lightbox
                    swipeArea.on('click', (e) => {
                        if (window.matchMedia && window.matchMedia('(max-width: 640px)').matches) return;
                        if (touchActive || isDragging || justSwiped) return;
                        if (!Array.isArray(currentImages) || !currentImages.length) return;
                        if (typeof showLightbox === 'function') { showLightbox(); }
                    });
                }
            } catch(_) {}
        }
        
        // Main image click handler for lightbox
        $('#popup-main-image').on('click', function() {
            console.log('jQuery: Main image clicked, currentImages length:', currentImages.length);
            if (currentImages.length > 0) {
                currentLightboxIndex = 0;
                showLightbox();
            } else {
                console.log('jQuery: No images available for lightbox');
            }
        });
        
        // Lightbox functionality for jQuery
        let currentLightboxIndex = 0;
        let currentImages = [];
        
        // Lightbox elements
        const lightbox = $('#lightbox');
        const lightboxImage = $('#lightbox-image');
        const lightboxCounter = $('#lightbox-counter');
        const closeLightbox = $('#close-lightbox');
        const prevImage = $('#prev-image');
        const nextImage = $('#next-image');
        
        // Lightbox functions
        function showLightbox() {
            if (currentImages.length === 0) return;
            
            lightboxImage.attr('src', currentImages[currentLightboxIndex]);
            lightboxCounter.text(`${currentLightboxIndex + 1} / ${currentImages.length}`);
            lightbox.removeClass('hidden');
            
            console.log('jQuery: Lightbox shown with image:', currentLightboxIndex);
        }
        
        function hideLightbox() {
            lightbox.addClass('hidden');
            console.log('jQuery: Lightbox hidden');
        }
        
        function nextLightboxImage() {
            currentLightboxIndex = (currentLightboxIndex + 1) % currentImages.length;
            lightboxImage.attr('src', currentImages[currentLightboxIndex]);
            lightboxCounter.text(`${currentLightboxIndex + 1} / ${currentImages.length}`);
            console.log('jQuery: Lightbox next image:', currentLightboxIndex);
        }
        
        function prevLightboxImage() {
            currentLightboxIndex = currentLightboxIndex === 0 ? currentImages.length - 1 : currentLightboxIndex - 1;
            lightboxImage.attr('src', currentImages[currentLightboxIndex]);
            lightboxCounter.text(`${currentLightboxIndex + 1} / ${currentImages.length}`);
            console.log('jQuery: Lightbox prev image:', currentLightboxIndex);
        }
        
        // Lightbox event listeners
        closeLightbox.on('click', hideLightbox);
        prevImage.on('click', prevLightboxImage);
        nextImage.on('click', nextLightboxImage);
        
        // Close lightbox on background click
        lightbox.on('click', function(e) {
            if (e.target === lightbox[0]) {
                hideLightbox();
            }
        });
        
        // Keyboard navigation for lightbox
        $(document).on('keydown', function(e) {
            if (lightbox.length && !lightbox.hasClass('hidden')) {
                if (e.key === 'Escape') {
                    hideLightbox();
                } else if (e.key === 'ArrowLeft') {
                    prevLightboxImage();
                } else if (e.key === 'ArrowRight') {
                    nextLightboxImage();
                }
            }
        });
        
        // Size button handlers - initialize when popup opens
        function initSizeButtonsJQ() {
            const sizeButtonsJQ = $('.size-btn');
            console.log('jQuery: Found size buttons:', sizeButtonsJQ.length);
            
            // Set default selection to S
            sizeButtonsJQ.each(function() {
                const size = $(this).attr('data-size');
                if (size === 'S') {
                    $(this).addClass('selected');
                } else {
                    $(this).removeClass('selected');
                }
            });
            
            // Remove existing listeners and add new ones
            $('.size-btn').off('click').on('click', function() {
                // Remove selected class from all buttons in the same popup
                const popup = $(this).closest('#product-popup');
                popup.find('.size-btn').removeClass('selected');
                
                // Add selected class to clicked button
                $(this).addClass('selected');
                
                console.log('jQuery: Size selected:', $(this).attr('data-size'));
            });
        }
        
        // Initialize size buttons on page load
        initSizeButtonsJQ();
        
        // Buy button handler
        function initBuyButtonJQ() {
            $('#buy-button').off('click').on('click', function() {
                console.log('jQuery: Buy button clicked');
                
                // Get selected size
                const popup = $('#product-popup');
                const selectedSizeButton = popup.find('.size-btn.selected');
                const selectedSize = selectedSizeButton.length ? selectedSizeButton.attr('data-size') : 'S';
                
                // Get product title
                const productTitle = $('#popup-title').text();
                
                // Create Telegram message
                const message = `Привет! Хочу заказать ${productTitle}, размер ${selectedSize}`;
                const telegramUrl = `https://t.me/Arasuka2H?text=${encodeURIComponent(message)}`;
                
                // Open Telegram
                window.open(telegramUrl, '_blank');
            });
        }
        
        // Initialize buy button
        initBuyButtonJQ();
    }
    
    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('=== SCRIPT LOADED ===');
        console.log('Script file loaded successfully');
        console.log('Current time:', new Date().toISOString());
        
        // Check if jQuery is available
        if (typeof $ !== 'undefined' && typeof jQuery !== 'undefined') {
            console.log('jQuery available, using jQuery version');
        } else {
            console.log('jQuery not available, using vanilla JS version');
        }
        
        console.log('Script ready for initialization');
    });
    
})(typeof jQuery !== 'undefined' ? jQuery : null);