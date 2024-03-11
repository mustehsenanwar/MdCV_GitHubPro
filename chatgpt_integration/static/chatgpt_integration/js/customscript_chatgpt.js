// Function to adjust the height of the textarea to fit its content
function adjustTextareaHeight() {
    var textareas = document.querySelectorAll('.auto-height');
    textareas.forEach(function(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
}

// Function to update a prompt via AJAX
function updatePrompt(promptId) {
    var newText = document.getElementById('prompt_text_' + promptId).value;
    // Make AJAX request to update the prompt
    $.ajax({
        url: '/dashboard/chatgpt/', // Update this with your view URL
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), // Updated to fetch CSRF token dynamically
        },
        data: {
            action: 'update_prompt', // Specifying the action for the Django view
            prompt_id: promptId,
            new_text: newText,
        },
        success: function(response) {
            // Handle success response
            console.log('Prompt updated successfully');
        },
        error: function(xhr, errmsg, err) {
            // Handle error
            console.log('Error updating prompt');
        }
    });
}

// Function to delete a prompt via AJAX
function deletePrompt(promptId) {
    // Make AJAX request to delete the prompt
    $.ajax({
        url: '/dashboard/chatgpt/', // Update this with your view URL
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), // Updated to fetch CSRF token dynamically
        },
        data: {
            action: 'delete_prompt', // Specifying the action for the Django view
            prompt_id: promptId,
        },
        success: function(response) {
            // Handle success response
            console.log('Prompt deleted successfully');
        },
        error: function(xhr, errmsg, err) {
            // Handle error
            console.log('Error deleting prompt');
        }
    });
}

// Function to delete a category via AJAX
function deletePromptCategory(categoryId) {
    // Make AJAX request to delete the category
    $.ajax({
        url: '/dashboard/chatgpt/', // Update this with your view URL
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), // Updated to fetch CSRF token dynamically
        },
        data: {
            action: 'delete_category', // Specifying the action for the Django view
            category_id: categoryId,
        },
        success: function(response) {
            // Handle success response
            console.log('Category deleted successfully');
        },
        error: function(xhr, errmsg, err) {
            // Handle error
            console.log('Error deleting category');
        }
    });
}

// Helper function to get CSRF token from cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Event listener to adjust textarea height on page load
window.addEventListener('load', adjustTextareaHeight);

// Event listener to adjust textarea height on window resize
window.addEventListener('resize', adjustTextareaHeight);
