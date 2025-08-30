<?php
/**
 * The template for displaying all pages
 * 
 * @package Future_Homes_Turkey
 */

get_header(); ?>

<main class="container mx-auto px-4 py-8">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('max-w-4xl mx-auto'); ?>>
            <header class="page-header mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4"><?php the_title(); ?></h1>
                <?php if (has_post_thumbnail()) : ?>
                    <div class="featured-image mb-6">
                        <?php the_post_thumbnail('large', array('class' => 'w-full h-64 object-cover rounded-lg')); ?>
                    </div>
                <?php endif; ?>
            </header>

            <div class="page-content prose max-w-none">
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

            <?php if (comments_open() || get_comments_number()) : ?>
                <div class="comments-section mt-12 pt-8 border-t border-gray-200">
                    <?php comments_template(); ?>
                </div>
            <?php endif; ?>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>