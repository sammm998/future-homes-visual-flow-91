<?php
/**
 * Future Homes Turkey Theme Functions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Theme constants
define('FHT_THEME_VERSION', '1.0.0');
define('FHT_THEME_DIR', get_template_directory());
define('FHT_THEME_URL', get_template_directory_uri());

/**
 * Theme setup
 */
function fht_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_theme_support('editor-styles');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'future-homes-turkey'),
        'footer' => __('Footer Menu', 'future-homes-turkey'),
        'mobile' => __('Mobile Menu', 'future-homes-turkey'),
    ));
    
    // Add image sizes
    add_image_size('property-thumbnail', 400, 300, true);
    add_image_size('property-large', 800, 600, true);
    add_image_size('hero-image', 1920, 1080, true);
    
    // Load text domain
    load_theme_textdomain('future-homes-turkey', FHT_THEME_DIR . '/languages');
}
add_action('after_setup_theme', 'fht_theme_setup');

/**
 * Enqueue scripts and styles
 */
function fht_enqueue_assets() {
    // Main stylesheet (compiled from Tailwind)
    wp_enqueue_style('fht-main-style', FHT_THEME_URL . '/assets/css/main.css', array(), FHT_THEME_VERSION);
    
    // Main JavaScript
    wp_enqueue_script('fht-main-script', FHT_THEME_URL . '/assets/js/main.js', array('jquery'), FHT_THEME_VERSION, true);
    
    // Localize script for AJAX
    wp_localize_script('fht-main-script', 'fht_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('fht_nonce'),
        'lang' => get_locale(),
    ));
    
    // Currency selector script
    wp_enqueue_script('fht-currency', FHT_THEME_URL . '/assets/js/currency-selector.js', array('jquery'), FHT_THEME_VERSION, true);
}
add_action('wp_enqueue_scripts', 'fht_enqueue_assets');

/**
 * Register Custom Post Types
 */
function fht_register_post_types() {
    // Properties CPT
    register_post_type('property', array(
        'labels' => array(
            'name' => __('Properties', 'future-homes-turkey'),
            'singular_name' => __('Property', 'future-homes-turkey'),
            'add_new' => __('Add New Property', 'future-homes-turkey'),
            'add_new_item' => __('Add New Property', 'future-homes-turkey'),
            'edit_item' => __('Edit Property', 'future-homes-turkey'),
            'new_item' => __('New Property', 'future-homes-turkey'),
            'view_item' => __('View Property', 'future-homes-turkey'),
            'search_items' => __('Search Properties', 'future-homes-turkey'),
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'properties'),
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'menu_icon' => 'dashicons-building',
        'show_in_rest' => true,
    ));
    
    // Team Members CPT
    register_post_type('team_member', array(
        'labels' => array(
            'name' => __('Team Members', 'future-homes-turkey'),
            'singular_name' => __('Team Member', 'future-homes-turkey'),
        ),
        'public' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-groups',
        'show_in_rest' => true,
    ));
    
    // Testimonials CPT
    register_post_type('testimonial', array(
        'labels' => array(
            'name' => __('Testimonials', 'future-homes-turkey'),
            'singular_name' => __('Testimonial', 'future-homes-turkey'),
        ),
        'public' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-format-quote',
        'show_in_rest' => true,
    ));
}
add_action('init', 'fht_register_post_types');

/**
 * Register Custom Taxonomies
 */
function fht_register_taxonomies() {
    // Property Location
    register_taxonomy('property_location', 'property', array(
        'labels' => array(
            'name' => __('Locations', 'future-homes-turkey'),
            'singular_name' => __('Location', 'future-homes-turkey'),
        ),
        'hierarchical' => true,
        'public' => true,
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'location'),
    ));
    
    // Property Type
    register_taxonomy('property_type', 'property', array(
        'labels' => array(
            'name' => __('Property Types', 'future-homes-turkey'),
            'singular_name' => __('Property Type', 'future-homes-turkey'),
        ),
        'hierarchical' => true,
        'public' => true,
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'type'),
    ));
}
add_action('init', 'fht_register_taxonomies');

/**
 * Add Custom Fields for Properties
 */
