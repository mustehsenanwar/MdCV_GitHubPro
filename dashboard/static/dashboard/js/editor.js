let l = console.log;
let sectionCount = 1;
let cvMainContent = $(".cvContent");

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

// PROFESSIONAL SKILLS
function addProfessionalSkillItem(count) {
    let skillHTML =
        `<div class="item" data-filling="proSkillCard${count}">
            <div class="skill-item">
                <div class="progress">
                    <div class="progress-bar" data-edit="progress"
                        role="progressbar" aria-valuenow="70" aria-valuemin="0"
                        aria-valuemax="100" style="width:70%">
                    </div>
                </div>
                <span class="text" data-edit="text"></span>
            </div>
        </div>`;
    cvMainContent.find(`.section.skills .items`).append(skillHTML);
}

// Add Language fn
function addLanguageSkillItem(count) {
    let languageHtml =
        `<div class="item" data-filling="languagesCard${count}">
            <i class="fa fa-circle"></i>
            <div class="w-100 pull-away pr-5">
                <span class="text" data-edit="text"></span>
                <div class=" progress">
                    <div class="progress-bar" data-edit="progress" role="progressbar"
                        aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"
                        style="width:70%">
                    </div>
                </div>
            </div>
        </div>`;
    cvMainContent.find(`.section.languages .items`).append(languageHtml);
}

// Add Skill button
$(document).on("click", ".add-skill-btn", function () {
    let $parent = $(this).parents(".skill-container"),
        cardTarget = $(this).data("card"),
        text = $(this).data("text"),
        section = $(this).data("section");
    let skillHTML =
        `<div class="skill-item mb-3">
            <div class="left">
                <div class="form-item mb-0">
                    <input type="text" class="fill-item-value" data-section="${section}"
                    data-card="${cardTarget}${sectionCount}" data-fill="text" autocomplete="off"
                    placeholder="${text}">
                    <label for="username">${text}</label>
                </div>
            </div>
            <div class="right d-flex">
                <input type="range" class="w-100 fill-item-value"
                data-section="${section}" data-card="${cardTarget}${sectionCount}"
                data-fill="progress" min="1" max="100" value="50">
                <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-skill" data-delete="${cardTarget}${sectionCount}" data-section="${section}"></i>
            </div>
        </div>`;
    $parent.find(".skill-item-container").append(skillHTML);
    if (section == "languages") {
        addLanguageSkillItem(sectionCount);
    } else if (section == "skills") {
        addProfessionalSkillItem(sectionCount);
    }
    sectionCount++;
});

// Add Language fn
function addHobbiesItem(count) {
    let hobbiesHtml =
        `<div class="item" data-filling="hobbiesCard${count}">
            <i class="fa fa-circle"></i>
            <div class="w-100 pull-away pr-5">
                <span class="text" data-edit="text"></span>
            </div>
        </div>`;
    cvMainContent.find(`.section.hobbies .items`).append(hobbiesHtml);
}

// Add hobbies button
$(document).on("click", ".add-hobbies-btn", function () {
    let $parent = $(this).parents(".hobbies-container"),
        cardTarget = $(this).data("card"),
        text = $(this).data("text"),
        section = $(this).data("section");
    let skillHTML =
        `<div class="hobbies-item mb-3">
            <div class="left content-center">
                <div class="form-item mb-0 w-100">
                    <input type="text" value="" class="fill-item-value"
                        data-section="hobbies" autocomplete="off" data-fill="text"
                        data-card="hobbiesCard${sectionCount}" placeholder="Hobbies">
                    <label for="username">Hobbies</label>
                </div>
                <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-hobbies" data-section="hobbies" data-delete="hobbiesCard${sectionCount}"></i>
            </div>
        </div>`;
    $parent.find(".hobbies-item-container").append(skillHTML);
    addHobbiesItem(sectionCount)
    sectionCount++;
});

// Remove Single hobbies
$(document).on("click", ".delete-single-hobbies", function () {
    let $parent = $(this).parents(".hobbies-item");
    $parent.remove();
    // remove cv item
    let section = $(this).data("section"),
        target = $(this).data("delete");
    cvMainContent.find(`.section.${section} .item[data-filling="${target}"]`).remove();
});

// Add reference fn
function addReferencesItem(count) {
    let referencesHtml =
        `<div class="item" data-filling="referencesCard${count}">
            <i class="fa fa-circle"></i>
            <div class="w-100 pull-away pr-5">
                <span class="text" data-edit="text"></span>
            </div>
        </div>`;
    cvMainContent.find(`.section.references .items`).append(referencesHtml);
}

