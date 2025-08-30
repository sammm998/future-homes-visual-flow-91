<?php
/*
Template Name: Property Wizard
*/
get_header(); ?>

<main id="main" class="main">
    <div class="container mx-auto px-4 py-8">
        <!-- Page Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <?php _e('Property Finder Wizard', 'future-homes-turkey'); ?>
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                <?php _e('Answer a few questions and we\'ll help you find your perfect property', 'future-homes-turkey'); ?>
            </p>
        </div>
        
        <!-- Wizard Form -->
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <!-- Progress Bar -->
                <div class="bg-blue-600 p-4">
                    <div class="flex justify-between items-center text-white mb-2">
                        <span><?php _e('Step', 'future-homes-turkey'); ?> <span id="current-step">1</span> <?php _e('of', 'future-homes-turkey'); ?> <span id="total-steps">6</span></span>
                        <span id="progress-percentage">17%</span>
                    </div>
                    <div class="w-full bg-blue-800 rounded-full h-2">
                        <div id="progress-bar" class="bg-white h-2 rounded-full transition-all duration-300" style="width: 17%"></div>
                    </div>
                </div>
                
                <form id="property-wizard-form" class="p-8">
                    <!-- Step 1: Budget -->
                    <div class="wizard-step active" data-step="1">
                        <h2 class="text-2xl font-bold mb-6"><?php _e('What\'s your budget?', 'future-homes-turkey'); ?></h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label class="budget-option cursor-pointer">
                                <input type="radio" name="budget" value="under-250k" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">💰</div>
                                    <div class="font-semibold"><?php _e('Under €250,000', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Budget-friendly options', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="budget-option cursor-pointer">
                                <input type="radio" name="budget" value="250k-500k" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏠</div>
                                    <div class="font-semibold"><?php _e('€250,000 - €500,000', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Mid-range properties', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="budget-option cursor-pointer">
                                <input type="radio" name="budget" value="500k-1m" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏡</div>
                                    <div class="font-semibold"><?php _e('€500,000 - €1,000,000', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Premium properties', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="budget-option cursor-pointer">
                                <input type="radio" name="budget" value="over-1m" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏰</div>
                                    <div class="font-semibold"><?php _e('Over €1,000,000', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Luxury properties', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Step 2: Location -->
                    <div class="wizard-step" data-step="2">
                        <h2 class="text-2xl font-bold mb-6"><?php _e('Where would you like to buy?', 'future-homes-turkey'); ?></h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label class="location-option cursor-pointer">
                                <input type="radio" name="location" value="turkey" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🇹🇷</div>
                                    <div class="font-semibold"><?php _e('Turkey', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Antalya, Istanbul, Bodrum', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="location-option cursor-pointer">
                                <input type="radio" name="location" value="dubai" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🇦🇪</div>
                                    <div class="font-semibold"><?php _e('Dubai', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Modern luxury living', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="location-option cursor-pointer">
                                <input type="radio" name="location" value="cyprus" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🇨🇾</div>
                                    <div class="font-semibold"><?php _e('Cyprus', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Mediterranean lifestyle', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="location-option cursor-pointer">
                                <input type="radio" name="location" value="france" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🇫🇷</div>
                                    <div class="font-semibold"><?php _e('France', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('European elegance', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Step 3: Property Type -->
                    <div class="wizard-step" data-step="3">
                        <h2 class="text-2xl font-bold mb-6"><?php _e('What type of property?', 'future-homes-turkey'); ?></h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label class="property-type-option cursor-pointer">
                                <input type="radio" name="property_type" value="apartment" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏢</div>
                                    <div class="font-semibold"><?php _e('Apartment', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="property-type-option cursor-pointer">
                                <input type="radio" name="property_type" value="villa" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏡</div>
                                    <div class="font-semibold"><?php _e('Villa', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="property-type-option cursor-pointer">
                                <input type="radio" name="property_type" value="townhouse" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏘️</div>
                                    <div class="font-semibold"><?php _e('Townhouse', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Step 4: Bedrooms -->
                    <div class="wizard-step" data-step="4">
                        <h2 class="text-2xl font-bold mb-6"><?php _e('How many bedrooms?', 'future-homes-turkey'); ?></h2>
                        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <?php for ($i = 1; $i <= 5; $i++) : ?>
                                <label class="bedroom-option cursor-pointer">
                                    <input type="radio" name="bedrooms" value="<?php echo $i; ?>" class="sr-only">
                                    <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                        <div class="text-2xl mb-2">🛏️</div>
                                        <div class="font-semibold"><?php echo $i; ?><?php echo $i == 5 ? '+' : ''; ?></div>
                                    </div>
                                </label>
                            <?php endfor; ?>
                        </div>
                    </div>
                    
                    <!-- Step 5: Purpose -->
                    <div class="wizard-step" data-step="5">
                        <h2 class="text-2xl font-bold mb-6"><?php _e('What\'s your main purpose?', 'future-homes-turkey'); ?></h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label class="purpose-option cursor-pointer">
                                <input type="radio" name="purpose" value="investment" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">📈</div>
                                    <div class="font-semibold"><?php _e('Investment', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Generate rental income', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="purpose-option cursor-pointer">
                                <input type="radio" name="purpose" value="residence" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏠</div>
                                    <div class="font-semibold"><?php _e('Primary Residence', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Live in the property', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="purpose-option cursor-pointer">
                                <input type="radio" name="purpose" value="vacation" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🏖️</div>
                                    <div class="font-semibold"><?php _e('Vacation Home', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Holiday getaway', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                            
                            <label class="purpose-option cursor-pointer">
                                <input type="radio" name="purpose" value="citizenship" class="sr-only">
                                <div class="border-2 border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                    <div class="text-2xl mb-2">🌍</div>
                                    <div class="font-semibold"><?php _e('Citizenship', 'future-homes-turkey'); ?></div>
                                    <div class="text-sm text-gray-600"><?php _e('Investment citizenship', 'future-homes-turkey'); ?></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Step 6: Contact Info -->
                    <div class="wizard-step" data-step="6">
                        <h2 class="text-2xl font-bold mb-6"><?php _e('Get Your Personalized Results', 'future-homes-turkey'); ?></h2>
                        <div class="max-w-md mx-auto space-y-4">
                            <div>
                                <label for="wizard-name" class="block text-sm font-medium mb-2"><?php _e('Full Name', 'future-homes-turkey'); ?></label>
                                <input type="text" id="wizard-name" name="name" required
                                       class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            
                            <div>
                                <label for="wizard-email" class="block text-sm font-medium mb-2"><?php _e('Email Address', 'future-homes-turkey'); ?></label>
                                <input type="email" id="wizard-email" name="email" required
                                       class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            
                            <div>
                                <label for="wizard-phone" class="block text-sm font-medium mb-2"><?php _e('Phone Number', 'future-homes-turkey'); ?></label>
                                <input type="tel" id="wizard-phone" name="phone"
                                       class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            
                            <div class="flex items-start">
                                <input type="checkbox" id="wizard-consent" name="consent" required class="mt-1 mr-2">
                                <label for="wizard-consent" class="text-sm text-gray-600">
                                    <?php _e('I agree to receive property recommendations and updates from Future Homes Turkey.', 'future-homes-turkey'); ?>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation Buttons -->
                    <div class="flex justify-between items-center mt-8 pt-6 border-t">
                        <button type="button" id="prev-step" class="bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium" style="display: none;">
                            <?php _e('Previous', 'future-homes-turkey'); ?>
                        </button>
                        
                        <div></div>
                        
                        <button type="button" id="next-step" class="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
                            <?php _e('Next', 'future-homes-turkey'); ?>
                        </button>
                        
                        <button type="submit" id="submit-wizard" class="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium" style="display: none;">
                            <?php _e('Get My Results', 'future-homes-turkey'); ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('property-wizard-form');
    const steps = document.querySelectorAll('.wizard-step');
    const nextButton = document.getElementById('next-step');
    const prevButton = document.getElementById('prev-step');
    const submitButton = document.getElementById('submit-wizard');
    const currentStepSpan = document.getElementById('current-step');
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // Handle radio button selections
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Update visual selection
            const parent = this.closest('.wizard-step');
            parent.querySelectorAll('.border-blue-500').forEach(el => {
                el.classList.remove('border-blue-500', 'bg-blue-50');
                el.classList.add('border-gray-200');
            });
            
            const selectedDiv = this.parentElement.querySelector('div');
            selectedDiv.classList.remove('border-gray-200');
            selectedDiv.classList.add('border-blue-500', 'bg-blue-50');
        });
    });
    
    // Next button
    nextButton.addEventListener('click', function() {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStep();
            }
        }
    });
    
    // Previous button
    prevButton.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateCurrentStep()) {
            const formData = new FormData(this);
            formData.append('action', 'property_wizard_submit');
            formData.append('nonce', '<?php echo wp_create_nonce('fht_nonce'); ?>');
            
            submitButton.disabled = true;
            submitButton.textContent = '<?php _e('Processing...', 'future-homes-turkey'); ?>';
            
            fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to results page
                    window.location.href = data.data.redirect_url;
                } else {
                    alert('<?php _e('Something went wrong. Please try again.', 'future-homes-turkey'); ?>');
                    submitButton.disabled = false;
                    submitButton.textContent = '<?php _e('Get My Results', 'future-homes-turkey'); ?>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('<?php _e('Something went wrong. Please try again.', 'future-homes-turkey'); ?>');
                submitButton.disabled = false;
                submitButton.textContent = '<?php _e('Get My Results', 'future-homes-turkey'); ?>';
            });
        }
    });
    
    function updateStep() {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        currentStepElement.classList.add('active');
        currentStepElement.style.display = 'block';
        
        // Update progress
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = progress + '%';
        progressPercentage.textContent = Math.round(progress) + '%';
        currentStepSpan.textContent = currentStep;
        
        // Update buttons
        prevButton.style.display = currentStep > 1 ? 'block' : 'none';
        nextButton.style.display = currentStep < totalSteps ? 'block' : 'none';
        submitButton.style.display = currentStep === totalSteps ? 'block' : 'none';
    }
    
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        
        if (currentStep < totalSteps) {
            // Check if a radio button is selected
            const radios = currentStepElement.querySelectorAll('input[type="radio"]');
            const isSelected = Array.from(radios).some(radio => radio.checked);
            
            if (!isSelected) {
                alert('<?php _e('Please make a selection to continue.', 'future-homes-turkey'); ?>');
                return false;
            }
        } else {
            // Validate contact form
            const requiredFields = currentStepElement.querySelectorAll('input[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('border-red-500');
                    isValid = false;
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (!isValid) {
                alert('<?php _e('Please fill in all required fields.', 'future-homes-turkey'); ?>');
                return false;
            }
        }
        
        return true;
    }
    
    // Initialize
    updateStep();
});
</script>

<?php get_footer(); ?>