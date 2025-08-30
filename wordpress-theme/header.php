<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    
    <?php wp_head(); ?>
    
    <!-- Anti-translation styles for currency codes -->
    <style>
        .currency-code {
            font-feature-settings: "tnum";
            font-variant-numeric: tabular-nums;
            text-transform: none !important;
            -webkit-text-fill-color: currentColor !important;
            unicode-bidi: isolate;
            white-space: nowrap;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace !important;
        }
        
        .notranslate {
            -webkit-transform: none !important;
            transform: none !important;
        }
        
        .goog-te-banner-frame.skiptranslate {
            display: none !important;
        }
        
        body {
            top: 0 !important;
        }
    </style>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <!-- Skip link for accessibility -->
    <a class="skip-link screen-reader-text" href="#main">
        <?php _e('Skip to content', 'future-homes-turkey'); ?>
    </a>

    <!-- Top Contact Bar -->
    <div class="bg-gray-100 py-2 text-sm border-b">
        <div class="container mx-auto px-4">
            <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <div class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4">
                    <a href="tel:+905388881881" class="text-gray-700 hover:text-blue-600 flex items-center">
                        <span class="mr-2">📞</span>
                        +90 538 888 18 81
                    </a>
                    <a href="mailto:info@futurehomesturkey.com" class="text-gray-700 hover:text-blue-600 flex items-center">
                        <span class="mr-2">✉️</span>
                        info@futurehomesturkey.com
                    </a>
                </div>
                
                <div class="flex items-center space-x-4">
                    <!-- Currency Selector -->
                    <div class="currency-selector relative">
                        <button id="currency-toggle" class="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors min-w-[60px]">
                            <span class="font-medium text-xs currency-code notranslate" 
                                  lang="en" 
                                  translate="no"
                                  data-translate="no"
                                  data-testid="currency-code">
                                <?php echo esc_html(fht_get_current_currency()); ?>
                            </span>
                            <span class="ml-1">▼</span>
                        </button>
                        
                        <div id="currency-dropdown" class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px] hidden">
                            <div class="py-1">
                                <?php foreach (fht_get_currencies() as $code => $currency) : ?>
                                    <button class="currency-option w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors <?php echo $code === fht_get_current_currency() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'; ?>"
                                            data-currency="<?php echo esc_attr($code); ?>">
                                        <span class="font-medium text-xs currency-code notranslate" 
                                              lang="en" 
                                              translate="no"
                                              data-translate="no"
                                              data-testid="currency-code">
                                            <?php echo esc_html($code); ?>
                                        </span>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Social Links -->
                    <div class="flex space-x-2">
                        <a href="#" class="text-gray-600 hover:text-blue-600">Facebook</a>
                        <a href="#" class="text-gray-600 hover:text-blue-600">Instagram</a>
                        <a href="#" class="text-gray-600 hover:text-blue-600">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Navigation -->
    <header id="masthead" class="site-header bg-white shadow-sm sticky top-0 z-40">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <!-- Logo -->
                <div class="flex items-center">
                    <?php if (has_custom_logo()) : ?>
                        <?php the_custom_logo(); ?>
                    <?php else : ?>
                        <h1 class="text-xl font-bold text-gray-900">
                            <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                                <?php bloginfo('name'); ?>
                            </a>
                        </h1>
                    <?php endif; ?>
                </div>

                <!-- Desktop Navigation -->
                <nav class="hidden lg:block">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'menu_class' => 'flex space-x-8',
                        'container' => false,
                        'walker' => new FHT_Walker_Nav_Menu(),
                        'fallback_cb' => false,
                    ));
                    ?>
                </nav>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-toggle" class="lg:hidden text-gray-700 hover:text-blue-600">
                    <span class="sr-only"><?php _e('Toggle menu', 'future-homes-turkey'); ?></span>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <nav id="mobile-menu" class="lg:hidden bg-white border-t border-gray-200 hidden">
            <div class="container mx-auto px-4 py-4">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'mobile',
                    'menu_class' => 'space-y-2',
                    'container' => false,
                    'fallback_cb' => false,
                ));
                ?>
            </div>
        </nav>
    </header>