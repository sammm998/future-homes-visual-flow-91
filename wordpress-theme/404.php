<?php
/**
 * The template for displaying 404 pages (not found)
 * 
 * @package Future_Homes_Turkey
 */

get_header(); ?>

<main class="container mx-auto px-4 py-16">
    <div class="text-center max-w-2xl mx-auto">
        <div class="mb-8">
            <h1 class="text-8xl font-bold text-gray-300 mb-4">404</h1>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
                <?php _e('Page Not Found', 'future-homes-turkey'); ?>
            </h2>
            <p class="text-lg text-gray-600 mb-8">
                <?php _e('Sorry, the page you are looking for doesn\'t exist or has been moved.', 'future-homes-turkey'); ?>
            </p>
        </div>

        <!-- Search Form -->
        <div class="mb-8">
            <form role="search" method="get" action="<?php echo home_url('/'); ?>" class="max-w-md mx-auto">
                <div class="flex">
                    <input type="search" 
                           name="s" 
                           placeholder="<?php _e('Search...', 'future-homes-turkey'); ?>"
                           value="<?php echo get_search_query(); ?>"
                           class="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button type="submit" 
                            class="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <?php _e('Search', 'future-homes-turkey'); ?>
                    </button>
                </div>
            </form>
        </div>

        <!-- Navigation Options -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-xl font-semibold mb-4"><?php _e('Browse Properties', 'future-homes-turkey'); ?></h3>
                <p class="text-gray-600 mb-4">
                    <?php _e('Explore our latest property listings in Turkey, Dubai, Cyprus, and France.', 'future-homes-turkey'); ?>
                </p>
                <a href="<?php echo get_post_type_archive_link('property'); ?>" 
                   class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <?php _e('View Properties', 'future-homes-turkey'); ?>
                </a>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-xl font-semibold mb-4"><?php _e('Contact Us', 'future-homes-turkey'); ?></h3>
                <p class="text-gray-600 mb-4">
                    <?php _e('Get in touch with our expert team for personalized assistance.', 'future-homes-turkey'); ?>
                </p>
                <a href="<?php echo home_url('/contact'); ?>" 
                   class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <?php _e('Contact Us', 'future-homes-turkey'); ?>
                </a>
            </div>
        </div>

        <!-- Recent Properties -->
        <?php
        $recent_properties = new WP_Query(array(
            'post_type' => 'property',
            'posts_per_page' => 3,
            'post_status' => 'publish'
        ));

        if ($recent_properties->have_posts()) :
        ?>
            <div class="mb-8">
                <h3 class="text-2xl font-bold mb-6"><?php _e('Recent Properties', 'future-homes-turkey'); ?></h3>
                <div class="grid md:grid-cols-3 gap-6">
                    <?php while ($recent_properties->have_posts()) : $recent_properties->the_post(); ?>
                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <?php if (has_post_thumbnail()) : ?>
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('medium', array('class' => 'w-full h-32 object-cover')); ?>
                                </a>
                            <?php endif; ?>
                            <div class="p-4">
                                <h4 class="font-semibold mb-2">
                                    <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-blue-600">
                                        <?php the_title(); ?>
                                    </a>
                                </h4>
                                <p class="text-sm text-gray-600"><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
                            </div>
                        </div>
                    <?php endwhile; ?>
                </div>
            </div>
            <?php wp_reset_postdata(); ?>
        <?php endif; ?>

        <a href="<?php echo home_url(); ?>" 
           class="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
            <?php _e('Back to Homepage', 'future-homes-turkey'); ?>
        </a>
    </div>
</main>

<?php get_footer(); ?>