    <footer id="colophon" class="site-footer bg-gray-900 text-white">
        <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Company Info -->
                <div>
                    <h3 class="text-lg font-semibold mb-4"><?php bloginfo('name'); ?></h3>
                    <p class="text-gray-300 mb-4">
                        <?php echo get_option('blogdescription', __('Premium properties in Turkey, Dubai, Cyprus & France. Expert guidance, citizenship programs & luxury homes.', 'future-homes-turkey')); ?>
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-300 hover:text-white">Facebook</a>
                        <a href="#" class="text-gray-300 hover:text-white">Instagram</a>
                        <a href="#" class="text-gray-300 hover:text-white">LinkedIn</a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h4 class="text-lg font-semibold mb-4"><?php _e('Quick Links', 'future-homes-turkey'); ?></h4>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer',
                        'menu_class' => 'space-y-2',
                        'container' => false,
                        'fallback_cb' => false,
                    ));
                    ?>
                </div>

                <!-- Properties -->
                <div>
                    <h4 class="text-lg font-semibold mb-4"><?php _e('Properties', 'future-homes-turkey'); ?></h4>
                    <ul class="space-y-2 text-gray-300">
                        <li><a href="<?php echo esc_url(get_term_link('dubai', 'property_location')); ?>" class="hover:text-white"><?php _e('Dubai Properties', 'future-homes-turkey'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('antalya', 'property_location')); ?>" class="hover:text-white"><?php _e('Antalya Properties', 'future-homes-turkey'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('cyprus', 'property_location')); ?>" class="hover:text-white"><?php _e('Cyprus Properties', 'future-homes-turkey'); ?></a></li>
                        <li><a href="<?php echo esc_url(get_term_link('france', 'property_location')); ?>" class="hover:text-white"><?php _e('France Properties', 'future-homes-turkey'); ?></a></li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div>
                    <h4 class="text-lg font-semibold mb-4"><?php _e('Contact Info', 'future-homes-turkey'); ?></h4>
                    <div class="space-y-2 text-gray-300">
                        <div class="flex items-center">
                            <span class="mr-2">📞</span>
                            <a href="tel:+905388881881" class="hover:text-white">+90 538 888 18 81</a>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-2">✉️</span>
                            <a href="mailto:info@futurehomesturkey.com" class="hover:text-white">info@futurehomesturkey.com</a>
                        </div>
                        <div class="flex items-start">
                            <span class="mr-2">📍</span>
                            <span><?php _e('Antalya, Turkey', 'future-homes-turkey'); ?></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php _e('All rights reserved.', 'future-homes-turkey'); ?></p>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<!-- Currency Selector Script -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const currencyToggle = document.getElementById('currency-toggle');
    const currencyDropdown = document.getElementById('currency-dropdown');
    const currencyOptions = document.querySelectorAll('.currency-option');
    
    if (currencyToggle && currencyDropdown) {
        currencyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            currencyDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!currencyToggle.contains(e.target) && !currencyDropdown.contains(e.target)) {
                currencyDropdown.classList.add('hidden');
            }
        });
        
        // Handle currency selection
        currencyOptions.forEach(function(option) {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const currency = this.dataset.currency;
                
                // Set cookie
                document.cookie = `fht_currency=${currency}; path=/; max-age=31536000`;
                
                // Reload page to apply new currency
                window.location.reload();
            });
        });
    }
});
</script>

<?php wp_footer(); ?>
</body>
</html>