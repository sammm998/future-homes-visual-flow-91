<?php get_header(); ?>

<main id="main" class="main">
    <!-- Hero Section -->
    <section class="hero-section bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div class="container mx-auto px-4 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">
                <?php _e('Find Your Dream Property', 'future-homes-turkey'); ?>
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-blue-100">
                <?php _e('Premium properties in Turkey, Dubai, Cyprus & France', 'future-homes-turkey'); ?>
            </p>
            
            <!-- Property Search Form -->
            <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 text-gray-900">
                <form id="property-search-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label for="search-location" class="block text-sm font-medium mb-2"><?php _e('Location', 'future-homes-turkey'); ?></label>
                        <select id="search-location" name="location" class="w-full p-3 border border-gray-300 rounded-md">
                            <option value=""><?php _e('All Locations', 'future-homes-turkey'); ?></option>
                            <option value="dubai"><?php _e('Dubai', 'future-homes-turkey'); ?></option>
                            <option value="antalya"><?php _e('Antalya', 'future-homes-turkey'); ?></option>
                            <option value="cyprus"><?php _e('Cyprus', 'future-homes-turkey'); ?></option>
                            <option value="france"><?php _e('France', 'future-homes-turkey'); ?></option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="search-bedrooms" class="block text-sm font-medium mb-2"><?php _e('Bedrooms', 'future-homes-turkey'); ?></label>
                        <select id="search-bedrooms" name="bedrooms" class="w-full p-3 border border-gray-300 rounded-md">
                            <option value=""><?php _e('Any', 'future-homes-turkey'); ?></option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="search-price-min" class="block text-sm font-medium mb-2"><?php _e('Min Price', 'future-homes-turkey'); ?></label>
                        <select id="search-price-min" name="min_price" class="w-full p-3 border border-gray-300 rounded-md">
                            <option value=""><?php _e('No Min', 'future-homes-turkey'); ?></option>
                            <option value="100000">€100,000</option>
                            <option value="250000">€250,000</option>
                            <option value="500000">€500,000</option>
                            <option value="1000000">€1,000,000</option>
                        </select>
                    </div>
                    
                    <div class="flex items-end">
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
                            <?php _e('Search Properties', 'future-homes-turkey'); ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- Featured Properties -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    <?php _e('Featured Properties', 'future-homes-turkey'); ?>
                </h2>
                <p class="text-lg text-gray-600">
                    <?php _e('Discover our handpicked selection of premium properties', 'future-homes-turkey'); ?>
                </p>
            </div>
            
            <div id="featured-properties" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php
                $featured_properties = new WP_Query(array(
                    'post_type' => 'property',
                    'posts_per_page' => 6,
                    'meta_query' => array(
                        array(
                            'key' => '_featured',
                            'value' => '1',
                            'compare' => '='
                        )
                    )
                ));
                
                if ($featured_properties->have_posts()) :
                    while ($featured_properties->have_posts()) : $featured_properties->the_post();
                        get_template_part('template-parts/property-card');
                    endwhile;
                    wp_reset_postdata();
                else :
                    // Fallback to latest properties if no featured ones
                    $latest_properties = new WP_Query(array(
                        'post_type' => 'property',
                        'posts_per_page' => 6
                    ));
                    
                    if ($latest_properties->have_posts()) :
                        while ($latest_properties->have_posts()) : $latest_properties->the_post();
                            get_template_part('template-parts/property-card');
                        endwhile;
                        wp_reset_postdata();
                    endif;
                endif;
                ?>
            </div>
            
            <div class="text-center mt-12">
                <a href="<?php echo esc_url(get_post_type_archive_link('property')); ?>" class="inline-block bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    <?php _e('View All Properties', 'future-homes-turkey'); ?>
                </a>
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-16">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    <?php _e('Why Choose Future Homes Turkey?', 'future-homes-turkey'); ?>
                </h2>
                <p class="text-lg text-gray-600">
                    <?php _e('We provide expert guidance for your international property investment', 'future-homes-turkey'); ?>
                </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">🏠</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2"><?php _e('Premium Properties', 'future-homes-turkey'); ?></h3>
                    <p class="text-gray-600"><?php _e('Carefully selected luxury properties in prime locations across multiple countries.', 'future-homes-turkey'); ?></p>
                </div>
                
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">🎯</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2"><?php _e('Expert Guidance', 'future-homes-turkey'); ?></h3>
                    <p class="text-gray-600"><?php _e('Professional consultation and support throughout your property investment journey.', 'future-homes-turkey'); ?></p>
                </div>
                
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-2xl">🌍</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2"><?php _e('Citizenship Programs', 'future-homes-turkey'); ?></h3>
                    <p class="text-gray-600"><?php _e('Access to citizenship through investment programs in various countries.', 'future-homes-turkey'); ?></p>
                </div>
            </div>
        </div>
    </section>

    <!-- Newsletter Signup -->
    <section class="py-16 bg-blue-600 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                <?php _e('Stay Updated', 'future-homes-turkey'); ?>
            </h2>
            <p class="text-xl mb-8 text-blue-100">
                <?php _e('Get the latest properties and investment opportunities delivered to your inbox', 'future-homes-turkey'); ?>
            </p>
            
            <form id="newsletter-form" class="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input type="email" 
                       name="email" 
                       placeholder="<?php esc_attr_e('Enter your email address', 'future-homes-turkey'); ?>"
                       class="flex-1 p-3 rounded-md text-gray-900"
                       required>
                <button type="submit" class="bg-white text-blue-600 py-3 px-6 rounded-md hover:bg-gray-100 transition-colors font-medium">
                    <?php _e('Subscribe', 'future-homes-turkey'); ?>
                </button>
            </form>
        </div>
    </section>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Property Search Form
    const searchForm = document.getElementById('property-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const params = new URLSearchParams();
            
            for (let [key, value] of formData.entries()) {
                if (value) {
                    params.append(key, value);
                }
            }
            
            // Redirect to properties archive with search parameters
            window.location.href = '<?php echo esc_url(get_post_type_archive_link('property')); ?>?' + params.toString();
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: new URLSearchParams({
                    action: 'newsletter_signup',
                    email: formData.get('email'),
                    nonce: '<?php echo wp_create_nonce('fht_nonce'); ?>'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('<?php _e('Thank you for subscribing!', 'future-homes-turkey'); ?>');
                    newsletterForm.reset();
                } else {
                    alert('<?php _e('Something went wrong. Please try again.', 'future-homes-turkey'); ?>');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('<?php _e('Something went wrong. Please try again.', 'future-homes-turkey'); ?>');
            });
        });
    }
});
</script>

<?php get_footer(); ?>