// Add hobbies button
$(document).on("click", ".add-references-btn", function () {
    let $parent = $(this).parents(".references-container"),
        cardTarget = $(this).data("card"),
        text = $(this).data("text"),
        section = $(this).data("section");
    let skillHTML =
        `<div class="references-item mb-3">
            <div class="left content-center">
                <div class="form-item mb-0 w-100">
                    <input type="text" value="" class="fill-item-value"
                        data-section="references" autocomplete="off" data-fill="text"
                        data-card="referencesCard${sectionCount}" placeholder="References">
                    <label for="username">References</label>
                </div>
                <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-references" data-section="references" data-delete="referencesCard${sectionCount}"></i>
            </div>
        </div>`;
    $parent.find(".references-item-container").append(skillHTML);
    addReferencesItem(sectionCount)
    sectionCount++;
});

// Remove Single hobbies
$(document).on("click", ".delete-single-references", function () {
    let $parent = $(this).parents(".references-item");
    $parent.remove();
    // remove cv item
    let section = $(this).data("section"),
        target = $(this).data("delete");
    cvMainContent.find(`.section.${section} .item[data-filling="${target}"]`).remove();
});

// skill value fill
$(document).on('change input', ".fill-item-value", function () {
    let section = $(this).data("section"),
        targetCard = $(this).data("card"),
        fillVal = $(this).data("fill"),
        $section = cvMainContent.find(`.section.${section}`);
    let $targetEle = $section.find(`.item[data-filling="${targetCard}"] [data-edit="${fillVal}"]`);
    let value = $(this).val();
    l($section.find(`.item[data-filling="${targetCard}"`));
    if (fillVal == "text") {
        $targetEle.text(value);
    } else {
        $targetEle.css({ "width": value + "%" })
    }
});


// Remove Single Skill
$(document).on("click", ".delete-single-skill", function () {
    let $parent = $(this).parents(".skill-item");
    $parent.remove();
    // remove cv item
    let section = $(this).data("section"),
        target = $(this).data("delete");
    cvMainContent.find(`.section.${section} .item[data-filling="${target}"]`).remove();
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
    if (target == "degree" || target == "designation" || target == "certificate" || target == "skill" || target == "achievements") {
        $(this).parents(".resume-folding-card").first().find(".card-title").text(value);
    }
});

// Fetch resume data


function handleResumeData(orderId, action, additionalData = {}) {
    let data = {
        action: action,  // 'fetch' or 'update'
        ...additionalData
    };

    $.ajax({
        url: "/dashboard/resumebuilder/" + orderId + "/",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            console.log(res);
        },
        error: function (err) {
            console.error("Error processing request:", err);
        }
    });
}

// Document Ready function
$(document).ready(function () {
    let orderId = $("#orderId").val();

    // To fetch resume data
    handleResumeData(orderId, 'fetch');
    // To update the data 
    $(".ai-suggestion-btn").click(function () {
        handleResumeData(orderId, 'update', { resumeData: { "name": "mustehesn" } });
    });

});
















// function fetchResumeData() {
//     let orderId = $("#orderId").val();

//     $.ajax({
//         url: "/dashboard/resumebuilder/" + orderId + "/",
//         method: "POST",
//         dataType: "json",
//         data: JSON.stringify({ "Name": "sohail" }),
//         contentType: "application/json",
//         success: function (res) { },
//     });
// }
// // Document Ready fn
// $(document).ready(function () {
//     fetchResumeData();
// });


//#region Education
function appendEducationHTML(sectionCount) {
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items pl-3" data-filling="educationCard${sectionCount}">
            <span class="item" data-edit="degree"></span>
            <span class="item" data-edit="university"></span>
            <span class="item" data-edit="location"></span>
            <span class="item" data-edit="date"></span>
            <span class="item" data-edit="description"></span>
        </div>`;
    $cvContent.find(`.section.education`).append($cvHTML);
}

function educationSectionCardHTML(cardType) {
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
                                    data-fill="university" data-section="education"
                                    autocomplete="off" placeholder="University">
                                <label for="username">University</label>
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

//#region Experience 
function appendExprienceHTML(sectionCount) {
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items pl-3 mt-3" data-filling="experienceCard${sectionCount}">
            <span class="item" data-edit="designation"></span>
            <span class="item" data-edit="company-name"></span>
            <span class="item" data-edit="location"></span>
            <span class="item" data-edit="date"></span>
            <span class="item" data-edit="description"></span>
        </div>`;
    $cvContent.find(`.section.experience .content`).append($cvHTML);
}

