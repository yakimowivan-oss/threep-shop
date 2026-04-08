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
    
    // Enqueue custom JavaScript
    wp_enqueue_script('threep-script', $theme_uri . '/script.js', array('jquery'), '1.0.0', true);
    
    // Add inline script to verify loading and debug paths
    wp_add_inline_script('threep-script', '
        console.log("THREEP script loaded via WordPress");
        console.log("Script URL:", "' . $theme_uri . '/script.js");
        console.log("Theme directory:", "' . get_template_directory() . '");
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