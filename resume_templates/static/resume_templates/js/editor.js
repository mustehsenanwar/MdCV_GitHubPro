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
        average = data.average || 0;
    let skillHTML =
        `<div class="skill-item mb-3">
            <div class="left">
                <div class="form-item mb-0">
                    <input type="text" value="${skillVal}" class="fill-item-value" data-section="${section}"
                    data-card="${cardTarget}${sectionCount}" data-fill="text" autocomplete="off"
                    placeholder="${text}">
                    <label for="username">${text}</label>
                </div>
            </div>
            <div class="right d-flex">
                <input type="range" class="w-100 fill-item-value"
                data-section="${section}" data-card="${cardTarget}${sectionCount}"
                data-fill="progress" min="1" max="100" value="${average}">
                <i class="fa fa-trash ml-3 cp f-16 text-dark delete-single-skill" data-delete="${cardTarget}${sectionCount}" data-section="${section}"></i>
            </div>
        </div>`;
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

let descriptionData = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
quia.`;

// CV sections structure
const sections = {
    personal_information: {
        name: "Sohail Akbar test",
        headline: "Health, Environment, Safety and Quality (HSEQ) Test",
        summary: descriptionData,
        phone: "0305465543542",
        email: "test@gmail.com",
        nationality: "pakistan",
        merital_status: "Married",
        dob: "SEP-1999",
        driving_lisence: "USA",
        linkedIn: "https://pk.linkedin.com/",
        country: "PK",
    },
    'one': [
        {
            'target': 'achievements',
            'heading': 'ACHIEVEMENTS',
            data: [
                {
                    achievements: "Master of Business Administration",
                    description: descriptionData
                }, {
                    achievements: "Master of Business Administration",
                    description: descriptionData
                }
            ]
        },
        {
            'target': 'softSkill',
            "heading": 'SOFT SKILLS',
            data: [
                {
                    skill: "Python",
                    description: descriptionData,
                }, {
                    skill: "C++",
                    description: descriptionData,
                }
            ]
        },
        {
            'target': 'languages',
            "heading": "LANGUAGES",
            data: [
                {
                    text: "English",
                    average: 50,
                }, {
                    text: "French",
                    average: 80,
                }, {
                    text: "Urdu",
                    average: 100,
                }, {
                    text: "Punjabi",
                    average: 50,
                },
            ]
        },
        {
            'target': 'references',
            "heading": "REFERENCES",
            data: [
                { text: "references one" },
                { text: "references two" },
                { text: "references three" },
                { text: "references four" },
                { text: "references five" },
            ]
        },
        {
            'target': 'skills',
            "heading": "PROFESSIONAL SKILLS",
            data: [
                {
                    text: "HTML",
                    average: 50,
                }, {
                    text: "CSS",
                    average: 80,
                }, {
                    text: "JavaScript",
                    average: 100,
                }, {
                    text: "Jquery",
                    average: 50,
                },
            ]
        },
    ],
    'two': [
        {
            'target': 'experience',
            "heading": "PROFESSIONAL EXPERIENCE",
            data: [
                {
                    designation: "LACOTE GENERAL TRADING",
                    'company-name': "PROCUREMENT OFFICER",
                    location: "(UAE)",
                    date: "SEP 2022 TO PRESENT",
                    description: descriptionData
                }, {
                    designation: "LACOTE GENERAL TRADING",
                    'company-name': "PROCUREMENT OFFICER",
                    location: "(UAE)",
                    date: "SEP 2022 TO PRESENT",
                    description: descriptionData
                }
            ]
        },
        {
            target: 'education',
            heading: 'EDUCATION',
            data: [
                {
                    degree: "Master of Business Administration",
                    university: "Mangalore University",
                    location: "India",
                    date: "(2008 - 2010)",
                    description: descriptionData
                }, {
                    degree: "Master of Business Administration",
                    university: "Mangalore University",
                    location: "India",
                    date: "(2008 - 2010)",
                    description: descriptionData
                }
            ]
        },
        {
            'target': 'certificates',
            "heading": "CERTIFICATES",
            data: [
                {
                    certificate: "LACOTE GENERAL TRADING",
                    organization: "PROCUREMENT OFFICER",
                    location: "(UAE)",
                    date: "SEP 2022 TO PRESENT",
                    description: descriptionData
                }, {
                    certificate: "LACOTE GENERAL TRADING",
                    organization: "PROCUREMENT OFFICER",
                    location: "(UAE)",
                    date: "SEP 2022 TO PRESENT",
                    description: descriptionData
                }
            ]
        },
        {
            'target': 'hobbies',
            "heading": "HOBBIES",
            data: [
                { text: "hobbies one" },
                { text: "hobbies two" },
                { text: "hobbies three" },
                { text: "hobbies four" },
                { text: "hobbies five" },
            ]
        },
    ]
};

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
    for (let key in perInfo) {
        let $target = sidebarContainer.find(`[data-target="${key}"]`);
        $target.val(perInfo[key]);
        if ($target)
            $target.trigger("change");
    }
}


// Append new section fn
function appendNewSection(data, element) {
    let target = data.target,
        heading = data.heading,
        sectionData = data.data
    // default items div
    items = "";
    if (target == "skills" || target == "languages" || target == "hobbies" || target == "references") items = `<div class="items"></div>`;
    $(element).append(`
    <div class="section ${target}" data-target="${target}">
        <div class="sec-heading">${target.toUpperCase()}</div>
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
            skillHTML = addSkillORLanguageRow(target, "Language", "languagesCard", secData);
            $(`.skill-item-container.${target}-items-container`).append(skillHTML);
            addLanguageSkillItem(secData);
        } else if (target == "skills") {
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
function cvHTMLStructureLoad() {
    let allSec = sections;
    // Remove sections
    cvMainContent.find(`.section:not(.profile)`).remove();
    for (let i = 1; i < 3; i++) {
        let type = inWords(i),
            selector = `.cvContent .sec-con${i}`;
        loadSectionsFromJson(allSec[type], selector, i);
    }
    fillPersonalInformation(allSec['personal_information']);
}
cvHTMLStructureLoad();


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