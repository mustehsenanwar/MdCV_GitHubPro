let l = console.log;
// Global variables
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
$(document).on('change', ".preview-btn-control input", function () {
    let isChecked = $(this).is(":checked");
    if (!isChecked) return false;
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


$(document).ready(function () {
    let column1 = ["education1", "about-us1", "exprience1", "personal-info1"]
    let column2 = ["education2", "about-us2", "exprience2", "personal-info2"]
    for (let i = 0; i < column1.length; i++) {
        const element = column1[i];
        rearrangeSectionItems(element, ".rearrange-sec-1");
    }
    for (let i = 0; i < column2.length; i++) {
        const element = column2[i];
        rearrangeSectionItems(element, ".rearrange-sec-2");
    }
});


// Initialize sortable on columns
$('.rearrange-sections .column').sortable({
    connectWith: '.rearrange-sections .column',
    items: '.rearrange-section',
    update: function (event, ui) {
        let moveSec = $(ui.item).attr("data-target");
        let targetColumn = $(ui.item).closest('.column');
        let targetColumnIndex = $('.rearrange-sections .column').index(targetColumn) + 1; // Get index of target column

        // If the item is moved to a different column
        if ($(ui.sender).hasClass('column')) {
            // Append the dragged item to the new column
            $(ui.item).detach().appendTo(targetColumn);
        }

        // Update the data-target attribute to match the new column's index
        $(ui.item).attr("data-target", moveSec.substring(0, moveSec.length - 1) + targetColumnIndex);
    }
}).disableSelection();


// Append Rearrange Section & Content
function rearrangeSectionItems(target, element) {
    $("#customization .rearrange-sections").find(element).append(`
    <div class="rearrange-section pull-away draggable-sec" draggable="true" data-type="section"  data-target="${target}">
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


// Append Rearrange Section & Content
function rearrangeSectionItems(target, element) {
    $("#customization .rearrange-sections").find(element).append(`
    <div class="rearrange-section pull-away draggable-sec" draggable="true" data-type="section"  data-target="${target}">
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