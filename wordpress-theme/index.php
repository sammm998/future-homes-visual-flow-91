<?php get_header(); ?>

<main id="main" class="main">
    <?php if (have_posts()) : ?>
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <?php while (have_posts()) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-lg shadow-md overflow-hidden'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="aspect-w-16 aspect-h-9">
                                <?php the_post_thumbnail('medium', array('class' => 'w-full h-48 object-cover')); ?>
                            </div>
                        <?php endif; ?>
                        
                        <div class="p-6">
                            <h2 class="text-xl font-semibold mb-2">
                                <a href="<?php the_permalink(); ?>" class="text-gray-900 hover:text-blue-600 transition-colors">
                                    <?php the_title(); ?>
                                </a>
                            </h2>
                            
                            <div class="text-gray-600 mb-4">
                                <?php the_excerpt(); ?>
                            </div>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-500">
                                    <?php echo get_the_date(); ?>
                                </span>
                                <a href="<?php the_permalink(); ?>" class="text-blue-600 hover:text-blue-800 font-medium">
                                    <?php _e('Read More', 'future-homes-turkey'); ?>
                                </a>
                            </div>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>
            
            <div class="mt-8">
                <?php the_posts_pagination(array(
                    'prev_text' => __('Previous', 'future-homes-turkey'),
                    'next_text' => __('Next', 'future-homes-turkey'),
                )); ?>
            </div>
        </div>
    <?php else : ?>
        <div class="container mx-auto px-4 py-8 text-center">
            <h1 class="text-2xl font-bold mb-4"><?php _e('Nothing found', 'future-homes-turkey'); ?></h1>
            <p><?php _e('It looks like nothing was found at this location.', 'future-homes-turkey'); ?></p>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>