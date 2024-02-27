let l = console.log;

// Document ready
$(document).ready(function () {
    $(".step-progress-bar-container .owl-item").first().addClass("panel-active");
});


// active step or prev step add class  "bar-active"
$(document).on('click', ".step-progress-bar-container .owl-item", function () {
    $(".owl-item").removeClass("bar-active");
    $(".owl-item").removeClass("panel-active");
    $(this).addClass("bar-active").prevAll().addClass("bar-active");
    $(this).addClass("panel-active").prevAll().addClass("panel-active");
    $(".step-progress-bar-container .owl-item.panel-active").last().removeClass("bar-active");
    // panel show
    let $target = $(this).find(".step").attr("data-target");
    $sidebarContainer = $(".editor-sidebar-content");
    $sidebarContainer.find(".content-header").removeClass("active");
    $sidebarContainer.find(`.content-header[data-panel="${$target}"]`).addClass("active");
});


$('.owl-carousel').owlCarousel({
    loop: false,
    margin: 10,
    responsiveClass: true,
    responsive: {
        0: {
            items: 2,
            nav: true
        },
        600: {
            items: 5,
            nav: false
        },
        1000: {
            items: 8,
            nav: true,
            loop: false
        }
    }
});

// Print CV
function printCV() {
    let $cloned = $(".viewer .wrapper").clone(),
        $cvContent = $cloned.find(".cvContent"),
        $userImg = $cvContent.find(".user_img"),
        fontSize = $cvContent.data("pdf") * 0.99;
    $cvContent.css("font-size", $cvContent.attr("data-pdf") + "pt");
    $userImg.css("width", $userImg.attr("data-pdf") + "px");
    $userImg.css("height", $userImg.attr("data-pdf") + "px")

    html = $cloned.html();
    $('html').get(0).style.setProperty('--cv-print-font-size', fontSize + "pt");
    $("body").addClass("printing");
    print();
}

// Print
$(document).on('change', ".preview-btn-control input", function () {
    let isChecked = $(this).is(":checked");
    if (!isChecked) return false;
    printCV();
});


// Contact fields fill
$(document).on('change input', ".cv-input", function () {
    let $this = $(this),
        target = $this.attr("data-target"),
        value = $this.val();
    let $cvContent = $(".cvContent")
    $cvContent.find(`[data-setVal="${target}"]`).text(value);
    l($cvContent.find(`[data-setVal="${target}"]`))
});

// change cv images
$(document).on('change', '#file-upload', function () {
    var fileInput = $(this)[0];
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            let image = e.target.result;
            $(".cvContent").find(".user-img img").attr("src", image);
            $(".editor-sidebar-content").find(".user-img img").attr("src", image).removeClass("d-none");
            $(".editor-sidebar-content").find(".user-img i").addClass("d-none");
        }

        reader.readAsDataURL(fileInput.files[0]);
    }
    // modal hide
    $('.close-window-popup').trigger("click");
});


$(document).ready(function () {
    $('.carousel-control-next').click(function () {
        $('#cvEditorCarousel').carousel('next');
        setTimeout(() => {
            let target = $('#cvEditorCarousel').find(".carousel-item.active").data("panel");
            $(".progress-bar").find(`[data-target="${target}"]`).trigger("click");
            l($(".progress-bar").find(`[data-target="${target}"]`))
        }, 1000);
        return false;
    });

    $('.carousel-control-prev').click(function () {
        $('#cvEditorCarousel').carousel('prev');
        setTimeout(() => {
            let target = $('#cvEditorCarousel').find(".carousel-item.active").data("panel");
            $(".progress-bar").find(`[data-target="${target}"]`).trigger("click");
            l($(".progress-bar").find(`[data-target="${target}"]`))
        }, 1000);
        return false;
    });

    // tinymce editor
    tinymce.init({
        selector: "#kt_docs_tinymce_basic", height: "480"
    });
});


// Add Skill button
$(document).on("click", ".add-skill-btn", function () {
    let $parent = $(this).parents(".skill-container");
    let skillHTML =
        `<div class="skill-item mb-3">
            <div class="left">
                <div class="form-item mb-0">
                    <input type="text" id="skill" autocomplete="off"
                        placeholder="Skill">
                    <label for="username">Skill</label>
                </div>
            </div>
            <div class="right d-flex">
                <input type="range" class="w-100">
                <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-skill"></i>
            </div>
        </div>`;
    $parent.find(".skill-item-container").append(skillHTML);
})


// Remove Single Skill
$(document).on("click", ".delete-single-skill", function () {
    let $parent = $(this).parents(".skill-item");
    $parent.remove();
});

// collapse field
$(document).on("click", ".collapse-field .icon", function () {
    let $parent = $(this).parents(".collapse-field-container"),
        text = $parent.data("text");
    $parent.addClass("d-none");
    $(".collapse-field-items-container").append(`<div class="field-item" data-text="${text}">
                                                    <i class="fa fa-plus"></i>
                                                    <span class="pl-2">${text}</span>
                                                </div>`);
    // CV profile itemm
    let $profileInfo = $(".cvContent").find(".perInfo");
    $profileInfo.find(`.item[data-text="${text}"]`).addClass("d-none");
});

// Show collapse field
$(document).on("click", ".collapse-field-items-container .field-item", function () {
    let text = $(this).data("text");
    $(`.collapse-field-container[data-text="${text}"]`).removeClass("d-none");
    $(this).remove();
    // CV profile itemm
    let $profileInfo = $(".cvContent").find(".perInfo");
    $profileInfo.find(`.item[data-text="${text}"]`).removeClass("d-none");
});

// Resume fill value
$(document).on("change input", ".input-fill-value", function () {
    let section = $(this).data("section"),
        target = $(this).data("fill"),
        value = $(this).val();
    l(section, target, value);
    let $cvContent = $(".cvContent");
    $cvContent.find(`.section.${section} .item[data-edit="${target}"]`).text(value);
    l($cvContent.find(`.section.${section} .item[data-edit="${target}"]`))
});



// function fetchResumeData() {
//     // Retrieve the order ID from your HTML, e.g., from a hidden input or another element
//     let orderId = $("#orderId").val();  // Make sure the element with id="orderId" exists in your HTML

//     // Construct the URL to which the data should be sent
//     let url = "/dashboard/resumebuilder/" + orderId + "/";

//     // Sample data to be sent to the server
//     let dataToSend = {
//         "Name": "Sohail"  // Replace this with actual data you want to send
//     };

//     // AJAX request
//     $.ajax({
//         url: url,  // URL constructed above
//         type: "POST",  // Use POST method
//         contentType: "application/json",  // Indicate that the data sent is JSON
//         data: JSON.stringify(dataToSend),  // Convert the JavaScript object to a JSON string
//         dataType: "json",  // Expect JSON in response from the server
//         success: function(response) {
//             // This function is called if the request succeeds
//             // 'response' contains the data sent back by the server
//             console.log('Success:', response);
//         },
//         error: function(xhr, status, error) {
//             // This function is called if the request fails
//             console.log('Error:', xhr.responseText);
//         }
//     });
// }

// // Document Ready function to ensure the script runs after the DOM is fully loaded
// $(document).ready(function() {
//     $("#sendDataButton").click(fetchResumeData);
// });
