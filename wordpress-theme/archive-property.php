<?php get_header(); ?>

<main id="main" class="main">
    <div class="container mx-auto px-4 py-8">
        <!-- Page Header -->
        <div class="text-center mb-12">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <?php
                if (is_tax('property_location')) {
                    printf(__('Properties in %s', 'future-homes-turkey'), single_term_title('', false));
                } else {
                    _e('All Properties', 'future-homes-turkey');
                }
                ?>
            </h1>
            <p class="text-lg text-gray-600">
                <?php _e('Discover our selection of premium properties', 'future-homes-turkey'); ?>
            </p>
        </div>
        
        <!-- Property Search Filter -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <form id="property-filter-form" class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div>
                    <label for="filter-location" class="block text-sm font-medium mb-2"><?php _e('Location', 'future-homes-turkey'); ?></label>
                    <select id="filter-location" name="location" class="w-full p-2 border border-gray-300 rounded-md">
                        <option value=""><?php _e('All Locations', 'future-homes-turkey'); ?></option>
                        <?php
                        $locations = get_terms(array(
                            'taxonomy' => 'property_location',
                            'hide_empty' => true,
                        ));
                        foreach ($locations as $location) :
                        ?>
                            <option value="<?php echo esc_attr($location->slug); ?>" <?php selected(get_query_var('property_location'), $location->slug); ?>>
                                <?php echo esc_html($location->name); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div>
                    <label for="filter-bedrooms" class="block text-sm font-medium mb-2"><?php _e('Bedrooms', 'future-homes-turkey'); ?></label>
                    <select id="filter-bedrooms" name="bedrooms" class="w-full p-2 border border-gray-300 rounded-md">
                        <option value=""><?php _e('Any', 'future-homes-turkey'); ?></option>
                        <option value="1" <?php selected(get_query_var('bedrooms'), '1'); ?>>1+</option>
                        <option value="2" <?php selected(get_query_var('bedrooms'), '2'); ?>>2+</option>
                        <option value="3" <?php selected(get_query_var('bedrooms'), '3'); ?>>3+</option>
                        <option value="4" <?php selected(get_query_var('bedrooms'), '4'); ?>>4+</option>
                        <option value="5" <?php selected(get_query_var('bedrooms'), '5'); ?>>5+</option>
                    </select>
                </div>
                
                <div>
                    <label for="filter-min-price" class="block text-sm font-medium mb-2"><?php _e('Min Price', 'future-homes-turkey'); ?></label>
                    <select id="filter-min-price" name="min_price" class="w-full p-2 border border-gray-300 rounded-md">
                        <option value=""><?php _e('No Min', 'future-homes-turkey'); ?></option>
                        <option value="100000" <?php selected(get_query_var('min_price'), '100000'); ?>>€100,000</option>
                        <option value="250000" <?php selected(get_query_var('min_price'), '250000'); ?>>€250,000</option>
                        <option value="500000" <?php selected(get_query_var('min_price'), '500000'); ?>>€500,000</option>
                        <option value="1000000" <?php selected(get_query_var('min_price'), '1000000'); ?>>€1,000,000</option>
                    </select>
                </div>
                
                <div>
                    <label for="filter-max-price" class="block text-sm font-medium mb-2"><?php _e('Max Price', 'future-homes-turkey'); ?></label>
                    <select id="filter-max-price" name="max_price" class="w-full p-2 border border-gray-300 rounded-md">
                        <option value=""><?php _e('No Max', 'future-homes-turkey'); ?></option>
                        <option value="250000" <?php selected(get_query_var('max_price'), '250000'); ?>>€250,000</option>
                        <option value="500000" <?php selected(get_query_var('max_price'), '500000'); ?>>€500,000</option>
                        <option value="1000000" <?php selected(get_query_var('max_price'), '1000000'); ?>>€1,000,000</option>
                        <option value="2000000" <?php selected(get_query_var('max_price'), '2000000'); ?>>€2,000,000</option>
                    </select>
                </div>
                
                <div>
                    <label for="filter-sort" class="block text-sm font-medium mb-2"><?php _e('Sort By', 'future-homes-turkey'); ?></label>
                    <select id="filter-sort" name="sort" class="w-full p-2 border border-gray-300 rounded-md">
                        <option value="date-desc" <?php selected(get_query_var('sort'), 'date-desc'); ?>><?php _e('Newest First', 'future-homes-turkey'); ?></option>
                        <option value="date-asc" <?php selected(get_query_var('sort'), 'date-asc'); ?>><?php _e('Oldest First', 'future-homes-turkey'); ?></option>
                        <option value="price-asc" <?php selected(get_query_var('sort'), 'price-asc'); ?>><?php _e('Price: Low to High', 'future-homes-turkey'); ?></option>
                        <option value="price-desc" <?php selected(get_query_var('sort'), 'price-desc'); ?>><?php _e('Price: High to Low', 'future-homes-turkey'); ?></option>
                    </select>
                </div>
                
                <div class="flex items-end">
                    <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                        <?php _e('Filter', 'future-homes-turkey'); ?>
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Properties Grid -->
        <?php if (have_posts()) : ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8" id="properties-grid">
                <?php while (have_posts()) : the_post(); ?>
                    <?php get_template_part('template-parts/property-card'); ?>
                <?php endwhile; ?>
            </div>
            
            <!-- Pagination -->
            <div class="flex justify-center">
                <?php
                the_posts_pagination(array(
                    'prev_text' => __('← Previous', 'future-homes-turkey'),
                    'next_text' => __('Next →', 'future-homes-turkey'),
                    'class' => 'pagination',
                ));
                ?>
            </div>
        <?php else : ?>
            <div class="text-center py-12">
                <h2 class="text-2xl font-bold mb-4"><?php _e('No Properties Found', 'future-homes-turkey'); ?></h2>
                <p class="text-gray-600 mb-6"><?php _e('We couldn\'t find any properties matching your criteria.', 'future-homes-turkey'); ?></p>
                <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    <?php _e('View All Properties', 'future-homes-turkey'); ?>
                </a>
            </div>
        <?php endif; ?>
    </div>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('property-filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const params = new URLSearchParams();
            
            for (let [key, value] of formData.entries()) {
                if (value) {
                    params.append(key, value);
                }
            }
            
            window.location.href = window.location.pathname + '?' + params.toString();
        });
    }
});
</script>

<?php get_footer(); ?>