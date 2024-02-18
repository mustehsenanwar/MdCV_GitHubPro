"use strict";

// Class definition
var KTSigninGeneral = function () {
    // Elements
    var form;
    var submitButton;
    var validator;

    // Handle form
    var handleValidation = function (e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'email': {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'The value is not a valid email address',
                            },
                            notEmpty: {
                                message: 'Email address is required'
                            }
                        }
                    },
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'The password is required'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',  // comment to enable invalid state icons
                        eleValidClass: '' // comment to enable valid state icons
                    })
                }
            }
        );
    }

    var handleSubmitDemo = function (e) {
        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    submitButton.disabled = true;


                    // Simulate ajax request
                    setTimeout(function () {
                        // Hide loading indication
                        submitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        submitButton.disabled = false;

                        // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                        Swal.fire({
                            text: "You have successfully logged in!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                form.querySelector('[name="email"]').value = "";
                                form.querySelector('[name="password"]').value = "";

                                //form.submit(); // submit form
                                var redirectUrl = form.getAttribute('data-kt-redirect-url');
                                if (redirectUrl) {
                                    location.href = redirectUrl;
                                }
                            }
                        });
                    }, 2000);
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        });
    }


//    var handleSubmitAjax = function (e) {
//        // Handle form submit
//        submitButton.addEventListener('click', function (e) {
//            // Prevent button default action
//            e.preventDefault();
//
//            // Validate form
//            validator.validate().then(function (status) {
//                if (status == 'Valid') {
//                    // Show loading indication
//                    submitButton.setAttribute('data-kt-indicator', 'on');
//
//                    // Disable button to avoid multiple click
//                    submitButton.disabled = true;
//
//                    // Check axios library docs: https://axios-http.com/docs/intro
//                    axios.post(submitButton.closest('form').getAttribute('action'), new FormData(form)).then(function (response) {
//                        if (response) {
//                            form.reset();
//
//                            // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
//                            Swal.fire({
//                                text: "You have successfully logged in!",
//                                icon: "success",
//                                buttonsStyling: false,
//                                confirmButtonText: "Ok, got it!",
//                                customClass: {
//                                    confirmButton: "btn btn-primary"
//                                }
//                            });
//
//                            const redirectUrl = form.getAttribute('data-kt-redirect-url');
//
//                            if (redirectUrl) {
//                                location.href = redirectUrl;
//                            }
//                        } else {
//                            // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
//                            Swal.fire({
//                                text: "Sorry, the email or password is incorrect, please try again.",
//                                icon: "error",
//                                buttonsStyling: false,
//                                confirmButtonText: "Ok, got it!",
//                                customClass: {
//                                    confirmButton: "btn btn-primary"
//                                }
//                            });
//                        }
//                    }).catch(function (error) {
//                        Swal.fire({
//                            text: "Sorry, looks like there are some errors detected, please try again.",
//                            icon: "error",
//                            buttonsStyling: false,
//                            confirmButtonText: "Ok, got it!",
//                            customClass: {
//                                confirmButton: "btn btn-primary"
//                            }
//                        });
//                    }).then(() => {
//                        // Hide loading indication
//                        submitButton.removeAttribute('data-kt-indicator');
//
//                        // Enable button
//                        submitButton.disabled = false;
//                    });
//                } else {
//                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
//                    Swal.fire({
//                        text: "Sorry, looks like there are some errors detected, please try again.",
//                        icon: "error",
//                        buttonsStyling: false,
//                        confirmButtonText: "Ok, got it!",
//                        customClass: {
//                            confirmButton: "btn btn-primary"
//                        }
//                    });
//                }
//            });
//        });
//    }




var handleSubmitAjax = function() {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from submitting through the browser

        validator.validate().then(function(status) {
            if (status == 'Valid') {
                submitButton.setAttribute('data-kt-indicator', 'on'); // Show loading indication
                submitButton.disabled = true; // Disable the button to prevent multiple clicks

                fetch(form.getAttribute('action'), {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest', // Important for Django to recognize it as an AJAX request
                        'X-CSRFToken': form.querySelector('[name="csrfmiddlewaretoken"]').value, // Include CSRF token
                    },
                })
                .then(response => response.json())
                .then(data => {
                    submitButton.removeAttribute('data-kt-indicator'); // Hide loading indication
                    submitButton.disabled = false; // Re-enable the button

                    if (data.success) {
                        Swal.fire({
                            text: "You have successfully logged in!",
                            icon: "success",
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(function(result) {
                            if (result.isConfirmed && data.redirect_url) {
                                window.location.href = data.redirect_url;
                            }
                        });
                    } else {
                        Swal.fire({
                            text: data.error || "An error occurred. Please try again.",
                            icon: "error",
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        text: "An error occurred. Please try again.",
                        icon: "error",
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                });
            } else {
                Swal.fire({
                    text: "Please correct the errors in the form and try again.",
                    icon: "error",
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                });
            }
        });
    });
};










// You can define handleResponse, handleError, handleFinally, and showValidationError functions to organize the code better.













//    var isValidUrl = function(url) {
//        try {
//            new URL(url);
//            return true;
//        } catch (e) {
//            return false;
//        }
//    }


//This is update by mustehsen. it check if url is relative or https it accept both as valid
var isValidUrl = function(url) {
    // Check if the URL is relative by looking for the absence of a scheme
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        return true;
    }

    // Attempt to construct a URL object for absolute URLs
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}








    // Public functions
    return {
        // Initialization
        init: function () {
            form = document.querySelector('#kt_sign_in_form');
            submitButton = document.querySelector('#kt_sign_in_submit');

            handleValidation();

            if (isValidUrl(submitButton.closest('form').getAttribute('action'))) {
                handleSubmitAjax(); // use for ajax submit
            } else {
                console.log(submitButton.closest('form').getAttribute('action'));  // Log the action URL
                console.log(isValidUrl(submitButton.closest('form').getAttribute('action')));  // Log the result of isValidUrl

                handleSubmitDemo(); // used for demo purposes only
            }
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTSigninGeneral.init();
});
