<?php
/**
 * The main template file
 *
 * @package THREEP
 */

get_header(); ?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>THREEP - Custom Streetwear</title>
    <script src="https://cdn.tailwindcss.com/3.4.16"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: { primary: "#DC2626", secondary: "#EF4444" },
            borderRadius: {
              none: "0px",
              sm: "4px",
              DEFAULT: "8px",
              md: "12px",
              lg: "16px",
              xl: "20px",
              "2xl": "24px",
              "3xl": "32px",
              full: "9999px",
              button: "8px",
            },
          },
        },
      };
    </script>
    
    <script>
      // Header scroll effect
      document.addEventListener('DOMContentLoaded', function() {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        
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
              header.classList.add('bg-black');
            } else {
              header.classList.remove('bg-black');
              header.classList.add('bg-transparent');
            }
          }
        });
      });
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <style>
      @font-face {
        font-family: 'ONDER';
        src: url('http://3threep.ru/wp-content/themes/threep/assets/fonts/ONDER-REGULAR.TTF') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'Involve';
        src: url('http://3threep.ru/wp-content/themes/threep/assets/fonts/Involve-VF.ttf') format('truetype-variations');
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
      }
    </style>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css"
      rel="stylesheet"
    />
    <style>
      :where([class^="ri-"])::before { content: "\f3c2"; }
      .hero-bg {
      background: #000000;
      position: relative;
      overflow: hidden;
      }
      .hero-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      }
      .product-card {
      /* Убираем все эффекты наведения */
      }
      .giant-text {
      font-size: clamp(8rem, 20vw, 24rem);
      font-weight: 900;
      line-height: 0.8;
      text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
      }
      .drip-effect {
      position: relative;
      }
      .drip-effect::after {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 40px;
      background: linear-gradient(to bottom, #DC2626, transparent);
      border-radius: 2px;
      }
      h1, h2, h3, h4, h5, h6 {
      font-family: 'ONDER', sans-serif;
      }
      .price {
        font-family: 'Involve', 'Arial', 'Helvetica', sans-serif;
        font-weight: 500;
      }
      
      /* 360 View Slider Styles */
      .slider {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
      }
      
      .slider::-webkit-slider-track {
        background: #e5e7eb;
        height: 8px;
        border-radius: 4px;
      }
      
      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        background: #dc2626;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      .slider::-moz-range-track {
        background: #e5e7eb;
        height: 8px;
        border-radius: 4px;
        border: none;
      }
      
      .slider::-moz-range-thumb {
        background: #dc2626;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

        /* Lightbox Styles */
        #lightbox {
          backdrop-filter: blur(10px);
        }
        
        #lightbox img {
          transition: transform 0.3s ease;
        }

        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          #lightbox {
            padding: 1rem;
            touch-action: manipulation;
          }
          
          #prev-image, #next-image {
            padding: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          #prev-image {
            left: 0.5rem;
          }
          
          #next-image {
            right: 0.5rem;
          }
          
          #close-lightbox {
            top: 1rem;
            right: 1rem;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          #lightbox-counter {
            font-size: 0.875rem;
          }
          
          #lightbox-image {
            touch-action: manipulation;
            -webkit-user-select: none;
            user-select: none;
          }
        }
        
        @media (max-width: 480px) {
          #lightbox {
            padding: 0.5rem;
            touch-action: manipulation;
          }
          
          #prev-image, #next-image {
            padding: 0.25rem;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          #lightbox-counter {
            font-size: 0.75rem;
          }
          
          #lightbox-image {
            touch-action: manipulation;
            -webkit-user-select: none;
            user-select: none;
          }
        }
        
        /* Additional mobile fixes */
        #popup-main-image {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        /* Force square aspect ratio for main image */
        #popup-main-image {
          aspect-ratio: 1 / 1;
          object-fit: cover;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          border-radius: 0.375rem; /* rounded equivalent */
        }
        
        /* Remove all margins and padding from popup images */
        #product-popup img {
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          outline: none !important;
        }
        
        /* Ensure collection logo is centered */
        #product-popup img[alt="Collection Logo"] {
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        
        /* Mobile touch improvements for product images */
        .product-card img {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          -webkit-user-select: none;
          user-select: none;
        }
        
        /* Prevent text selection on mobile */
        .product-card {
          -webkit-user-select: none;
          user-select: none;
        }

        /* Popup scroll lock */
        body.popup-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }
        
        #product-popup {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        #product-popup .max-w-6xl {
          max-width: 100rem;
        }
        
        #product-popup .h-full.flex.items-center {
          align-items: flex-start;
          padding-top: 2rem;
        }
        
        /* Responsive gallery that fits screen height */
        #product-popup .lg\\:col-span-3 {
          max-height: calc(100vh - 4rem);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        /* Strict height control for gallery container */
        #product-popup .lg\\:col-span-3.space-y-4 {
          max-height: calc(100vh - 6rem);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        #product-popup .w-full.aspect-square {
          flex: 1;
          max-height: calc(100vh - 8rem);
          object-fit: contain;
          width: 100%;
        }
        
        /* Thumbnails responsive - same width as main image */
        #product-popup #popup-thumbnails {
          width: 100%;
          max-height: calc(100vh - 12rem);
          overflow-y: auto;
          flex-shrink: 0;
        }
        
        #product-popup #popup-thumbnails img {
          aspect-ratio: 1;
          object-fit: cover;
          width: 100%;
          height: auto;
        }
        
        /* Mobile adjustments */
        @media (max-width: 1024px) {
          #product-popup .lg\\:col-span-3 {
            max-height: calc(100vh - 2rem);
          }
          
          #product-popup .lg\\:col-span-3.space-y-4 {
            max-height: calc(100vh - 4rem);
          }
          
          #product-popup .w-full.aspect-square {
            max-height: calc(100vh - 6rem);
          }
          
          #product-popup #popup-thumbnails {
            max-height: calc(100vh - 10rem);
          }
        }
        
        /* Small screens - stack vertically */
        @media (max-width: 768px) {
          #product-popup .lg\\:col-span-3.space-y-4 {
            max-height: calc(100vh - 2rem);
          }
          
          #product-popup .w-full.aspect-square {
            max-height: calc(50vh - 2rem);
          }
          
          #product-popup #popup-thumbnails {
            max-height: calc(40vh - 2rem);
          }
        }
        
        /* Extra small screens */
        @media (max-width: 480px) {
          #product-popup .lg\\:col-span-3.space-y-4 {
            max-height: calc(100vh - 1rem);
          }
          
          #product-popup .w-full.aspect-square {
            max-height: calc(45vh - 1rem);
          }
          
          #product-popup #popup-thumbnails {
            max-height: calc(35vh - 1rem);
          }
        }
        
        /* Size Selector Styles */
        #size-dropdown {
          transform: translateY(-10px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        #size-dropdown.show {
          transform: translateY(0);
          opacity: 1;
        }
        
        #size-arrow {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        #size-arrow.rotated {
          transform: rotate(180deg);
        }
        
        #size-selector:focus {
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }
        
        /* iOS video fixes */
        .hero-video::-webkit-media-controls {
          display: none !important;
        }
        
        .hero-video::-webkit-media-controls-panel {
          display: none !important;
        }
        
        .hero-video::-webkit-media-controls-play-button {
          display: none !important;
        }
        
        .hero-video::-webkit-media-controls-start-playback-button {
          display: none !important;
        }
        
        /* Mobile font size adjustments */
        @media (max-width: 640px) {
          .product-card h3 {
            font-size: 0.8rem !important;
            line-height: 1.5rem !important;
          }
        }
        
        /* Popup title font size */
        #popup-title {
          font-size: 1rem !important;
          line-height: 2rem !important;
        }

        .header-section {
          max-width: 42rem;
        }
        
        @media (max-width: 640px) {
          .header-section {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        /* Image loading animation */
        .image-loading {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        
        .image-loaded {
          opacity: 1;
        }
        
        /* Fixed close button for popup */
        #popup-close {
          position: fixed !important;
          top: 1.5rem !important;
          right: 1.5rem !important;
          z-index: 60 !important;
        }
        

        /* Desktop price font size */
        @media (min-width: 641px) {
          .product-card .price {
            font-size: 1.5rem !important;
          }
        }

        /* Mobile header font sizes */
        @media (max-width: 640px) {
          .header-section .font-medium[style*="font-size: 1rem"] {
            font-size: 0.7rem !important;
          }
          .header-section .font-medium[style*="font-size: 0.7rem"] {
            font-size: 0.4rem !important;
          }
        }
        
        /* Size button styles */
        .size-btn {
          min-width: 44px;
          min-height: 44px;
          text-align: center;
          font-family: 'ONDER', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: rgba(242, 151, 116, 0.3);
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          touch-action: manipulation;
          cursor: pointer;
          position: relative;
        }
        
        .size-btn.selected {
          background: #F29774 !important;
          color: #A9342A !important;
          border-color: #F29774 !important;
        }
        
        .size-btn:not(.selected) {
          background: transparent !important;
          color: #F29774 !important;
          border-color: #F29774 !important;
        }
        
        .size-btn:hover {
          opacity: 0.8;
        }
        
        /* iOS touch improvements */
        .size-btn:active {
          transform: scale(0.95);
          background-color: rgba(242, 151, 116, 0.2);
        }
        
        /* Ensure proper touch handling on iOS */
        .size-btn {
          -webkit-tap-highlight-color: rgba(242, 151, 116, 0.3);
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          touch-action: manipulation;
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Hide WordPress default header */
        #header,
        #headerimg,
        #header h1,
        #header .description {
          display: none !important;
        }
        
        /* Remove WordPress default margins and padding */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Ensure hero section starts at the very top */
        .hero-bg {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }
        
        /* Remove any WordPress theme margins/padding */
        * {
          box-sizing: border-box;
        }
        
        /* Override WordPress admin bar if present */
        #wpadminbar {
          display: none !important;
        }
        
        /* Ensure no top spacing from WordPress */
        body.admin-bar {
          padding-top: 0 !important;
        }
        
        /* Force popup to be hidden by default on all devices */
        #product-popup.hidden {
          display: none !important;
        }
        
        /* Desktop popup display */
        @media (min-width: 1024px) {
          #product-popup:not(.hidden) {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          #product-popup > .max-w-7xl {
            margin: auto;
          }
        }
        
        /* Mobile popup improvements */
        @media (max-width: 640px) {
          #product-popup {
            display: none;
          }
          
          #product-popup:not(.hidden) {
            display: flex;
            flex-direction: column;
          }
          
          #product-popup .h-full {
            padding: 1rem 1.5rem;
            padding-bottom: 3rem;
          }
          
          #product-popup .max-w-7xl {
            max-width: 100%;
            margin: 0;
          }
          
          #product-popup .grid {
            gap: 1rem;
          }
          
          #product-popup .space-y-4 > * + * {
            margin-top: 0.75rem;
          }
          
          /* Make options block same width as gallery on mobile */
          #product-popup .grid > div:last-child {
            padding-left: 0;
            padding-right: 0;
          }
          
          /* Make order button same width as gallery on mobile */
          #buy-button {
            width: 100% !important;
            max-width: none !important;
          }
          
          /* Fixed order button on mobile */
          #buy-button {
            position: fixed !important;
            bottom: 1rem !important;
            left: 1rem !important;
            right: 1rem !important;
            z-index: 70 !important;
            margin: 0 !important;
            width: calc(100vw - 2rem) !important;
            max-width: calc(100vw - 2rem) !important;
          }
          
          /* Ensure size buttons are clickable on mobile */
          .size-btn {
            position: relative !important;
            z-index: 80 !important;
            pointer-events: auto !important;
            min-width: 44px !important;
            min-height: 44px !important;
          }
          
          /* Mobile title breaks */
          #popup-title span {
            display: block;
          }
          
          /* Disable lightbox on mobile */
          .lightbox-trigger {
            pointer-events: none !important;
            cursor: default !important;
          }
          
          .lightbox-trigger:hover {
            transform: none !important;
          }
          
          /* iOS Safari mobile fixes */
          .size-btn {
            -webkit-tap-highlight-color: rgba(242, 151, 116, 0.3) !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            touch-action: manipulation !important;
            cursor: pointer !important;
            min-height: 44px !important;
            min-width: 44px !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
          
          .size-btn:active {
            transform: scale(0.95) !important;
            background-color: rgba(242, 151, 116, 0.2) !important;
          }
        }
        
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .size-btn {
            -webkit-tap-highlight-color: rgba(242, 151, 116, 0.3) !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            touch-action: manipulation !important;
            cursor: pointer !important;
            min-height: 44px !important;
            min-width: 44px !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
          
          .size-btn:active {
            background-color: rgba(242, 151, 116, 0.2) !important;
            transform: scale(0.95) !important;
          }
        }
        
        /* Safari-specific fixes */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          .size-btn {
            -webkit-tap-highlight-color: rgba(242, 151, 116, 0.3) !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            touch-action: manipulation !important;
            cursor: pointer !important;
            min-height: 44px !important;
            min-width: 44px !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
        }
        
        /* Safari mobile specific touch fixes */
        @media screen and (max-width: 640px) and (-webkit-min-device-pixel-ratio: 0) {
          .size-btn {
            -webkit-tap-highlight-color: rgba(242, 151, 116, 0.3) !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            user-select: none !important;
            touch-action: manipulation !important;
            cursor: pointer !important;
            min-height: 44px !important;
            min-width: 44px !important;
            -webkit-appearance: none !important;
            appearance: none !important;
          }
        }
        
        /* Tablet popup improvements */
        @media (min-width: 641px) and (max-width: 1024px) {
          #product-popup .max-w-7xl {
            max-width: 90%;
          }
          
          #product-popup .grid {
            gap: 2rem;
          }
        }

    </style>
    <?php wp_head(); ?>
  </head>
  <body class="bg-black text-white overflow-x-hidden" style="scroll-behavior: smooth; background: linear-gradient(to bottom, #a9342a, #c7492f);">
    <header class="fixed top-0 left-0 right-0 z-50 bg-transparent transition-colors duration-300">
      <div class="flex items-center justify-between px-8 py-6">
        <img src="http://3threep.ru/wp-content/uploads/2025/10/logo-threep-textured.png" alt="THREEP Logo" class="h-8 sm:h-20 w-auto">
           <img src="http://3threep.ru/wp-content/uploads/2025/10/logo-threep-font.png" alt="THREEP" class="h-4 sm:h-8 w-auto absolute left-1/2 transform -translate-x-1/2">
        <div class="w-16"></div>
      </div>
    </header>
    <section class="hero-bg w-full aspect-square relative overflow-hidden">
      <video class="hero-video" autoplay muted loop playsinline webkit-playsinline preload="metadata">
        <source src="http://3threep.ru/wp-content/uploads/2025/10/фон-2.mp4" type="video/mp4">
      </video>
    </section>
    <nav class="bg-transparent">
      <div class="header-section mx-auto py-6">
        <div class="flex justify-between items-center">
          <div class="font-medium" style="font-size: 0.7rem; color: #f29774; font-family: 'ONDER', sans-serif;">T-SHIRT</div>
          <div class="font-medium" style="margin-left: 1rem; font-size: 1rem; color: #f29774; font-family: 'ONDER', sans-serif;">AERO+</div>
          <div class="font-medium" style="font-size: 0.7rem; color: #f29774; font-family: 'ONDER', sans-serif;">COLLECTION</div>
        </div>
      </div>
    </nav>
    <section>
      <div class="flex flex-col">
        <div
          class="product-card h-[600px] sm:h-[900px] flex items-center justify-center px-8"
        >
          <div class="w-full max-w-2xl">
            <img
              src="http://3threep.ru/wp-content/uploads/2025/10/Test-cart-1-cart.jpg"
              alt="Dumbrush"
              class="w-full aspect-square object-cover object-top rounded-lg cursor-pointer"
            />
            <div class="mt-4 text-left">
              <h3 class="text-xl font-semibold mb-2" style="color: #f29774;">Dumbrush</h3>
              <p class="text-lg price" style="color: #f29774;">5000 rub</p>
            </div>
          </div>
        </div>
        <div
          class="product-card h-[600px] sm:h-[900px] flex items-center justify-center px-8"
        >
          <div class="w-full max-w-2xl">
            <img
              src="https://readdy.ai/api/search-image?query=young%20male%20model%20wearing%20black%20graphic%20t-shirt%20with%20artistic%20design%2C%20urban%20street%20photography%2C%20moody%20lighting%20with%20red%20accents%2C%20contemporary%20fashion%20style%2C%20underground%20culture%20aesthetic&width=800&height=800&seq=prod002&orientation=squarish"
              alt="Dredd Dolphin"
              class="w-full aspect-square object-cover object-top rounded-lg cursor-pointer"
            />
            <div class="mt-4 text-left">
              <h3 class="text-xl font-semibold mb-2" style="color: #f29774;">Dredd Dolphin</h3>
              <p class="text-lg price" style="color: #f29774;">5000 rub</p>
            </div>
          </div>
        </div>
        <div
          class="product-card h-[600px] sm:h-[900px] flex items-center justify-center px-8"
        >
          <div class="w-full max-w-2xl">
            <img
              src="https://readdy.ai/api/search-image?query=young%20male%20model%20wearing%20black%20streetwear%20t-shirt%20with%20geometric%20graphic%20design%2C%20industrial%20urban%20background%2C%20dramatic%20shadows%20and%20lighting%2C%20contemporary%20fashion%20photography%2C%20edgy%20underground%20style&width=800&height=800&seq=prod003&orientation=squarish"
              alt="Mouse Deathtrap"
              class="w-full aspect-square object-cover object-top rounded-lg cursor-pointer"
            />
            <div class="mt-4 text-left">
              <h3 class="text-xl font-semibold mb-2" style="color: #f29774;">Mouse Deathtrap</h3>
              <p class="text-lg price" style="color: #f29774;">5000 rub</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="py-12" style="background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex flex-col items-center">
          <div class="flex items-center space-x-6 mb-6">
            <a
              href="https://www.instagram.com/3threep.shop/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              class="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full transition-colors duration-300"
            >
              <i class="ri-instagram-fill text-black ri-lg"></i>
            </a>
            <a
              href="https://t.me/threep_shop"
              target="_blank"
              class="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full transition-colors duration-300"
            >
              <i class="ri-telegram-fill text-black ri-lg"></i>
            </a>
            <a
              href="https://www.tiktok.com/@3threep.shop?_t=ZS-90T6J4KSne0&_r=1"
              target="_blank"
              class="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-200 rounded-full transition-colors duration-300"
            >
              <i class="ri-tiktok-fill text-black ri-lg"></i>
            </a>
          </div>
          <div class="text-center mb-4">
            <p class="text-xs" style="color: #f29774;">
              *Решением суда деятельность Meta Platforms и её социальных сетей признана экстремистской
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <img src="http://3threep.ru/wp-content/uploads/2025/10/logo-threep-T.png" alt="THREEP Logo" class="h-16 w-auto">
          </div>
        </div>
        <div
          class="mt-8 pt-8 text-center"
        >
          <p style="color: #f29774;">
            &copy; 2024 THREEP. All rights reserved. Custom streetwear for the
            bold.
          </p>
        </div>
      </div>
    </footer>
    <!-- Product Popup -->
    <div id="product-popup" class="hidden fixed inset-0 z-50" style="background: #A9342A;">
      <button
        id="popup-close"
        class="absolute top-6 right-6 w-8 h-8 rounded transition-all duration-200 font-semibold flex items-center justify-center"
        style="background: #F29774; color: #A9342A; border: 2px solid #F29774; font-family: 'ONDER', sans-serif; font-size: 1rem;"
      >
        ×
      </button>
          <div class="w-full max-w-7xl p-6 sm:p-4 lg:p-8">
            <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
            <!-- Image Gallery (Left Side) -->
            <div class="space-y-4">
              <!-- Main Image -->
              <div class="w-full aspect-square">
                <img
                  id="popup-main-image"
                  src=""
                  alt=""
                  class="w-full h-full object-cover object-center rounded cursor-pointer hover:opacity-90 transition-opacity"
                />
              </div>
            <!-- Thumbnails (for products 1 and 3) -->
            <div id="popup-thumbnails" class="grid grid-cols-5 gap-2">
              <!-- Thumbnail images will be populated by JavaScript -->
            </div>
            <!-- 360 View Slider (for product 2) -->
            <div id="popup-360-view" class="hidden space-y-4">
              <div class="text-center text-sm text-black mb-2">
                <span id="360-frame-counter">1 / 8</span>
              </div>
              <div class="relative">
                <input
                  type="range"
                  id="360-slider"
                  min="0"
                  max="7"
                  value="0"
                  step="1"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
            </div>
            <!-- Product Info (Right Side) -->
            <div class="flex flex-col justify-between px-0 sm:px-0 h-full lg:max-w-md lg:mx-auto">
              <!-- Collection Logo - Top -->
              <div class="text-center px-4">
                <img src="http://3threep.ru/wp-content/uploads/2025/10/aqua.png" alt="Collection Logo" class="h-12 sm:h-16 lg:h-20 xl:h-24 mx-auto">
              </div>
              
              <!-- Center Content -->
              <div class="flex-1 flex flex-col justify-center">
                <!-- Category -->
                <div class="mb-2">
                  <div class="text-sm uppercase tracking-wider" style="color: #F29774; font-family: 'Involve', sans-serif; font-weight: 700;">T-SHIRT</div>
                </div>
                
                <!-- Title and Price Row -->
                <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4">
                  <h2 id="popup-title" class="text-2xl sm:text-3xl lg:text-4xl font-normal mb-2 sm:mb-0" style="color: #F29774; font-family: 'ONDER', sans-serif; line-height: 1.2;">
                    <span class="block">Mouse</span> <span class="block">Deathtrap</span>
                  </h2>
                  <p class="text-xl sm:text-2xl lg:text-3xl price whitespace-nowrap" style="color: #F29774; font-family: 'Involve', sans-serif; font-weight: 500;">5000 ₽</p>
                </div>
                
                <!-- Description -->
                <div class="mb-6">
                  <p class="text-sm sm:text-base leading-relaxed" style="color: #F29774; font-family: 'Involve', sans-serif;">
                    Представим, что мы на пенной вечеринке, выжженной хлоркой. Там есть динозавр, который плюется мыльными пузырями. Рядом тусит тип в костюме коробки и крабоид, который шарит за движ.
                  </p>
                </div>
                
                <!-- Material and Size Info Container -->
                <div class="mb-6">
                  <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                      <p class="text-sm" style="color: #F29774; font-family: 'Involve', sans-serif;">
                        <span style="font-weight: 700;">Состав: </span><span style="font-weight: 400;">хлопок 100%</span>
                      </p>
                      <p class="text-sm" style="color: #F29774; font-family: 'Involve', sans-serif;">
                        <span style="font-weight: 700;">Размер: </span><span style="font-weight: 400;">oversize</span>
                      </p>
                    </div>
                    
                    <!-- Size Selector -->
                    <div class="flex gap-2">
                      <button class="size-btn w-8 h-8 rounded transition-all duration-200 font-semibold flex items-center justify-center" data-size="S" style="background: #F29774; color: #A9342A; border: 2px solid #F29774; font-family: 'ONDER', sans-serif; font-size: 0.5rem;">
                        S
                      </button>
                      <button class="size-btn w-8 h-8 rounded transition-all duration-200 font-semibold flex items-center justify-center" data-size="M" style="background: transparent; color: #F29774; border: 2px solid #F29774; font-family: 'ONDER', sans-serif; font-size: 0.5rem;">
                        M
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Order Button - Bottom -->
              <button
                id="buy-button"
                class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded font-semibold transition-colors uppercase"
                style="background: #F29774; color: #A9342A; font-family: 'ONDER', sans-serif; font-size: 0.5rem;"
              >
                ЗАКАЗАТЬ
              </button>
            </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div id="lightbox" class="hidden fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-4">
      <button
        id="close-lightbox"
        class="absolute top-4 right-4 text-white hover:text-black transition-colors z-10"
      >
        <i class="ri-close-line ri-3x"></i>
      </button>
      <button
        id="prev-image"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-black transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
      >
        <i class="ri-arrow-left-line ri-2x"></i>
      </button>
      <button
        id="next-image"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-black transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
      >
        <i class="ri-arrow-right-line ri-2x"></i>
      </button>
      <div class="max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        <img
          id="lightbox-image"
          src=""
          alt=""
          class="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        <span id="lightbox-counter">1 / 5</span>
      </div>
    </div>

    <?php wp_footer(); ?>
  </body>
</html>
