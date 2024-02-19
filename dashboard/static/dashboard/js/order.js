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
//$(document).on('click', "#kt_datatable_fixed_columns tbody tr td", function () {
//let $this = $(this);
//    let orderId = $(this).data('order-id'); // Assuming each <tr> has a data-order-id attribute
//
//    if (orderId) {
//        $.ajax({
//            url: '/dashboard/allorders/',
//            type: 'GET',
//            data: {'order_id': orderId},
//            headers: {'X-Requested-With': 'XMLHttpRequest'},
//            dataType: 'json',
//            success: function(response) {    // Make the clicked row 'active'
//            l(response)
//                $("#kt_datatable_fixed_columns tbody tr td").removeClass('active');
//                $this.addClass('active');
//
//                let $filesContainer = $('#kt_tab_pane_7');
//                   if (Array.isArray(response) && response.length > 0) {
//                        // Clear previous content in all containers
//                        $('#kt_tab_pane_8').html("");
//                        $('#kt_tab_pane_9').html("");
//                        //Responsive Data
//                        response.forEach(function(file) {
//                            let filePath = '/media/' + file.file,
//                                 fileElement;
//                                let fileExtension = filePath.split('.').pop().toLowerCase();
//                               if (fileExtension === 'pdf' && file.file_type === 'original_cv') {
//                                   filePath = filePath ? filePath : "";
//                                $('#kt_tab_pane_7').html(`<iframe id="pdfViewer" style="width: 100%; height: 500px;" src="${filePath}"></iframe>`)
//                                l("filePath" +filePath)
//                                l($filesContainer)
//                               }else{
//                                 $('#kt_tab_pane_7').html('<p>No original CV files found for this order.</p>');
//                               }
//
//                              if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png' || fileExtension === 'gif') {
//                                 fileElement = $('<img>').attr('src', filePath).addClass('img-fluid w-100');
//                                }else{
//                                 $('#kt_tab_pane_8').html('<p>No original picture files found for this order.</p>');
//                                }
//
//          if(file.file_type == "other"){
//          fileElement = $('<a>').attr('href', filePath).text('Download ' + file.file_type);
//          }else{
//                       $('#kt_tab_pane_9').html('<p>No other files found for this order.</p>');
//          }
//
//
//
//                            // Append the file element to the appropriate container based on file type
//                            if (file.file_type === 'original_pic') {
//                                $('#kt_tab_pane_8').append(fileElement);
//                            } else {
//                                $('#kt_tab_pane_9').append(fileElement);
//                            }
//                        });
//                   }
//            },
//        });
//    }
//
//
//
//
//
//});














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
                $otherFilesContainer = $('#kt_tab_pane_9');

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
                else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) && file.file_type === 'cover_letter') {
                    $coverLetterContainer.html(`<img src="${filePath}" alt="Cover Letter" class="img-fluid w-100">`);
                }

                // Other Files
                else if (file.file_type === 'other') {
                    $otherFilesContainer.html(`<a href="${filePath}" target="_blank">Download ${file.file_type}</a>`);
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
});





