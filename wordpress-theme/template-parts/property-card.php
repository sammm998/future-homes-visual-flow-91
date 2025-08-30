<?php
/**
 * Template part for displaying property cards
 */

$property_id = get_the_ID();
$ref_no = get_post_meta($property_id, '_ref_no', true);
$price = get_post_meta($property_id, '_price', true);
$bedrooms = get_post_meta($property_id, '_bedrooms', true);
$bathrooms = get_post_meta($property_id, '_bathrooms', true);
$area = get_post_meta($property_id, '_area', true);

// Convert price to current currency
$current_currency = fht_get_current_currency();
$converted_price = fht_convert_price($price, 'EUR', $current_currency);
$formatted_price = fht_format_price($converted_price, $current_currency);
?>

<article class="property-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <?php if (has_post_thumbnail()) : ?>
        <div class="aspect-w-16 aspect-h-9 relative">
            <a href="<?php the_permalink(); ?>">
                <?php the_post_thumbnail('property-thumbnail', array('class' => 'w-full h-48 object-cover')); ?>
            </a>
            
            <?php if ($ref_no) : ?>
                <div class="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                    <?php echo esc_html($ref_no); ?>
                </div>
            <?php endif; ?>
            
            <?php if ($price) : ?>
                <div class="absolute top-3 right-3 bg-white text-gray-900 px-2 py-1 rounded text-sm font-bold">
                    <?php echo esc_html($formatted_price); ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="p-6">
        <h3 class="text-xl font-semibold mb-2">
            <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-blue-600 transition-colors">
                <?php the_title(); ?>
            </a>
        </h3>
        
        <?php
        $locations = get_the_terms($property_id, 'property_location');
        if ($locations && !is_wp_error($locations)) :
        ?>
            <div class="text-gray-600 mb-3 flex items-center">
                <span class="mr-1">📍</span>
                <?php echo esc_html($locations[0]->name); ?>
            </div>
        <?php endif; ?>
        
        <div class="text-gray-600 mb-4">
            <?php the_excerpt(); ?>
        </div>
        
        <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
            <?php if ($bedrooms) : ?>
                <div class="flex items-center">
                    <span class="mr-1">🛏️</span>
                    <?php printf(_n('%s Bedroom', '%s Bedrooms', $bedrooms, 'future-homes-turkey'), $bedrooms); ?>
                </div>
            <?php endif; ?>
            
            <?php if ($bathrooms) : ?>
                <div class="flex items-center">
                    <span class="mr-1">🚿</span>
                    <?php printf(_n('%s Bath', '%s Baths', $bathrooms, 'future-homes-turkey'), $bathrooms); ?>
                </div>
            <?php endif; ?>
            
            <?php if ($area) : ?>
                <div class="flex items-center">
                    <span class="mr-1">📏</span>
                    <?php echo esc_html($area); ?> m²
                </div>
            <?php endif; ?>
        </div>
        
        <div class="flex justify-between items-center">
            <a href="<?php the_permalink(); ?>" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                <?php _e('View Details', 'future-homes-turkey'); ?>
            </a>
            
            <button class="text-gray-500 hover:text-red-500 transition-colors" title="<?php esc_attr_e('Add to favorites', 'future-homes-turkey'); ?>">
                <span class="text-xl">♡</span>
            </button>
        </div>
    </div>
</article>