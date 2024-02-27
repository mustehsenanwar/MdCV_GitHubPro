let l = console.log;
let sectionCount = 1;

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
        value = $(this).val(),
        cardName = $(this).data("card");

    let $cvContent = $(".cvContent");
    $cvContent.find(`.section.${section} .items[data-filling="${cardName}"] .item[data-edit="${target}"]`).text(value);
    if (target == "degree") {
        $(this).parents(".resume-folding-card").first().find(".card-title").text(value);
    }
});

// Fetch resume data
function fetchResumeData() {
    let orderId = $("#orderId").val();

    $.ajax({
        url: "/dashboard/resumebuilder/" + orderId + "/",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({ "Name": "sohail" }),
        contentType: "application/json",
        success: function (res) { },
    });
}
// Document Ready fn
$(document).ready(function () {
    fetchResumeData();
});


//#region Education
function appendEducationHTML(cardType, sectionCount) {
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items pl-3" data-filling="educationCard${sectionCount}">
            <span class="item" data-edit="degree"></span>
            <span class="item" data-edit="universty"></span>
            <span class="item" data-edit="location"></span>
            <span class="item" data-edit="date"></span>
            <span class="item" data-edit="description"></span>
        </div>`;
    $cvContent.find(`.section.education`).append($cvHTML);
}

function sectionCardHTML(cardType) {
    let cardHTML =
        `<div class="card shadow-sm resume-folding-card mb-3">
            <div class="card-header collapsible cursor-pointer rotate active"
                data-bs-toggle="collapse" data-bs-target="#${cardType}Card${sectionCount}">
                <h3 class="card-title"></h3>
                <div class="content-center">
                    <i class=" fa fa-trash text-white mr-3 delete-card-item" data-delete="${cardType}Card${sectionCount}" data-card="${cardType}"></i>
                    <div class="card-toolbar">
                        <i class="ki-duotone ki-down fs-1 text-white fold-arrow"></i>
                    </div>
                </div>
            </div>
            <div id="${cardType}Card${sectionCount}" class="collapse show">
                <div class="card-body p-3">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="degree" data-section="education"
                                    autocomplete="off" placeholder="Degree Name">
                                <label for="username">Degree</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="universty" data-section="education"
                                    autocomplete="off" placeholder="Universty">
                                <label for="username">Universty</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" data-section="education"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
                                    data-section="education" autocomplete="off"
                                    placeholder="e.g (2020-2021)">
                                <label for="username">Dates</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label for="username">Description</label>
                            <textarea name="description" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="education" cols="30"
                                rows="5"></textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "education") {
        appendEducationHTML(sectionCount);
    }
    return cardHTML;
}
//#endregion Education

// Multiple cards add
$(document).on('click', ".add-new-card-btn", function () {
    let sectionName = $(this).data("add-section");
    $parent = $(this).parents(`.${sectionName}-container`).find(".cards");
    if (sectionName == "education") {
        let cardHTML = sectionCardHTML(sectionName);
        $parent.append(cardHTML);
        sectionCount++;
    }
});

// Delete Card
$(document).on('click', ".delete-card-item", function () {
    let deleteTarget = $(this).data("delete"),
        card = $(this).data("card"),
        $cvContent = $(".cvContent");
    $(this).parents(".resume-folding-card").first().remove();
    $cvContent.find(`.section.${card} .items[data-filling="${deleteTarget}"]`).remove();
});