function fht_add_property_meta_boxes() {
    add_meta_box(
        'property_details',
        __('Property Details', 'future-homes-turkey'),
        'fht_property_details_callback',
        'property',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'fht_add_property_meta_boxes');

function fht_property_details_callback($post) {
    wp_nonce_field('fht_save_property_details', 'fht_property_details_nonce');
    
    $ref_no = get_post_meta($post->ID, '_ref_no', true);
    $price = get_post_meta($post->ID, '_price', true);
    $bedrooms = get_post_meta($post->ID, '_bedrooms', true);
    $bathrooms = get_post_meta($post->ID, '_bathrooms', true);
    $area = get_post_meta($post->ID, '_area', true);
    $latitude = get_post_meta($post->ID, '_latitude', true);
    $longitude = get_post_meta($post->ID, '_longitude', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="ref_no"><?php _e('Reference Number', 'future-homes-turkey'); ?></label></th>
            <td><input type="text" id="ref_no" name="ref_no" value="<?php echo esc_attr($ref_no); ?>" /></td>
        </tr>
        <tr>
            <th><label for="price"><?php _e('Price', 'future-homes-turkey'); ?></label></th>
            <td><input type="text" id="price" name="price" value="<?php echo esc_attr($price); ?>" /></td>
        </tr>
        <tr>
            <th><label for="bedrooms"><?php _e('Bedrooms', 'future-homes-turkey'); ?></label></th>
            <td><input type="number" id="bedrooms" name="bedrooms" value="<?php echo esc_attr($bedrooms); ?>" /></td>
        </tr>
        <tr>
            <th><label for="bathrooms"><?php _e('Bathrooms', 'future-homes-turkey'); ?></label></th>
            <td><input type="number" id="bathrooms" name="bathrooms" value="<?php echo esc_attr($bathrooms); ?>" /></td>
        </tr>
        <tr>
            <th><label for="area"><?php _e('Area (m²)', 'future-homes-turkey'); ?></label></th>
            <td><input type="number" id="area" name="area" value="<?php echo esc_attr($area); ?>" /></td>
        </tr>
        <tr>
            <th><label for="latitude"><?php _e('Latitude', 'future-homes-turkey'); ?></label></th>
            <td><input type="text" id="latitude" name="latitude" value="<?php echo esc_attr($latitude); ?>" /></td>
        </tr>
        <tr>
            <th><label for="longitude"><?php _e('Longitude', 'future-homes-turkey'); ?></label></th>
            <td><input type="text" id="longitude" name="longitude" value="<?php echo esc_attr($longitude); ?>" /></td>
        </tr>
    </table>
    <?php
}

/**
 * Save Property Meta
 */
function fht_save_property_details($post_id) {
    if (!isset($_POST['fht_property_details_nonce']) || !wp_verify_nonce($_POST['fht_property_details_nonce'], 'fht_save_property_details')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    $fields = array('ref_no', 'price', 'bedrooms', 'bathrooms', 'area', 'latitude', 'longitude');
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post', 'fht_save_property_details');

/**
 * AJAX Handler for Property Search
 */
function fht_ajax_property_search() {
    check_ajax_referer('fht_nonce', 'nonce');
    
    $search_params = array(
        'post_type' => 'property',
        'post_status' => 'publish',
        'posts_per_page' => 12,
        'meta_query' => array()
    );
    
    // Add search filters
    if (!empty($_POST['location'])) {
        $search_params['tax_query'][] = array(
            'taxonomy' => 'property_location',
            'field' => 'slug',
            'terms' => sanitize_text_field($_POST['location'])
        );
    }
    
    if (!empty($_POST['bedrooms'])) {
        $search_params['meta_query'][] = array(
            'key' => '_bedrooms',
            'value' => intval($_POST['bedrooms']),
            'compare' => '>='
        );
    }
    
    if (!empty($_POST['min_price']) || !empty($_POST['max_price'])) {
        $price_query = array('key' => '_price');
        if (!empty($_POST['min_price'])) {
            $price_query['value'] = intval($_POST['min_price']);
            $price_query['compare'] = '>=';
        }
        if (!empty($_POST['max_price'])) {
            $price_query['value'] = array(intval($_POST['min_price']), intval($_POST['max_price']));
            $price_query['compare'] = 'BETWEEN';
        }
        $search_params['meta_query'][] = $price_query;
    }
    
    $query = new WP_Query($search_params);
    $properties = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $properties[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'price' => get_post_meta(get_the_ID(), '_price', true),
                'bedrooms' => get_post_meta(get_the_ID(), '_bedrooms', true),
                'area' => get_post_meta(get_the_ID(), '_area', true),
                'image' => get_the_post_thumbnail_url(get_the_ID(), 'property-thumbnail'),
                'permalink' => get_permalink()
            );
        }
        wp_reset_postdata();
    }
    
    wp_send_json_success($properties);
}
add_action('wp_ajax_property_search', 'fht_ajax_property_search');
add_action('wp_ajax_nopriv_property_search', 'fht_ajax_property_search');

/**
 * Currency Options
 */
function fht_get_currencies() {
    return array(
        'EUR' => array('code' => 'EUR', 'symbol' => '€', 'name' => 'Euro'),
        'USD' => array('code' => 'USD', 'symbol' => '$', 'name' => 'US Dollar'),
        'GBP' => array('code' => 'GBP', 'symbol' => '£', 'name' => 'British Pound'),
        'SEK' => array('code' => 'SEK', 'symbol' => 'kr', 'name' => 'Swedish Krona'),
        'NOK' => array('code' => 'NOK', 'symbol' => 'kr', 'name' => 'Norwegian Krone'),
        'DKK' => array('code' => 'DKK', 'symbol' => 'kr', 'name' => 'Danish Krone'),
        'TRY' => array('code' => 'TRY', 'symbol' => '₺', 'name' => 'Turkish Lira'),
    );
}

/**
 * Get current currency
 */
function fht_get_current_currency() {
    $default = 'EUR';
    if (isset($_COOKIE['fht_currency'])) {
        return sanitize_text_field($_COOKIE['fht_currency']);
    }
    return $default;
}

/**
 * Convert price to current currency
 */
function fht_convert_price($price, $from_currency = 'EUR', $to_currency = null) {
    if (!$to_currency) {
        $to_currency = fht_get_current_currency();
    }
    
    // Simple conversion rates (in production, use real-time API)
    $rates = array(
        'EUR' => 1.0,
        'USD' => 1.10,
        'GBP' => 0.85,
        'SEK' => 11.0,
        'NOK' => 11.5,
        'DKK' => 7.5,
        'TRY' => 32.0,
    );
    
    if (!isset($rates[$from_currency]) || !isset($rates[$to_currency])) {
        return $price;
    }
    
    // Convert to EUR first, then to target currency
    $eur_price = $price / $rates[$from_currency];
    return round($eur_price * $rates[$to_currency], 2);
}

/**
 * Format price with currency
 */
function fht_format_price($price, $currency = null) {
    if (!$currency) {
        $currency = fht_get_current_currency();
    }
    
    $currencies = fht_get_currencies();
    $symbol = isset($currencies[$currency]) ? $currencies[$currency]['symbol'] : '€';
    
    return $symbol . number_format($price, 0, ',', '.');
}

/**
 * Custom Walker for Navigation Menu
 */
class FHT_Walker_Nav_Menu extends Walker_Nav_Menu {
    public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;
        
        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args));
        $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';
        
        $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args);
        $id = $id ? ' id="' . esc_attr($id) . '"' : '';
        
        $output .= '<li' . $id . $class_names .'>';
        
        $attributes  = ! empty($item->attr_title) ? ' title="'  . esc_attr($item->attr_title) .'"' : '';
        $attributes .= ! empty($item->target)     ? ' target="' . esc_attr($item->target     ) .'"' : '';
        $attributes .= ! empty($item->xfn)        ? ' rel="'    . esc_attr($item->xfn        ) .'"' : '';
        $attributes .= ! empty($item->url)        ? ' href="'   . esc_attr($item->url        ) .'"' : '';
        
        $item_output = isset($args->before) ? $args->before : '';
        $item_output .= '<a' . $attributes .'>';
        $item_output .= (isset($args->link_before) ? $args->link_before : '') . apply_filters('the_title', $item->title, $item->ID) . (isset($args->link_after) ? $args->link_after : '');
        $item_output .= '</a>';
        $item_output .= isset($args->after) ? $args->after : '';
        
        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
    }
}