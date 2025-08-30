<?php
/**
 * The template for displaying search results pages
 * 
 * @package Future_Homes_Turkey
 */

get_header(); ?>

<main class="container mx-auto px-4 py-8">
    <header class="search-header mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
            <?php printf(__('Search Results for: %s', 'future-homes-turkey'), '<span class="text-blue-600">' . get_search_query() . '</span>'); ?>
        </h1>
        
        <?php if (have_posts()) : ?>
            <p class="text-gray-600">
                <?php printf(_n('Found %s result', 'Found %s results', $wp_query->found_posts, 'future-homes-turkey'), $wp_query->found_posts); ?>
            </p>
        <?php endif; ?>
    </header>

    <!-- Search Form -->
    <div class="search-form-wrapper mb-8 p-6 bg-gray-50 rounded-lg">
        <form role="search" method="get" action="<?php echo home_url('/'); ?>">
            <div class="flex max-w-md">
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

    <?php if (have_posts()) : ?>
        <div class="search-results">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('search-result mb-8 p-6 bg-white rounded-lg shadow-md'); ?>>
                    <header class="result-header mb-4">
                        <h2 class="text-xl font-semibold mb-2">
                            <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-blue-600">
                                <?php the_title(); ?>
                            </a>
                        </h2>
                        
                        <div class="result-meta text-sm text-gray-600 mb-2">
                            <span class="post-type">
                                <?php
                                $post_type_obj = get_post_type_object(get_post_type());
                                echo $post_type_obj->labels->singular_name;
                                ?>
                            </span>
                            <span class="post-date ml-4"><?php echo get_the_date(); ?></span>
                            <?php if (get_post_type() === 'property') : ?>
                                <?php
                                $location_terms = get_the_terms(get_the_ID(), 'property_location');
                                if ($location_terms && !is_wp_error($location_terms)) :
                                ?>
                                    <span class="property-location ml-4">
                                        <?php echo $location_terms[0]->name; ?>
                                    </span>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>
                    </header>

                    <div class="result-content">
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="result-thumbnail float-left mr-4 mb-4">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('thumbnail', array('class' => 'w-24 h-24 object-cover rounded')); ?>
                                </a>
                            </div>
                        <?php endif; ?>

                        <div class="result-excerpt">
                            <?php the_excerpt(); ?>
                        </div>

                        <?php if (get_post_type() === 'property') : ?>
                            <div class="property-details mt-4 p-4 bg-gray-50 rounded">
                                <?php
                                $price = get_post_meta(get_the_ID(), '_price', true);
                                $bedrooms = get_post_meta(get_the_ID(), '_bedrooms', true);
                                $area = get_post_meta(get_the_ID(), '_area', true);
                                ?>
                                <div class="flex flex-wrap gap-4 text-sm">
                                    <?php if ($price) : ?>
                                        <span class="font-semibold">
                                            <?php echo fht_format_price(fht_convert_price($price, 'EUR', fht_get_current_currency())); ?>
                                        </span>
                                    <?php endif; ?>
                                    <?php if ($bedrooms) : ?>
                                        <span><?php echo $bedrooms; ?> <?php _e('bedrooms', 'future-homes-turkey'); ?></span>
                                    <?php endif; ?>
                                    <?php if ($area) : ?>
                                        <span><?php echo $area; ?> m²</span>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endif; ?>

                        <div class="clearfix"></div>
                    </div>

                    <footer class="result-footer mt-4">
                        <a href="<?php the_permalink(); ?>" class="text-blue-600 hover:text-blue-800 font-medium">
                            <?php _e('Read More', 'future-homes-turkey'); ?> →
                        </a>
                    </footer>
                </article>
            <?php endwhile; ?>

            <!-- Pagination -->
            <div class="search-pagination mt-8">
                <?php
                the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => __('← Previous', 'future-homes-turkey'),
                    'next_text' => __('Next →', 'future-homes-turkey'),
                    'class' => 'pagination-list flex justify-center space-x-2'
                ));
                ?>
            </div>
        </div>

    <?php else : ?>
        <div class="no-results text-center py-12">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
                <?php _e('Nothing found', 'future-homes-turkey'); ?>
            </h2>
            <p class="text-gray-600 mb-8">
                <?php _e('Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'future-homes-turkey'); ?>
            </p>

            <!-- Suggestions -->
            <div class="suggestions grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-3"><?php _e('Browse Properties', 'future-homes-turkey'); ?></h3>
                    <a href="<?php echo get_post_type_archive_link('property'); ?>" 
                       class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        <?php _e('View All Properties', 'future-homes-turkey'); ?>
                    </a>
                </div>
                
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-3"><?php _e('Contact Us', 'future-homes-turkey'); ?></h3>
                    <a href="<?php echo home_url('/contact'); ?>" 
                       class="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        <?php _e('Get Help', 'future-homes-turkey'); ?>
                    </a>
                </div>
            </div>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>