<?php get_header(); ?>

<main id="main" class="main">
    <?php while (have_posts()) : the_post(); ?>
        <article id="property-<?php the_ID(); ?>" <?php post_class('property-single'); ?>>
            <!-- Property Hero Section -->
            <section class="property-hero bg-gray-50 py-8">
                <div class="container mx-auto px-4">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Property Images -->
                        <div class="property-images">
                            <?php if (has_post_thumbnail()) : ?>
                                <div class="main-image mb-4">
                                    <?php the_post_thumbnail('large', array('class' => 'w-full h-96 object-cover rounded-lg')); ?>
                                </div>
                            <?php endif; ?>
                            
                            <?php
                            $gallery = get_post_meta(get_the_ID(), '_gallery', true);
                            if ($gallery) :
                            ?>
                                <div class="gallery-thumbnails grid grid-cols-4 gap-2">
                                    <?php foreach ($gallery as $image_id) : ?>
                                        <img src="<?php echo wp_get_attachment_image_url($image_id, 'thumbnail'); ?>" 
                                             alt="<?php echo get_post_meta($image_id, '_wp_attachment_image_alt', true); ?>"
                                             class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80">
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Property Details -->
                        <div class="property-details">
                            <div class="mb-4">
                                <?php
                                $ref_no = get_post_meta(get_the_ID(), '_ref_no', true);
                                if ($ref_no) :
                                ?>
                                    <span class="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                                        <?php echo esc_html($ref_no); ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                            
                            <h1 class="text-3xl font-bold text-gray-900 mb-4"><?php the_title(); ?></h1>
                            
                            <?php
                            $locations = get_the_terms(get_the_ID(), 'property_location');
                            if ($locations && !is_wp_error($locations)) :
                            ?>
                                <div class="text-gray-600 mb-4 flex items-center">
                                    <span class="mr-2">📍</span>
                                    <?php echo esc_html($locations[0]->name); ?>
                                </div>
                            <?php endif; ?>
                            
                            <?php
                            $price = get_post_meta(get_the_ID(), '_price', true);
                            if ($price) :
                                $current_currency = fht_get_current_currency();
                                $converted_price = fht_convert_price($price, 'EUR', $current_currency);
                                $formatted_price = fht_format_price($converted_price, $current_currency);
                            ?>
                                <div class="text-3xl font-bold text-blue-600 mb-6">
                                    <?php echo esc_html($formatted_price); ?>
                                </div>
                            <?php endif; ?>
                            
                            <!-- Property Features -->
                            <div class="property-features grid grid-cols-3 gap-4 mb-6">
                                <?php
                                $bedrooms = get_post_meta(get_the_ID(), '_bedrooms', true);
                                $bathrooms = get_post_meta(get_the_ID(), '_bathrooms', true);
                                $area = get_post_meta(get_the_ID(), '_area', true);
                                ?>
                                
                                <?php if ($bedrooms) : ?>
                                    <div class="text-center p-4 bg-white rounded-lg">
                                        <div class="text-2xl mb-2">🛏️</div>
                                        <div class="font-semibold"><?php echo esc_html($bedrooms); ?></div>
                                        <div class="text-sm text-gray-600"><?php _e('Bedrooms', 'future-homes-turkey'); ?></div>
                                    </div>
                                <?php endif; ?>
                                
                                <?php if ($bathrooms) : ?>
                                    <div class="text-center p-4 bg-white rounded-lg">
                                        <div class="text-2xl mb-2">🚿</div>
                                        <div class="font-semibold"><?php echo esc_html($bathrooms); ?></div>
                                        <div class="text-sm text-gray-600"><?php _e('Bathrooms', 'future-homes-turkey'); ?></div>
                                    </div>
                                <?php endif; ?>
                                
                                <?php if ($area) : ?>
                                    <div class="text-center p-4 bg-white rounded-lg">
                                        <div class="text-2xl mb-2">📏</div>
                                        <div class="font-semibold"><?php echo esc_html($area); ?> m²</div>
                                        <div class="text-sm text-gray-600"><?php _e('Area', 'future-homes-turkey'); ?></div>
                                    </div>
                                <?php endif; ?>
                            </div>
                            
                            <!-- Contact Buttons -->
                            <div class="flex flex-col sm:flex-row gap-4">
                                <a href="tel:+905388881881" class="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium text-center">
                                    <?php _e('Call Now', 'future-homes-turkey'); ?>
                                </a>
                                <a href="mailto:info@futurehomesturkey.com?subject=<?php echo urlencode(get_the_title()); ?>" class="bg-gray-200 text-gray-900 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium text-center">
                                    <?php _e('Send Email', 'future-homes-turkey'); ?>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Property Description -->
            <section class="py-12">
                <div class="container mx-auto px-4">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2">
                            <h2 class="text-2xl font-bold mb-6"><?php _e('Property Description', 'future-homes-turkey'); ?></h2>
                            <div class="prose max-w-none">
                                <?php the_content(); ?>
                            </div>
                            
                            <?php
                            $amenities = get_post_meta(get_the_ID(), '_amenities', true);
                            if ($amenities) :
                            ?>
                                <div class="mt-8">
                                    <h3 class="text-xl font-bold mb-4"><?php _e('Amenities', 'future-homes-turkey'); ?></h3>
                                    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        <?php foreach ($amenities as $amenity) : ?>
                                            <div class="flex items-center text-gray-700">
                                                <span class="text-green-500 mr-2">✓</span>
                                                <?php echo esc_html($amenity); ?>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                        
                        <!-- Sidebar -->
                        <div class="lg:col-span-1">
                            <div class="bg-gray-50 p-6 rounded-lg sticky top-8">
                                <h3 class="text-xl font-bold mb-4"><?php _e('Contact Agent', 'future-homes-turkey'); ?></h3>
                                
                                <form id="property-contact-form" class="space-y-4">
                                    <div>
                                        <input type="text" name="name" placeholder="<?php esc_attr_e('Your Name', 'future-homes-turkey'); ?>" 
                                               class="w-full p-3 border border-gray-300 rounded-md" required>
                                    </div>
                                    <div>
                                        <input type="email" name="email" placeholder="<?php esc_attr_e('Your Email', 'future-homes-turkey'); ?>" 
                                               class="w-full p-3 border border-gray-300 rounded-md" required>
                                    </div>
                                    <div>
                                        <input type="tel" name="phone" placeholder="<?php esc_attr_e('Your Phone', 'future-homes-turkey'); ?>" 
                                               class="w-full p-3 border border-gray-300 rounded-md">
                                    </div>
                                    <div>
                                        <textarea name="message" rows="4" placeholder="<?php esc_attr_e('Your Message', 'future-homes-turkey'); ?>" 
                                                  class="w-full p-3 border border-gray-300 rounded-md"><?php printf(__('I am interested in %s', 'future-homes-turkey'), get_the_title()); ?></textarea>
                                    </div>
                                    <button type="submit" class="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
                                        <?php _e('Send Message', 'future-homes-turkey'); ?>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    <?php endwhile; ?>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('property-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            formData.append('action', 'property_contact');
            formData.append('property_id', '<?php echo get_the_ID(); ?>');
            formData.append('nonce', '<?php echo wp_create_nonce('fht_nonce'); ?>');
            
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('<?php _e('Thank you! Your message has been sent.', 'future-homes-turkey'); ?>');
                    contactForm.reset();
                } else {
                    alert('<?php _e('Something went wrong. Please try again.', 'future-homes-turkey'); ?>');
                }
            });
        });
    }
});
</script>

<?php get_footer(); ?>