function expriencesectionCardHTML(cardType) {
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
                                    data-fill="designation" data-section="experience"
                                    autocomplete="off" placeholder="Designation">
                                <label for="username">Designation</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="company-name" data-section="experience"
                                    autocomplete="off" placeholder="Company Name">
                                <label for="username">Company Name</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" data-section="experience"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
                                    data-section="experience" autocomplete="off"
                                    placeholder="e.g (2020-2021)">
                                <label for="username">Dates</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label for="username">Description</label>
                            <textarea name="description" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="experience" cols="30"
                                rows="5"></textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "experience") {
        appendExprienceHTML(sectionCount);
    }
    return cardHTML;
}
//#endregion Experience 

//#region certificates
function appendCertificatesHTML(sectionCount) {
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items pl-3 mt-3" data-filling="certificatesCard${sectionCount}">
            <span class="item" data-edit="certificate"></span>
            <span class="item" data-edit="organization"></span>
            <span class="item" data-edit="location"></span>
            <span class="item" data-edit="date"></span>
            <span class="item" data-edit="description"></span>
        </div>`;
    $cvContent.find(`.section.certificates .content`).append($cvHTML);
}

function certificateSectionCardHTML(cardType) {
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
                                    data-fill="certificate" data-section="certificates"
                                    autocomplete="off" placeholder="Certificate">
                                <label for="username">Certificate</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="organization" data-section="certificates"
                                    autocomplete="off" placeholder="Organization">
                                <label for="username">Organization</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" data-section="certificates"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
                                    data-section="certificates" autocomplete="off"
                                    placeholder="e.g (2020-2021)">
                                <label for="username">Dates</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label for="username">Description</label>
                            <textarea name="description" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="certificates" cols="30"
                                rows="5"></textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "certificates") {
        appendCertificatesHTML(sectionCount);
    }
    return cardHTML;
}
//#endregion certificates 
//#region soft skill
function appendSoftSkillHTML(sectionCount) {
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items pl-3 mt-1 pt-0 flex-column" data-filling="softSkillCard${sectionCount}">
            <span class="item" data-edit="skill"></span>
            <span class="item" data-edit="description"></span>
        </div>`;
    $cvContent.find(`.section.softSkill`).append($cvHTML);
}

function softSkillSectionCardHTML(cardType) {
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
                                    data-fill="skill" data-section="softSkill"
                                    autocomplete="off" placeholder="Skill">
                                <label for="username">Skill</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label for="username">Description</label>
                            <textarea name="description" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="softSkill" cols="30"
                                rows="5"></textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "softSkill") {
        appendSoftSkillHTML(sectionCount);
    }
    return cardHTML;
}
//#endregion soft skill 

//#region achievements
function appendachievementsHTML(sectionCount) {
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items pl-3 mt-1 pt-0 flex-column" data-filling="achievementsCard${sectionCount}">
            <span class="item" data-edit="achievements"></span>
            <span class="item" data-edit="description"></span>
        </div>`;
    $cvContent.find(`.section.achievements`).append($cvHTML);
}

function achievementsSectionCardHTML(cardType) {
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
                                    data-fill="achievements" data-section="achievements"
                                    autocomplete="off" placeholder="Achievements">
                                <label for="username">Achievements</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label for="username">Description</label>
                            <textarea name="description" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="achievements" cols="30"
                                rows="5"></textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "achievements") {
        appendachievementsHTML(sectionCount);
    }
    return cardHTML;
}
//#endregion achievements


// Multiple cards add
$(document).on('click', ".add-new-card-btn", function () {
    let sectionName = $(this).data("add-section");
    $parent = $(this).parents(`.${sectionName}-container`).find(".cards");
    if (sectionName == "education") {
        let cardHTML = educationSectionCardHTML(sectionName);
        $parent.append(cardHTML);
    } else if (sectionName == "experience") {
        $parent.append(expriencesectionCardHTML(sectionName));
    } else if (sectionName == "certificates") {
        $parent.append(certificateSectionCardHTML(sectionName));
    } else if (sectionName == "softSkill") {
        $parent.append(softSkillSectionCardHTML(sectionName));
    } else if (sectionName == "achievements") {
        $parent.append(achievementsSectionCardHTML(sectionName));
    }
    sectionCount++;
});

// Delete Card
$(document).on('click', ".delete-card-item", function () {
    let deleteTarget = $(this).data("delete"),
        card = $(this).data("card"),
        $cvContent = $(".cvContent");
    $(this).parents(".resume-folding-card").first().remove();
    $cvContent.find(`.section.${card} .items[data-filling="${deleteTarget}"]`).remove();
});

// fill cv header data
$(document).on('input', ".input-fill-finalize-data", function () {
    let target = $(this).data("fill"),
        value = $(this).val();
    cvMainContent.find(`[data-filling="${target}"]`).text(value);
});


