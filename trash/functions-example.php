<?php
/**
 * THREEP Theme functions and definitions
 *
 * @package THREEP
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue scripts and styles
 */
function threep_scripts() {
    // Get theme directory URI
    $theme_uri = get_template_directory_uri();
    
    // Enqueue main stylesheet
    wp_enqueue_style('threep-style', $theme_uri . '/style.css', array(), '1.0.0');
    
    // Enqueue custom JavaScript (no jQuery dependency - vanilla JS version used)
    wp_enqueue_script('threep-script', $theme_uri . '/script.js', array(), '1.0.0', true);
    
    // Add inline script to verify loading and debug paths
    wp_add_inline_script('threep-script', '
        console.log("THREEP script loaded via WordPress");
        console.log("Script URL:", "' . $theme_uri . '/script.js");
        console.log("Theme directory:", "' . get_template_directory() . '");
        
        // Check if main script loaded
        setTimeout(function() {
            if (typeof window.openPopup === "undefined") {
                console.log("Main script not loaded, using fallback");
            } else {
                console.log("Main script loaded successfully");
            }
        }, 2000);
        
        // Simple popup function for Safari
        window.openPopup = function(productIndex) {
            console.log("Safari popup function called");
            const popup = document.getElementById("product-popup");
            if (popup) {
                popup.classList.remove("hidden");
                // Initialize size buttons after popup opens
                setTimeout(function() {
                    const sizeButtons = document.querySelectorAll(".size-btn");
                    if (sizeButtons.length > 0) {
                        sizeButtons.forEach(btn => btn.classList.remove("selected"));
                        sizeButtons[0].classList.add("selected");
                    }
                }, 100);
            }
        };
        
        // Simple close popup function for Safari
        window.closePopup = function() {
            console.log("Safari close popup function called");
            const popup = document.getElementById("product-popup");
            if (popup) {
                popup.classList.add("hidden");
            }
        };
        
        // Simple buy button function for Safari
        window.buyProduct = function() {
            console.log("Safari buy function called");
            const selectedButton = document.querySelector(".size-btn.selected");
            const size = selectedButton ? selectedButton.getAttribute("data-size") : "S";
            console.log("Selected size for order:", size);
            
            // Simple Telegram message
            const message = "Хочу заказать товар, размер: " + size;
            const telegramUrl = "https://t.me/threep_shop?text=" + encodeURIComponent(message);
            window.open(telegramUrl, "_blank");
        };
        
        // Add click handlers to product images for Safari
        document.addEventListener("DOMContentLoaded", function() {
            const productImages = document.querySelectorAll(".product-card img");
            productImages.forEach((img, index) => {
                img.onclick = function() {
                    console.log("Product image clicked:", index);
                    window.openPopup(index);
                };
            });
        });
        
        // Simple Safari fallback
        document.addEventListener("DOMContentLoaded", function() {
            console.log("=== THREEP SAFARI FALLBACK ===");
            
            // Simple function to initialize size buttons
            function initSizeButtons() {
                const sizeButtons = document.querySelectorAll(".size-btn");
                console.log("Found size buttons:", sizeButtons.length);
                
                if (sizeButtons.length > 0) {
                    // Set default selection
                    sizeButtons.forEach(btn => btn.classList.remove("selected"));
                    sizeButtons[0].classList.add("selected");
                    
                    // Add simple click handler
                    sizeButtons.forEach(button => {
                        button.onclick = function(e) {
                            e.preventDefault();
                            console.log("Button clicked:", this.getAttribute("data-size"));
                            
                            const size = this.getAttribute("data-size");
                            sizeButtons.forEach(btn => btn.classList.remove("selected"));
                            this.classList.add("selected");
                            
                            console.log("Selected size:", size);
                        };
                    });
                    
                    console.log("Size buttons initialized");
                }
            }
            
            // Initialize immediately
            initSizeButtons();
            
            // Initialize when popup opens
            const popup = document.getElementById("product-popup");
            if (popup) {
                const observer = new MutationObserver(function() {
                    if (!popup.classList.contains("hidden")) {
                        setTimeout(initSizeButtons, 100);
                    }
                });
                observer.observe(popup, { attributes: true, attributeFilter: ["class"] });
            }
            
            // Fallback every 3 seconds
            setInterval(initSizeButtons, 3000);
        });
    ');
    
    // Add debug info to footer for admins
    if (current_user_can('manage_options')) {
        add_action('wp_footer', function() {
            echo '<div style="position: fixed; bottom: 0; left: 0; background: rgba(0,0,0,0.8); color: white; padding: 10px; z-index: 9999; font-size: 12px;">';
            echo '<div>Script URL: ' . get_template_directory_uri() . '/script.js</div>';
            echo '<div>Script exists: ' . (file_exists(get_template_directory() . '/script.js') ? 'YES' : 'NO') . '</div>';
            echo '<div>Style exists: ' . (file_exists(get_template_directory() . '/style.css') ? 'YES' : 'NO') . '</div>';
            echo '</div>';
        });
    }
    
    // Enqueue external stylesheets
    wp_enqueue_style('tailwind-css', 'https://cdn.tailwindcss.com/3.4.16', array(), '3.4.16');
    wp_enqueue_style('remixicon', 'https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css', array(), '4.6.0');
}
add_action('wp_enqueue_scripts', 'threep_scripts');