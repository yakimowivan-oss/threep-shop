// THREEP Custom JavaScript
console.log('=== THREEP SCRIPT LOADED ===');
console.log('THREEP theme loaded successfully');
console.log('Script.js loaded at:', new Date().toISOString());
console.log('Current URL:', window.location.href);
console.log('Document ready state:', document.readyState);

// WordPress compatible initialization
(function($) {
    'use strict';
    
    // Check if jQuery is available (WordPress loads it)
    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
        console.log('jQuery not available, using vanilla JS');
        initVanillaJS();
    } else {
        console.log('jQuery available, using jQuery');
        console.log('jQuery version:', $.fn.jquery);
        initWithjQuery($);
    }
    
    // Detect Safari browser
    function isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    
    console.log('Safari detected:', isSafari());
    
    // Scroll position variables
    let savedScrollPosition = 0;
    
    // Image loading animation function
    function addImageLoadingAnimation(img) {
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
        console.log('Initializing with vanilla JS...');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded, initializing THREEP theme...');
            
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
            
            // Product interactions
            const productImages = document.querySelectorAll(".product-card img");
            const popup = document.getElementById("product-popup");
            const popupClose = document.getElementById("popup-close");
            const popupMainImage = document.getElementById("popup-main-image");
            const popupTitle = document.getElementById("popup-title");
            const popupThumbnails = document.getElementById("popup-thumbnails");
            const popup360View = document.getElementById("popup-360-view");
            const buyButton = document.getElementById("buy-button");
            
            // Lightbox elements
            const lightbox = document.getElementById("lightbox");
            const closeLightbox = document.getElementById("close-lightbox");
            const lightboxImage = document.getElementById("lightbox-image");
            const prevImage = document.getElementById("prev-image");
            const nextImage = document.getElementById("next-image");
            const lightboxCounter = document.getElementById("lightbox-counter");
            
            // Product data
            const products = [
                {
                           title: "Mouse Deathtrap",
                           price: "5000 ₽",
                    mainImage: "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-cart.jpg",
                    gallery: [
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-2-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-1-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-5-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-4-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-3-scaled.jpg"
                    ]
                },
                {
                    title: "Dredd Dolphin",
                           price: "5000 ₽",
                    mainImage: "https://readdy.ai/api/search-image?query=young%20male%20model%20wearing%20black%20graphic%20t-shirt%20with%20artistic%20design%2C%20urban%20street%20photography%2C%20moody%20lighting%20with%20red%20accents%2C%20contemporary%20fashion%20style%2C%20underground%20culture%20aesthetic&width=800&height=800&seq=prod002&orientation=squarish",
                    is360: true,
                    frames360: [
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-1-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-2-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-3-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-4-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-5-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-6-scaled.jpg",
                        "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=360-7&orientation=squarish",
                        "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=360-8&orientation=squarish"
                    ]
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
                    ]
                }
            ];
            
            let currentProductIndex = 0;
            let currentLightboxIndex = 0;
            let currentImages = [];
            
            // Product click handlers
            console.log('Setting up product click handlers for', productImages.length, 'images');
            productImages.forEach((img, index) => {
                img.addEventListener('click', function() {
                    console.log('Product image clicked:', index);
                    currentProductIndex = index;
                    showProductPopup(products[index]);
                });
            });
            
            // Popup close handler
            popupClose.addEventListener('click', function() {
                popup.classList.add('hidden');
                // Restore body scroll
                document.body.classList.remove('popup-open');
                // Restore scroll position
                window.scrollTo(0, savedScrollPosition);
            });
            
            // Size selector elements
            const sizeButtons = document.querySelectorAll('.size-btn');
            
            let selectedSizeValue = null;
            
            // Size button selection
            sizeButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const size = this.getAttribute('data-size');
                    selectedSizeValue = size;
                    
                    // Remove selected class from all buttons
                    sizeButtons.forEach(btn => btn.classList.remove('selected'));
                    // Add selected class to clicked button
                    this.classList.add('selected');
                });
                
                // Safari-specific touch handling
                if (isSafari()) {
                    // Use touchend for Safari
                    button.addEventListener('touchend', function(e) {
                        console.log('Size button touchend (Safari):', this.getAttribute('data-size'));
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const size = this.getAttribute('data-size');
                        selectedSizeValue = size;
                        
                        // Remove selected class from all buttons
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        // Add selected class to this button
                        this.classList.add('selected');
                        
                        console.log('Selected size (Safari touchend):', selectedSizeValue);
                    }, { passive: false });
                } else {
                    // Use touchend for other browsers
                    button.addEventListener('touchend', function(e) {
                        console.log('Size button touchend:', this.getAttribute('data-size'));
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const size = this.getAttribute('data-size');
                        selectedSizeValue = size;
                        
                        // Remove selected class from all buttons
                        sizeButtons.forEach(btn => btn.classList.remove('selected'));
                        // Add selected class to this button
                        this.classList.add('selected');
                        
                        console.log('Selected size (touchend):', selectedSizeValue);
                    }, { passive: false });
                }
            });
            
            // Set default selection (S button)
            if (sizeButtons.length > 0) {
                sizeButtons[0].classList.add('selected');
                selectedSizeValue = sizeButtons[0].getAttribute('data-size');
            }
            
            // Buy button handler
            buyButton.addEventListener('click', function() {
                const product = products[currentProductIndex];
                let message = `Хочу заказать ${product.title}`;
                
                if (selectedSizeValue) {
                    message += `, размер: ${selectedSizeValue}`;
                }
                
                const telegramUrl = `https://t.me/Arasuka2H?text=${encodeURIComponent(message)}`;
                window.open(telegramUrl, '_blank');
            });
            
            // Lightbox handlers
            closeLightbox.addEventListener('click', function() {
                lightbox.classList.add('hidden');
            });
            
            prevImage.addEventListener('click', function() {
                currentLightboxIndex = (currentLightboxIndex - 1 + currentImages.length) % currentImages.length;
                updateLightboxImage();
            });
            
            nextImage.addEventListener('click', function() {
                currentLightboxIndex = (currentLightboxIndex + 1) % currentImages.length;
                updateLightboxImage();
            });
            
            // Main image click handler for lightbox
            popupMainImage.addEventListener('click', function() {
                console.log('Main image clicked, currentImages length:', currentImages.length);
                if (currentImages.length > 0) {
                    currentLightboxIndex = 0;
                    showLightbox();
                } else {
                    console.log('No images available for lightbox');
                }
            });
            
            function showProductPopup(product) {
                console.log('showProductPopup called with product:', product);
                popupTitle.textContent = product.title;
                
                // Add loading animation to main image
                addImageLoadingAnimation(popupMainImage);
                popupMainImage.src = product.mainImage;
                popupMainImage.alt = product.title;
                
                // Set current images for lightbox
                currentImages = getCurrentProductImages();
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
                
                // Save current scroll position
                savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                popup.classList.remove('hidden');
                // Lock body scroll
                document.body.classList.add('popup-open');
            }
            
            function setup360View(frames) {
                const slider = document.getElementById('360-slider');
                const frameCounter = document.getElementById('360-frame-counter');
                
                slider.addEventListener('input', function() {
                    const frameIndex = parseInt(this.value);
                    popupMainImage.src = frames[frameIndex];
                    frameCounter.textContent = `${frameIndex + 1} / ${frames.length}`;
                });
                
                // Set initial frame
                popupMainImage.src = frames[0];
                frameCounter.textContent = `1 / ${frames.length}`;
            }
            
            function setupThumbnails(gallery) {
                console.log('setupThumbnails called with gallery:', gallery);
                popupThumbnails.innerHTML = '';
                gallery.forEach((src, index) => {
                    console.log('Adding thumbnail:', src);
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = `Thumbnail ${index + 1}`;
                    img.className = 'w-full aspect-square object-cover rounded cursor-pointer hover:opacity-75 transition-opacity';
                    img.addEventListener('click', function() {
                        // Add loading animation to main image
                        popupMainImage.classList.add('image-loading');
                        popupMainImage.src = src;
                        
                        // Add fade effect when image loads
                        popupMainImage.addEventListener('load', function() {
                            popupMainImage.classList.remove('image-loading');
                            popupMainImage.classList.add('image-loaded');
                        }, { once: true });
                    });
                    
                    // Add loading animation
                    addImageLoadingAnimation(img);
                    
                    popupThumbnails.appendChild(img);
                });
            }
            
            function showLightbox() {
                console.log('showLightbox called, currentImages length:', currentImages.length);
                if (currentImages.length > 0) {
                    // Add loading animation to lightbox image
                    addImageLoadingAnimation(lightboxImage);
                    lightboxImage.src = currentImages[currentLightboxIndex];
                    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentImages.length}`;
                    lightbox.classList.remove('hidden');
                    console.log('Lightbox shown with image:', currentImages[currentLightboxIndex]);
                } else {
                    console.log('No images available for lightbox');
                }
            }
            
            function updateLightboxImage() {
                // Add loading animation to lightbox image
                addImageLoadingAnimation(lightboxImage);
                lightboxImage.src = currentImages[currentLightboxIndex];
                lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentImages.length}`;
            }
            
            function getCurrentProductImages() {
                const product = products[currentProductIndex];
                console.log('getCurrentProductImages - product:', product);
                console.log('getCurrentProductImages - is360:', product.is360);
                if (product.is360) {
                    console.log('Returning 360 frames:', product.frames360);
                    return product.frames360;
                } else {
                    const images = [product.mainImage, ...product.gallery];
                    console.log('Returning gallery images:', images);
                    return images;
                }
            }
        });
    }
    
    function initWithjQuery($) {
        console.log('Initializing with jQuery...');
        
        // Scroll position variable for jQuery
        let savedScrollPosition = 0;
        
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
        
        $(document).ready(function() {
            console.log('jQuery DOM ready, initializing THREEP theme...');
            
            // Force video autoplay on mobile devices
            const heroVideo = $('.hero-video')[0];
            if (heroVideo) {
                // Try to play video immediately
                heroVideo.play().catch(function(error) {
                    console.log('jQuery: Video autoplay failed:', error);
                    // If autoplay fails, try again on first user interaction
                    $(document).one('touchstart', function() {
                        heroVideo.play().catch(function(err) {
                            console.log('jQuery: Video play on touch failed:', err);
                        });
                    });
                });
            }
            
            // Product interactions
            const productImages = $(".product-card img");
            const popup = $("#product-popup");
            const popupClose = $("#popup-close");
            const popupMainImage = $("#popup-main-image");
            const popupTitle = $("#popup-title");
            const popupThumbnails = $("#popup-thumbnails");
            const popup360View = $("#popup-360-view");
            const buyButton = $("#buy-button");
            
            // Lightbox elements
            const lightbox = $("#lightbox");
            const closeLightbox = $("#close-lightbox");
            const lightboxImage = $("#lightbox-image");
            const prevImage = $("#prev-image");
            const nextImage = $("#next-image");
            const lightboxCounter = $("#lightbox-counter");
            
            // Product data
            const products = [
                {
                           title: "Mouse Deathtrap",
                           price: "5000 ₽",
                    mainImage: "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-cart.jpg",
                    gallery: [
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-2-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-1-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-5-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-4-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-3-scaled.jpg"
                    ]
                },
                {
                    title: "Dredd Dolphin",
                           price: "5000 ₽",
                    mainImage: "https://readdy.ai/api/search-image?query=young%20male%20model%20wearing%20black%20graphic%20t-shirt%20with%20artistic%20design%2C%20urban%20street%20photography%2C%20moody%20lighting%20with%20red%20accents%2C%20contemporary%20fashion%20style%2C%20underground%20culture%20aesthetic&width=800&height=800&seq=prod002&orientation=squarish",
                    is360: true,
                    frames360: [
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-1-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-2-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-3-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-4-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-5-scaled.jpg",
                        "http://3threep.ru/wp-content/uploads/2025/10/360-test-6-scaled.jpg",
                        "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=360-7&orientation=squarish",
                        "https://readdy.ai/api/search-image?query=placeholder&width=800&height=800&seq=360-8&orientation=squarish"
                    ]
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
                    ]
                }
            ];
            
            let currentProductIndex = 0;
            let currentLightboxIndex = 0;
            let currentImages = [];
            
            // Product click handlers
            productImages.on('click', function() {
                const index = productImages.index(this);
                console.log('Product image clicked:', index);
                currentProductIndex = index;
                showProductPopup(products[index]);
            });
            
            // Popup close handler
            popupClose.on('click', function() {
                popup.addClass('hidden');
                // Restore body scroll
                $('body').removeClass('popup-open');
                // Restore scroll position
                $(window).scrollTop(savedScrollPosition);
            });
            
            // Size selector elements
            const sizeButtons = $('.size-btn');
            
            let selectedSizeValue = null;
            
            // Size button selection
            sizeButtons.on('click', function(e) {
                e.stopPropagation();
                const size = $(this).attr('data-size');
                selectedSizeValue = size;
                
                // Remove selected class from all buttons
                sizeButtons.removeClass('selected');
                // Add selected class to clicked button
                $(this).addClass('selected');
            });
            
            // Safari-specific touch handling
            if (isSafari()) {
                // Use touchend for Safari
                sizeButtons.on('touchend', function(e) {
                    console.log('Size button touchend (Safari):', $(this).attr('data-size'));
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const size = $(this).attr('data-size');
                    selectedSizeValue = size;
                    
                    // Remove selected class from all buttons
                    sizeButtons.removeClass('selected');
                    // Add selected class to this button
                    $(this).addClass('selected');
                    
                    console.log('Selected size (Safari touchend):', selectedSizeValue);
                });
            } else {
                // Use touchend for other browsers
                sizeButtons.on('touchend', function(e) {
                    console.log('Size button touchend:', $(this).attr('data-size'));
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const size = $(this).attr('data-size');
                    selectedSizeValue = size;
                    
                    // Remove selected class from all buttons
                    sizeButtons.removeClass('selected');
                    // Add selected class to this button
                    $(this).addClass('selected');
                    
                    console.log('Selected size (touchend):', selectedSizeValue);
                });
            }
            
            // Set default selection (S button)
            if (sizeButtons.length > 0) {
                sizeButtons.first().addClass('selected');
                selectedSizeValue = sizeButtons.first().attr('data-size');
            }
            
            // Buy button handler
            buyButton.on('click', function() {
                const product = products[currentProductIndex];
                let message = `Хочу заказать ${product.title}`;
                
                if (selectedSizeValue) {
                    message += `, размер: ${selectedSizeValue}`;
                }
                
                const telegramUrl = `https://t.me/Arasuka2H?text=${encodeURIComponent(message)}`;
                window.open(telegramUrl, '_blank');
            });
            
            // Lightbox handlers
            closeLightbox.on('click', function() {
                lightbox.addClass('hidden');
            });
            
            prevImage.on('click', function() {
                currentLightboxIndex = (currentLightboxIndex - 1 + currentImages.length) % currentImages.length;
                updateLightboxImage();
            });
            
            nextImage.on('click', function() {
                currentLightboxIndex = (currentLightboxIndex + 1) % currentImages.length;
                updateLightboxImage();
            });
            
            // Main image click handler for lightbox
            popupMainImage.on('click', function() {
                console.log('jQuery: Main image clicked, currentImages length:', currentImages.length);
                if (currentImages.length > 0) {
                    currentLightboxIndex = 0;
                    showLightbox();
                } else {
                    console.log('jQuery: No images available for lightbox');
                }
            });
            
            function showProductPopup(product) {
                console.log('jQuery: showProductPopup called with product:', product);
                popupTitle.text(product.title);
                
                // Add loading animation to main image
                addImageLoadingAnimation(popupMainImage[0]);
                popupMainImage.attr('src', product.mainImage).attr('alt', product.title);
                
                // Set current images for lightbox
                currentImages = getCurrentProductImages();
                console.log('jQuery: Current images set for lightbox:', currentImages);
                
                // Show/hide 360 view or thumbnails
                if (product.is360) {
                    console.log('jQuery: Setting up 360 view with frames:', product.frames360);
                    popupThumbnails.hide();
                    popup360View.removeClass('hidden');
                    setup360View(product.frames360);
                } else {
                    console.log('jQuery: Setting up gallery with images:', product.gallery);
                    popup360View.addClass('hidden');
                    popupThumbnails.show();
                    setupThumbnails(product.gallery);
                }
                
                // Save current scroll position
                savedScrollPosition = $(window).scrollTop();
                
                popup.removeClass('hidden');
                // Lock body scroll
                $('body').addClass('popup-open');
            }
            
            function setup360View(frames) {
                const slider = $("#360-slider");
                const frameCounter = $("#360-frame-counter");
                
                slider.on('input', function() {
                    const frameIndex = parseInt(this.value);
                    popupMainImage.attr('src', frames[frameIndex]);
                    frameCounter.text(`${frameIndex + 1} / ${frames.length}`);
                });
                
                // Set initial frame
                popupMainImage.attr('src', frames[0]);
                frameCounter.text(`1 / ${frames.length}`);
            }
            
            function setupThumbnails(gallery) {
                popupThumbnails.empty();
                gallery.forEach((src, index) => {
                    const img = $('<img>')
                        .attr('src', src)
                        .attr('alt', `Thumbnail ${index + 1}`)
                        .addClass('w-full aspect-square object-cover rounded cursor-pointer hover:opacity-75 transition-opacity')
                        .on('click', function() {
                            // Add loading animation to main image
                            popupMainImage.addClass('image-loading');
                            popupMainImage.attr('src', src);
                            
                            // Add fade effect when image loads
                            popupMainImage.one('load', function() {
                                popupMainImage.removeClass('image-loading').addClass('image-loaded');
                            });
                        });
                    
                    // Add loading animation
                    addImageLoadingAnimation(img[0]);
                    
                    popupThumbnails.append(img);
                });
            }
            
            function showLightbox() {
                currentImages = getCurrentProductImages();
                if (currentImages.length > 0) {
                    // Add loading animation to lightbox image
                    addImageLoadingAnimation(lightboxImage[0]);
                    lightboxImage.attr('src', currentImages[currentLightboxIndex]);
                    lightboxCounter.text(`${currentLightboxIndex + 1} / ${currentImages.length}`);
                    lightbox.removeClass('hidden');
                }
            }
            
            function updateLightboxImage() {
                // Add loading animation to lightbox image
                addImageLoadingAnimation(lightboxImage[0]);
                lightboxImage.attr('src', currentImages[currentLightboxIndex]);
                lightboxCounter.text(`${currentLightboxIndex + 1} / ${currentImages.length}`);
            }
            
            function getCurrentProductImages() {
                const product = products[currentProductIndex];
                console.log('getCurrentProductImages - product:', product);
                console.log('getCurrentProductImages - is360:', product.is360);
                if (product.is360) {
                    console.log('Returning 360 frames:', product.frames360);
                    return product.frames360;
                } else {
                    const images = [product.mainImage, ...product.gallery];
                    console.log('Returning gallery images:', images);
                    return images;
                }
            }
        });
    }
    
})(typeof jQuery !== 'undefined' ? jQuery : undefined);