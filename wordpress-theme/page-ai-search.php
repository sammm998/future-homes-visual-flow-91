<?php
/*
Template Name: AI Property Search
*/
get_header(); ?>

<main id="main" class="main">
    <div class="container mx-auto px-4 py-8">
        <!-- Page Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <?php _e('AI Property Search', 'future-homes-turkey'); ?>
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                <?php _e('Tell us what you\'re looking for and our AI will help you find the perfect property', 'future-homes-turkey'); ?>
            </p>
        </div>
        
        <!-- AI Chat Interface -->
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <!-- Chat Header -->
                <div class="bg-blue-600 text-white p-4">
                    <h2 class="text-xl font-semibold"><?php _e('Property Assistant', 'future-homes-turkey'); ?></h2>
                    <p class="text-blue-100"><?php _e('Ask me anything about properties', 'future-homes-turkey'); ?></p>
                </div>
                
                <!-- Chat Messages -->
                <div id="chat-messages" class="h-96 overflow-y-auto p-4 space-y-4">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm">🤖</span>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-3 max-w-md">
                            <p><?php _e('Hello! I\'m here to help you find your perfect property. You can ask me about locations, prices, amenities, or any specific requirements you have.', 'future-homes-turkey'); ?></p>
                        </div>
                    </div>
                </div>
                
                <!-- Chat Input -->
                <div class="border-t p-4">
                    <form id="chat-form" class="flex space-x-3">
                        <input type="text" 
                               id="chat-input" 
                               placeholder="<?php esc_attr_e('Ask about properties...', 'future-homes-turkey'); ?>"
                               class="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               autocomplete="off">
                        <button type="submit" 
                                class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                            <?php _e('Send', 'future-homes-turkey'); ?>
                        </button>
                    </form>
                </div>
            </div>
            
            <!-- Quick Questions -->
            <div class="mt-8">
                <h3 class="text-lg font-semibold mb-4"><?php _e('Quick Questions', 'future-homes-turkey'); ?></h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-left transition-colors" 
                            data-question="<?php esc_attr_e('Show me properties under €500,000', 'future-homes-turkey'); ?>">
                        <div class="font-medium"><?php _e('Budget Properties', 'future-homes-turkey'); ?></div>
                        <div class="text-sm text-gray-600"><?php _e('Properties under €500,000', 'future-homes-turkey'); ?></div>
                    </button>
                    
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-left transition-colors" 
                            data-question="<?php esc_attr_e('I want a 3+ bedroom property in Antalya', 'future-homes-turkey'); ?>">
                        <div class="font-medium"><?php _e('Family Homes', 'future-homes-turkey'); ?></div>
                        <div class="text-sm text-gray-600"><?php _e('3+ bedrooms in Antalya', 'future-homes-turkey'); ?></div>
                    </button>
                    
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-left transition-colors" 
                            data-question="<?php esc_attr_e('Show me luxury properties in Dubai', 'future-homes-turkey'); ?>">
                        <div class="font-medium"><?php _e('Luxury Properties', 'future-homes-turkey'); ?></div>
                        <div class="text-sm text-gray-600"><?php _e('Premium Dubai properties', 'future-homes-turkey'); ?></div>
                    </button>
                    
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-left transition-colors" 
                            data-question="<?php esc_attr_e('Properties near the beach', 'future-homes-turkey'); ?>">
                        <div class="font-medium"><?php _e('Beachfront', 'future-homes-turkey'); ?></div>
                        <div class="text-sm text-gray-600"><?php _e('Properties near the beach', 'future-homes-turkey'); ?></div>
                    </button>
                    
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-left transition-colors" 
                            data-question="<?php esc_attr_e('Tell me about citizenship programs', 'future-homes-turkey'); ?>">
                        <div class="font-medium"><?php _e('Citizenship', 'future-homes-turkey'); ?></div>
                        <div class="text-sm text-gray-600"><?php _e('Investment citizenship info', 'future-homes-turkey'); ?></div>
                    </button>
                    
                    <button class="quick-question bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-left transition-colors" 
                            data-question="<?php esc_attr_e('What are the best investment opportunities?', 'future-homes-turkey'); ?>">
                        <div class="font-medium"><?php _e('Investment', 'future-homes-turkey'); ?></div>
                        <div class="text-sm text-gray-600"><?php _e('Best investment opportunities', 'future-homes-turkey'); ?></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    // Handle form submission
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        });
    }
    
    // Handle quick questions
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.dataset.question;
            sendMessage(question);
        });
    });
    
    function sendMessage(message) {
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Show typing indicator
        addTypingIndicator();
        
        // Send message to AI service
        fetch('<?php echo admin_url('admin-ajax.php'); ?>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                action: 'ai_property_search',
                message: message,
                nonce: '<?php echo wp_create_nonce('fht_nonce'); ?>'
            })
        })
        .then(response => response.json())
        .then(data => {
            removeTypingIndicator();
            if (data.success) {
                addMessageToChat(data.data.response, 'bot');
                
                // If properties are returned, display them
                if (data.data.properties && data.data.properties.length > 0) {
                    displayProperties(data.data.properties);
                }
            } else {
                addMessageToChat('<?php _e('Sorry, I couldn\'t process your request. Please try again.', 'future-homes-turkey'); ?>', 'bot');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessageToChat('<?php _e('Sorry, there was an error. Please try again.', 'future-homes-turkey'); ?>', 'bot');
        });
    }
    
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start space-x-3';
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex-1"></div>
                <div class="bg-blue-600 text-white rounded-lg p-3 max-w-md">
                    <p>${message}</p>
                </div>
                <div class="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm">👤</span>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm">🤖</span>
                </div>
                <div class="bg-gray-100 rounded-lg p-3 max-w-md">
                    <p>${message}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex items-start space-x-3';
        typingDiv.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">🤖</span>
            </div>
            <div class="bg-gray-100 rounded-lg p-3">
                <p class="text-gray-500"><?php _e('Typing...', 'future-homes-turkey'); ?></p>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function displayProperties(properties) {
        const propertiesDiv = document.createElement('div');
        propertiesDiv.className = 'flex items-start space-x-3 mt-4';
        propertiesDiv.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm">🤖</span>
            </div>
            <div class="bg-gray-100 rounded-lg p-3 max-w-full">
                <p class="mb-3"><?php _e('Here are some properties I found:', 'future-homes-turkey'); ?></p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${properties.map(property => `
                        <div class="bg-white rounded-lg p-4 shadow">
                            <h4 class="font-semibold mb-2">${property.title}</h4>
                            <p class="text-sm text-gray-600 mb-2">${property.location}</p>
                            <p class="font-bold text-blue-600 mb-2">${property.price}</p>
                            <a href="${property.url}" class="text-blue-600 hover:underline text-sm">
                                <?php _e('View Details', 'future-homes-turkey'); ?>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        chatMessages.appendChild(propertiesDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
</script>

<?php get_footer(); ?>