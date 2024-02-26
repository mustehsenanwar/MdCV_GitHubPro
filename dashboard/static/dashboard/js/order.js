l = console.log;

// DataTable init
$(window).on('load', function () {
    $("#kt_datatable_fixed_columns").DataTable({
        scrollY: "300px",
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: {
            left: 1
        }
    });
});



// Handle row click event to fetch and display order files
$(document).on('click', "#kt_datatable_fixed_columns tbody tr td", function () {
    let $this = $(this),
        orderId = $this.data('order-id');
    if (!orderId) return false;

    $.ajax({
        url: '/dashboard/allorders/',
        method: "GET",
        data: { 'order_id': orderId },
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        dataType: "json",
        success: function (response) {
            let $originalCVContainer = $('#kt_tab_pane_7'),
                $coverLetterContainer = $('#kt_tab_pane_8'),
                $otherFilesContainer = $('#kt_tab_pane_9').find(".row");
            $("#processOrderForm").find(`[name="order_id"]`).val(orderId);
            // Clear containers
            $originalCVContainer.empty();
            $coverLetterContainer.empty();
            $otherFilesContainer.empty();

            // Reset active class
            $("#kt_datatable_fixed_columns tbody tr td").removeClass('active');
            $this.addClass('active');

            // Handle empty response
            if (!response.length) {
                $originalCVContainer.html('<p>No original CV files found for this order.</p>');
                $coverLetterContainer.html('<p>No original picture files found for this order.</p>');
                $otherFilesContainer.html('<p>No other files found for this order.</p>');
                return false;
            }

            // Loop through files
            $.each(response, function (index, file) {
                let fileExtension = file.file.split('.').pop(),
                    filePath = '/media/' + file.file;
                // Original CV
                if (fileExtension === 'pdf' && file.file_type === 'original_cv') {
                    $originalCVContainer.html(`<iframe id="pdfViewer" style="width: 100%; height: 500px;" src="${filePath}"></iframe>`);
                }

                // Cover Letter
                if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) && file.file_type === 'original_pic') {
                    l($coverLetterContainer)
                    $coverLetterContainer.html(`<img src="${filePath}" alt="Cover Letter" class="img-fluid w-100">`);
                }
                // Other Files
                if (file.file_type === 'other') {
                    if (fileExtension === 'pdf') {
                        $otherFilesContainer.append(`<div class="col-md-4 other-view-details"><div class="card cp">
                        <iframe id="pdfViewer" style="width: 100%; height: 500px;" src="${filePath}"></iframe>
                        <i class="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewOtherDetails"></i>
                    </div></div>`);
                    } else {
                        $otherFilesContainer.append(`<div class="col-md-4 other-view-details" ><div class="card cp">
                            <img class="card-img-top" src="${filePath}" alt="Other">
                            <i class="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewOtherDetails"></i>
                        </div></div>`);
                    }
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
});

// Default click on first cell
$(window).on('load', function () {
    let $table = $(".order-processing-container #kt_datatable_fixed_columns"),
        $firstRow = $table.find("tbody tr").first(),
        $firstCell = $firstRow.find("td").first();
    $firstCell.click();
});

// view other details
$(document).on('click', ".other-view-details i", function () {
    let $parent = $(this).closest('.other-view-details'),
        $iframe = $parent.find('iframe'),
        $img = $parent.find('img');
    $modalBody = $('#viewOtherDetails .modal-body');
    $modalBody.empty();
    if ($iframe.length) {
        $modalBody.html($iframe.clone());
    } else if ($img.length) {
        $modalBody.html($img.clone());
    }
});


$(document).on('submit', '#processOrderForm', function (e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);

    $.ajax({
        url: '/dashboard/allorders/', // Update this URL to the one configured for processing orders
        type: 'POST',
        data: formData,
        processData: false, // Important: Don't process the files
        contentType: false, // Important: Set content type to false
        headers: {
            'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val(),
            'X-Requested-With': 'XMLHttpRequest'
        },
        success: function (response) {
            if (response.status === 'success') {
                window.location.href = response.redirect_url; // Redirect to the URL provided by the server
            } else {
                alert(response.message); // Show an error message
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
});