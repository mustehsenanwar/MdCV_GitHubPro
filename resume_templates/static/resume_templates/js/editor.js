let l = console.log;
// Global variables
// let sectionCount = 1;
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

// Owl Carousel nav tabs
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

// CV Print
$(document).on('click', "#cvPrint", function () {
    printCV();
});

// Contact fields fill on cv template
$(document).on('change input', ".cv-input", function () {
    let $this = $(this),
        target = $this.attr("data-target"),
        value = $this.val();
    cvMainContent.find(`[data-setVal="${target}"]`).text(value);
});

// change cv images
$(document).on('change', '#file-upload', function () {
    var fileInput = $(this)[0];
    if (fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            let image = e.target.result;
            cvMainContent.find(".user-img img").attr("src", image);
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
        }, 1000);
        return false;
    });

    $('.carousel-control-prev').click(function () {
        $('#cvEditorCarousel').carousel('prev');
        setTimeout(() => {
            let target = $('#cvEditorCarousel').find(".carousel-item.active").data("panel");
            $(".progress-bar").find(`[data-target="${target}"]`).trigger("click");
        }, 1000);
        return false;
    });
});

function addSkillORLanguageRow(section, text, cardTarget, data = {}) {
    let skillVal = data.text || "",
        average = data.average || 0,
        skillName = rtrim(section.toLowerCase(), "s"),
        proficiency = data.proficiency ? data.proficiency : "";
    let skillHTML =
        `<form>
        <div class="skill-item mb-3">
            <div class="left">
                <div class="form-item mb-0">
                    <input type="text" name="${skillName}" value="${skillVal}" class="fill-item-value" data-section="${section}"
                    data-card="${cardTarget}${sectionCount}" data-fill="text" autocomplete="off"
                    placeholder="${text}">
                    <label for="username">${text}</label>
                </div>
            </div>
            <input type="hidden" name="proficiency" value="${proficiency}" />
            <div class="right d-flex">
                <input type="range" class="w-100 fill-item-value"
                data-section="${section}" data-card="${cardTarget}${sectionCount}"
                data-fill="progress" min="1" max="100" value="${average}">
                <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-skill" data-delete="${cardTarget}${sectionCount}" data-section="${section}"></i>
            </div>
        </div>
        </form>`;
    return skillHTML;
}

// Add Skill button
$(document).on("click", ".add-skill-btn", function () {
    let $parent = $(this).parents(".skill-container"),
        cardTarget = $(this).data("card"),
        text = $(this).data("text"),
        section = $(this).data("section");

    skillHTML = addSkillORLanguageRow(section, text, cardTarget);
    $(`.skill-item-container.${section}-items-container`).append(skillHTML);
    if (section == "languages") {
        addLanguageSkillItem(sectionCount);
    } else if (section == "skills") {
        addProfessionalSkillItem();
    }
    sectionCount++;
});

function addHobbiesRow(data = {}) {
    let text = data.text || "";
    let $html =
        `<div class="hobbies-item mb-3">
        <div class="left content-center">
            <div class="form-item mb-0 w-100">
                <input type="text" value="${text}" class="fill-item-value"
                    data-section="hobbies" autocomplete="off" data-fill="text"
                    data-card="hobbiesCard${sectionCount}" placeholder="Hobbies">
                <label for="username">Hobbies</label>
            </div>
            <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-hobbies" data-section="hobbies" data-delete="hobbiesCard${sectionCount}"></i>
        </div>
    </div>`;
    return $html;
}

