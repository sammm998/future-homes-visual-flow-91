<?php
/**
 * The template for displaying all single posts
 * 
 * @package Future_Homes_Turkey
 */

get_header(); ?>

<main class="container mx-auto px-4 py-8">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('max-w-4xl mx-auto'); ?>>
            <header class="post-header mb-8">
                <div class="post-meta text-sm text-gray-600 mb-4">
                    <span class="post-date"><?php echo get_the_date(); ?></span>
                    <?php if (has_category()) : ?>
                        <span class="post-categories ml-4">
                            <?php echo get_the_category_list(', '); ?>
                        </span>
                    <?php endif; ?>
                </div>
                
                <h1 class="text-4xl font-bold text-gray-900 mb-4"><?php the_title(); ?></h1>
                
                <?php if (has_post_thumbnail()) : ?>
                    <div class="featured-image mb-6">
                        <?php the_post_thumbnail('large', array('class' => 'w-full h-64 object-cover rounded-lg')); ?>
                    </div>
                <?php endif; ?>
            </header>

            <div class="post-content prose max-w-none">
                <?php
                the_content();
                wp_link_pages(array(
                    'before' => '<div class="page-links mt-6 pt-6 border-t border-gray-200">',
                    'after'  => '</div>',
                    'link_before' => '<span class="inline-block px-3 py-2 mx-1 bg-blue-600 text-white rounded">',
                    'link_after' => '</span>',
                ));
                ?>
            </div>

            <?php if (has_tag()) : ?>
                <div class="post-tags mt-8 pt-6 border-t border-gray-200">
                    <h3 class="text-lg font-semibold mb-3"><?php _e('Tags:', 'future-homes-turkey'); ?></h3>
                    <?php the_tags('<span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mr-2 mb-2">', '</span><span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mr-2 mb-2">', '</span>'); ?>
                </div>
            <?php endif; ?>

            <nav class="post-navigation mt-8 pt-6 border-t border-gray-200">
                <div class="flex justify-between">
                    <div class="prev-post">
                        <?php
                        $prev_post = get_previous_post();
                        if ($prev_post) :
                        ?>
                            <a href="<?php echo get_permalink($prev_post->ID); ?>" class="text-blue-600 hover:text-blue-800">
                                <span class="text-sm text-gray-600"><?php _e('Previous Post', 'future-homes-turkey'); ?></span>
                                <br>
                                <?php echo get_the_title($prev_post->ID); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                    <div class="next-post text-right">
                        <?php
                        $next_post = get_next_post();
                        if ($next_post) :
                        ?>
                            <a href="<?php echo get_permalink($next_post->ID); ?>" class="text-blue-600 hover:text-blue-800">
                                <span class="text-sm text-gray-600"><?php _e('Next Post', 'future-homes-turkey'); ?></span>
                                <br>
                                <?php echo get_the_title($next_post->ID); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </nav>

            <?php if (comments_open() || get_comments_number()) : ?>
                <div class="comments-section mt-12 pt-8 border-t border-gray-200">
                    <?php comments_template(); ?>
                </div>
            <?php endif; ?>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>