// Add hobbies button
$(document).on("click", ".add-hobbies-btn", function () {
    let $parent = $(this).parents(".hobbies-container"),
        cardTarget = $(this).data("card"),
        text = $(this).data("text"),
        section = $(this).data("section");

    $parent.find(".hobbies-item-container").append(addHobbiesRow());
    addHobbiesItem()
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

function addReferencesRow(data = {}) {
    let text = data.text || "";
    let $html =
        `<div class="references-item mb-3">
        <div class="left content-center">
            <div class="form-item mb-0 w-100">
                <input type="text" value="${text}" class="fill-item-value"
                    data-section="references" autocomplete="off" data-fill="text"
                    data-card="referencesCard${sectionCount}" placeholder="References">
                <label for="username">References</label>
            </div>
            <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-references" data-section="references" data-delete="referencesCard${sectionCount}"></i>
        </div>
    </div>`;
    return $html;
}

// Add hobbies button
$(document).on("click", ".add-references-btn", function () {
    let $parent = $(this).parents(".references-container"),
        cardTarget = $(this).data("card"),
        text = $(this).data("text"),
        section = $(this).data("section");

    $parent.find(".references-item-container").append(addReferencesRow());
    addReferencesItem()
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
    if (fillVal == "text") {
        $targetEle.text(value);
    } else {
        $targetEle.css({ "width": value + "%" })
    }
});


// Remove Single Skill
$(document).on("click", ".delete-single-skill", function () {
    let $parent = $(this).parents(".skill-item");
    $(this).parents("form").first().remove();
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

// Tc side panel close
$(document).on('click', ".tc-side-panel-close", function () {
    let $parent = $(this).parents(".tc-panel");
    $parent.addClass("d-none");
    $("#cvEditorCarousel").removeClass("d-none");
});

// Tc side panel open
$(document).on('click', ".tc-side-panel-open", function () {
    let target = $(this).data("target");
    let $panelParent = $(".editor-sidebar-content");
    $panelParent.find(".tc-panel").addClass("d-none");
    $panelParent.find(`.tc-panel[data-toggle="${target}"]`).removeClass("d-none");
    $("#cvEditorCarousel").addClass("d-none");
});

// Initialize sortable on columns
$('.rearrange-sections .column').sortable({
    connectWith: '.rearrange-sections .column',
    items: '.rearrange-section',
    update: function (event, ui) {
        let moveSec = $(ui.item).attr("data-target");
        let targetColumn = $(ui.item).closest('.column');
        let targetColumnIndex = $('.rearrange-sections .column').index(targetColumn) + 1; // Get index of target column

        let target = $(ui.item).next().attr("data-target"),
            prevTarget = $(ui.item).prev().attr("data-target");

        let dragSection = $(`.cvContent .section[data-target=${moveSec}]`).detach();
        let $parent = $(ui.item).parents(".column").first();
        if (target && !prevTarget) {
            dragSection.insertBefore(`.cvContent .section[data-target=${target}]`);
        } else if (!target && prevTarget) {
            $(`.cvContent .section[data-target=${prevTarget}]`).parents('.sec-con').append(dragSection);
        } else if (target && prevTarget) {
            dragSection.insertAfter(`.cvContent .section[data-target=${prevTarget}]`);
        } else if (!target && !prevTarget) {
            if ($parent.hasClass("rearrange-sec-1")) {
                $(`.cvContent .sec-con1`).append(dragSection);
            } else {
                $(`.cvContent .sec-con2`).append(dragSection);
            }
        } else {
            if ($parent.hasClass("rearrange-sec-1")) {
                // $(`.cvContent .body .sec-con1`).append(dragSection);
                if (target && !prevTarget) {
                    dragSection.insertBefore(`.cvContent .sec-con1 .section[data-target=${target}]`);
                } else if (!target && prevTarget) {
                    $(`.cvContent .sec-con1 .section[data-target=${prevTarget}]`).parents('.sec-con').append(dragSection);
                } else if (target && prevTarget) {
                    dragSection.insertAfter(`.cvContent .sec-con1 .section[data-target=${prevTarget}]`);
                }
            } else {
                // $(`.cvContent .body .sec-con2`).append(dragSection);
                if (target && !prevTarget) {
                    dragSection.insertBefore(`.cvContent .sec-con2 .section[data-target=${target}]`);
                } else if (!target && prevTarget) {
                    $(`.cvContent .sec-con2 .section[data-target=${prevTarget}]`).parents('.sec-con').append(dragSection);
                } else if (target && prevTarget) {
                    dragSection.insertAfter(`.cvContent  .sec-con2 .section[data-target=${prevTarget}]`);
                }
            }
        }
    }
}).disableSelection();



// Append Rearrange Section & Content
function rearrangeSectionItems(target, element) {
    $("#customization .rearrange-sections").find(element).append(`
    <div class="rearrange-section pull-away draggable-sec toggle-cv-section" data-section-text="${target}" draggable="true" data-type="section"  data-target="${target}">
        <div class="d-flex align-center drag-sec">
            <i class="fas fa-grip-vertical sec-icon"></i>
            <p>
                ${target}
            </p>
        </div>
        <i class="fas fa-times text-danger cp delete"></i>
    </div>
    `);
}


// In Word
function inWords(num) {
    var numberStr1 = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var numberStr2 = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';

    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';

    var str = '';

    str += (n[1] != 0) ? (numberStr1[Number(n[1])] || numberStr2[n[1][0]] + ' ' + numberStr1[n[1][1]]) + ' crore ' : '';
    str += (n[2] != 0) ? (numberStr1[Number(n[2])] || numberStr2[n[2][0]] + ' ' + numberStr1[n[2][1]]) + ' lakh ' : '';
    str += (n[3] != 0) ? (numberStr1[Number(n[3])] || numberStr2[n[3][0]] + ' ' + numberStr1[n[3][1]]) + ' thousand ' : '';
    str += (n[4] != 0) ? (numberStr1[Number(n[4])] || numberStr2[n[4][0]] + ' ' + numberStr1[n[4][1]]) + ' hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (numberStr1[Number(n[5])] || numberStr2[n[5][0]] + ' ' + numberStr1[n[5][1]]) : '';

    return str.trim();
}

// Fill personl information
function fillPersonalInformation(perInfo) {
    let sidebarContainer = $(".editor-sidebar-content");
    // Iterate over the properties of the perInfo object
    for (let i = 0; i < perInfo.length; i++) {
        let perInfoData = perInfo[i],
            data = perInfoData.data;
        $(`.save-cv-content-btn[data-target="${perInfoData.target}"]`).attr("data-heading", perInfoData.heading);
        for (let a = 0; a < data.length; a++) {
            let singleData = data[a];
            // Single Data
            for (let key in singleData) {
                let $target = sidebarContainer.find(`[data-target="${key}"]`);
                let value = singleData[key];
                if ($target.length > 0) { // Check if the target exists
                    $target.val(value).trigger("change");
                    cvMainContent.find(`[data-setval="${key}"]`).text(value);
                    cvMainContent.find(`[data-filling="${key}"]`).text(value);
                }
            }
        }
    }
}


// Append new section fn
function appendNewSection(data, element) {
    let target = data.target,
        heading = data.heading,
        sectionData = data.data
    $(`.save-cv-content-btn[data-target="${target}"]`).attr("data-heading", heading);
    // default items div
    items = "";
    if (target == "skills" || target == "languages" || target == "hobbies" || target == "references") items = `<div class="items"></div>`;
    $(element).append(`
    <div class="section ${target}" data-target="${target}">
        <div class="sec-heading">${heading}</div>
        <div class="content">
        ${items}
        </div>
    </div>`);
    // fill data
    for (let i = 0; i < sectionData.length; i++) {
        secData = sectionData[i];
        let $container = $(`.${target}-container`).find(".cards");
        if (target == "education") {
            $container.append(educationSectionCardHTML(target, secData));
        } else if (target == "achievements") {
            $container.append(achievementsSectionCardHTML(target, secData));
        } else if (target == "softSkill") {
            $container.append(softSkillSectionCardHTML(target, secData));
        } else if (target == "certificates") {
            $container.append(certificateSectionCardHTML(target, secData));
        } else if (target == "experience") {
            $container.append(expriencesectionCardHTML(target, secData));
        } else if (target == "languages") {
            secData = { text: secData.language, average: 90, proficiency: secData.proficiency };
            skillHTML = addSkillORLanguageRow(target, "Language", "languagesCard", secData);
            $(`.skill-item-container.${target}-items-container`).append(skillHTML);
            addLanguageSkillItem(secData);
        } else if (target == "skills") {
            secData = { text: secData.skill, average: 90 };
            skillHTML = addSkillORLanguageRow(target, "Skill", "proSkillCard", secData);
            $(`.skill-item-container.${target}-items-container`).append(skillHTML);
            addProfessionalSkillItem(secData);
        } else if (target == "references") {
            $(".references-container").find(".references-item-container").append(addReferencesRow(secData));
            addReferencesItem(secData);
        } else if (target == "hobbies") {
            $(".hobbies-container").find(".hobbies-item-container").append(addHobbiesRow(secData));
            addHobbiesItem(secData)
        }
        sectionCount++
    }
}

// Load sections from json fn
function loadSectionsFromJson(data, targetElement, index = null) {
    data.forEach(section => {
        appendNewSection(section, targetElement);
        rearrangeSectionItems(section.target, `.rearrange-sec-${index}`);
    });
}

// Load cv Data
function cvHTMLStructureLoad(cvData) {
    let allSec = cvData;
    // Remove sections
    cvMainContent.find(`.section:not(.profile)`).remove();
    for (let i = 1; i < 3; i++) {
        let type = inWords(i),
            selector = `.cvContent .sec-con${i}`;
        loadSectionsFromJson(allSec[type], selector, i);
    }
    fillPersonalInformation(allSec['static_sections']);
}


// Hide sections
$(document).on('click', ".toggle-cv-section .delete", function () {
    let $parent = $(this).parents(".toggle-cv-section"),
        section = $parent.data("target"),
        sectionText = $parent.data("section-text");
    $parent.addClass("d-none");
    // hide section append
    $parent.parents(".customization-sections").find(".hide-section-container").append(`
    <div class="single-section" data-target="${section}">
     <i class="fa fa-plus mr-1"></i>
        ${sectionText}
    </div>`);
    cvMainContent.find(`.section.${section}`).addClass("d-none");
});

// Show section
$(document).on('click', ".hide-section-container .single-section", function () {
    let $parent = $(this).parents(".customization-sections"),
        section = $(this).data("target");
    $parent.find(`.toggle-cv-section[data-target="${section}"]`).removeClass("d-none");
    cvMainContent.find(`.section.${section}`).removeClass("d-none");
    $(this).remove();
});


// // Resume Pdf stricture 
$(document).on('click', "#generatePdf", function () {
    let orderId = $("#orderId").val();
    let $resumeHTML = $(".wrapper-container").html();
    let $resumeData = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sample Page with Table</title>
    </head>
        <div class="wrapper-container w-100">
            <link rel="stylesheet" href="/static/resume_templates/css/bootstrap.min.css">
            <link rel="stylesheet" href="/static/resume_templates/css/font-awesome.min.css">
            <link rel="stylesheet" href="/static/resume_templates/css/editor.css">
            <link rel="stylesheet" href="/static/resume_templates/css/create.css">
            <link rel="stylesheet" href="/static/resume_templates/css/theme1.css">
            <link rel="stylesheet" href="/static/resume_templates/css/pdf-setting.css">
            ${$resumeHTML}
        </div>
    </body>
    </html>`;

    $.ajax({
        url: "/dashboard/resumebuilder/" + orderId + "/",
        method: "POST",
        data: JSON.stringify({
            action: 'generate_pdf',
            html: $resumeData,
            generatePdf: true
        }),
        dataType: "json",
        //         beforeSend: function(xhr, settings) {
        //             const csrftoken = $('meta[name="csrf-token"]').attr('content');
        //             xhr.setRequestHeader("X-CSRFToken", csrftoken);
        // },
        success: function (res) {
            if (res.status == "success") {
                l(res)
            }
        },
        error: function (err) {
            console.error("Something went Wrong");
        }
    });
});



// tinymce editor init
$(window).on('load', function () {
    tinymceEditorIds.forEach(id => {
        initTinymceEditor(id);
    });
});

$(document).on('click', ".add-new-card-btn", function () {
    tinymceEditorIds.forEach(id => {
        initTinymceEditor(id);
    });
});

// Save CV content button
$(document).on('click', ".save-cv-content-btn", function (e) {
    let $formContainer = $(this).parents(".cv-form-container"),
        orderId = $("#orderId").val(),
        target = $(this).data("target"),
        heading = $(this).data("heading"),
        $forms = $formContainer.find("form");
    let formDataJSON = {
        target,
        heading,
        data: []
    };

    // Convert the array to a JSON object
    $forms.each(function () {
        let formData = $(this).serializeArray(); // Serialize form data
        formDataObject = {};
        $.each(formData, function () {
            formDataObject[this.name] = this.value; // Assign form field name as key and value as value
        });
        formDataJSON.data.push(formDataObject);
    });
    l(formDataJSON)
    // handleResumeData(orderId, 'update', { resumeData: { data: formDataJSON } });
    if (!$(this).hasClass("end-panel"))
        $(".carousel-control-next").trigger("click");
});
