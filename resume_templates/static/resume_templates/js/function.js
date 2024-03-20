let sectionCount = 1;
let tinymceEditorIds = [0];
// Print CV
function printCV() {
    $("body").addClass("printing");
    print();
}

// Color Change
function changeColor(newColor) {
    document.documentElement.style.setProperty('--theme1', newColor);
}

function rtrim(str, chars) {
    // If no characters specified, trim whitespace by default
    if (typeof chars === 'undefined') {
        return str.replace(/\s+$/, '');
    }

    // Create a regular expression pattern to match the specified characters at the end of the string
    var pattern = new RegExp("[" + chars + "]+$");

    // Use the regular expression to replace matching characters with an empty string
    return str.replace(pattern, '');
};

// Professional Skill
function addProfessionalSkillItem(data = {}) {
    let text = data.text || "",
        average = data.average || 0;
    let skillHTML =
        `<div class="item" data-filling="proSkillCard${sectionCount}">
            <div class="skill-item">
                <div class="progress">
                    <div class="progress-bar" data-edit="progress"
                        role="progressbar" aria-valuenow="${average}" aria-valuemin="0"
                        aria-valuemax="100" style="width:${average}%">
                    </div>
                </div>
                <span class="text" data-edit="text">${text}</span>
            </div>
        </div>`;
    cvMainContent.find(`.section.skills .items`).append(skillHTML);
}

// Add Language fn
function addLanguageSkillItem(data = {}) {
    let text = data.text || "",
        average = data.average || 0;
    let languageHtml =
        `<div class="item" data-filling="languagesCard${sectionCount}">
            <div class="single-item">
                <span class="text" data-edit="text">${text}</span>
                <div class=" progress">
                    <div class="progress-bar" data-edit="progress" role="progressbar"
                        aria-valuenow="${average}" aria-valuemin="0" aria-valuemax="100"
                        style="width:${average}%">
                    </div>
                </div>
            </div>
        </div>`;
    cvMainContent.find(`.section.languages .items`).append(languageHtml);
}

// Add Language fn
function addHobbiesItem(data = {}) {
    let text = data.text || "";
    let hobbiesHtml =
        `<form>
        <div class="item" data-filling="hobbiesCard${sectionCount}">
            <i class="fa fa-circle"></i>
            <div class="w-100 pull-away pr-5">
                <span class="text" data-edit="text">${text}</span>
            </div>
        </div>
        </form>`;
    cvMainContent.find(`.section.hobbies .items`).append(hobbiesHtml);
}

// Add reference fn
function addReferencesItem(data = {}) {
    let text = data.text || "";
    let referencesHtml =
        `<div class="item" data-filling="referencesCard${sectionCount}">
            <i class="fa fa-circle"></i>
            <div class="w-100 pull-away pr-5">
                <span class="text" data-edit="text">${text}</span>
            </div>
        </div>`;
    cvMainContent.find(`.section.references .items`).append(referencesHtml);
}


// Fetch resume data
function handleResumeData(orderId, action, additionalData = {}) {
    let data = {
        action: action,  // 'fetch' or 'update'
        ...additionalData
    };
    // loaderToggle();
    $.ajax({
        url: "/dashboard/resumebuilder/" + orderId + "/",
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            if (res.status == "success") {
                cvHTMLStructureLoad(res.data);
                l(res.data)
            } else alert("Resume Data Not Fount!");
            setTimeout(() => {
                // loaderToggle(false);
            }, 500);
        },
        error: function (err) {
            console.error("Error processing request:", err);
        }
    });
}

function generateRandomId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


//#region Education
function appendEducationHTML(sectionCount, data = {}) {
    let degree = data.degree || "",
        university = data.university || "",
        location = data.location || "",
        date = data.date || "",
        description = data.description || "";
    let $cvHTML =
        `<div class="items pl-3" data-filling="educationCard${sectionCount}">
            <span class="item" data-edit="degree">${degree}</span>
            <span class="item" data-edit="university">${university}</span>
            <span class="item" data-edit="location">${location}</span>
            <span class="item" data-edit="date">${date}</span>
            <span class="item" data-edit="description">${description}</span>
        </div>`;
    cvMainContent.find(`.section.education .content`).append($cvHTML);
}

function educationSectionCardHTML(cardType, data = {}) {
    let degree = data.degree || "",
        university = data.university || "",
        location = data.location || "",
        date = data.date || "",
        description = data.description || "";
    let cardHTML =
        `<div class="card shadow-sm resume-folding-card mb-3">
            <div class="card-header collapsible cursor-pointer rotate active"
                data-bs-toggle="collapse" data-bs-target="#${cardType}Card${sectionCount}">
                <h3 class="card-title">${degree}</h3>
                <div class="content-center">
                    <i class=" fa fa-trash text-white mr-3 delete-card-item" data-delete="${cardType}Card${sectionCount}" data-card="${cardType}"></i>
                    <div class="card-toolbar">
                        <i class="ki-duotone ki-down fs-1 text-white fold-arrow"></i>
                    </div>
                </div>
            </div>
            <div id="${cardType}Card${sectionCount}" class="collapse show">
                <div class="card-body p-3">
                <form>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="degree" data="degree" value="${degree}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="degree" data-section="education"
                                    autocomplete="off" placeholder="Degree Name">
                                <label for="username">Degree</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="university" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="university" value="${university}" data-section="education"
                                    autocomplete="off" placeholder="University">
                                <label for="username">University</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" name="location" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" value="${location}" data-section="education"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" name="date" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
                                    data-section="education" value="${date}" autocomplete="off"
                                    placeholder="e.g (2020-2021)">
                                <label for="username">Dates</label>
                            </div>
                        </div>
                        <div class="col-md-12 editor-container">
                            <label for="username">Description</label>
                            <textarea name="description" data-name="description" id="tinymceEditor${sectionCount}" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="education" cols="30"
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                  </form>  
                </div>
            </div>
        </div>`;
    if (cardType == "education") {
        appendEducationHTML(sectionCount, data);
    }
    tinymceEditorIds.push(sectionCount);
    return cardHTML;
}
//#endregion Education


//#region Experience 
function appendExprienceHTML(sectionCount, data = {}) {
    let designation = data.designation || "",
        companyName = data.companyName || "",
        location = data.location || "",
        date = data.date || "",
        description = data.description || "";
    let $cvHTML =
        `<div class="items pl-3 mt-3" data-filling="experienceCard${sectionCount}">
            <span class="item" data-edit="designation">${designation}</span>
            <span class="item" data-edit="companyName">${companyName}</span>
            <span class="item" data-edit="location">${location}</span>
            <span class="item" data-edit="date">${date}</span>
            <span class="item w-100 mt-2">Key responsibilities:</span>
            <span class="item" data-edit="description">${description}</span>
        </div>`;
    cvMainContent.find(`.section.experience .content`).append($cvHTML);
}

function expriencesectionCardHTML(cardType, data = {}) {
    let designation = data.designation || "",
        companyName = data.companyName || "",
        location = data.location || "",
        date = data.date || "",
        description = data.description || "";
    let cardHTML =
        `<div class="card shadow-sm resume-folding-card mb-3">
            <div class="card-header collapsible cursor-pointer rotate active"
                data-bs-toggle="collapse" data-bs-target="#${cardType}Card${sectionCount}">
                <h3 class="card-title">${designation}</h3>
                <div class="content-center">
                    <i class=" fa fa-trash text-white mr-3 delete-card-item" data-delete="${cardType}Card${sectionCount}" data-card="${cardType}"></i>
                    <div class="card-toolbar">
                        <i class="ki-duotone ki-down fs-1 text-white fold-arrow"></i>
                    </div>
                </div>
            </div>
            <div id="${cardType}Card${sectionCount}" class="collapse show">
                <div class="card-body p-3">
                <form>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="designation" value="${designation}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="designation" data-section="experience"
                                    autocomplete="off" placeholder="Designation">
                                <label for="username">Designation</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="companyName" value="${companyName}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="companyName" data-section="experience"
                                    autocomplete="off" placeholder="Company Name">
                                <label for="username">Company Name</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" name="location" value="${location}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" data-section="experience"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" name="date" value="${date}" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
                                    data-section="experience" autocomplete="off"
                                    placeholder="e.g (2020-2021)">
                                <label for="username">Dates</label>
                            </div>
                        </div>
                        <div class="col-md-12 editor-container">
                            <label for="username">Description</label>
                            <textarea data-name="description" id="tinymceEditor${sectionCount}" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="experience" cols="30"
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                  </form>
                </div>
            </div>
        </div>`;
    if (cardType == "experience") {
        appendExprienceHTML(sectionCount, data);
    }
    tinymceEditorIds.push(sectionCount);
    return cardHTML;
}
//#endregion Experience 


//#region certificates
function appendCertificatesHTML(sectionCount, data = {}) {
    let certificate = data.certificate || "",
        organization = data.organization || "",
        location = data.location || "",
        date = data.date || "",
        description = data.description || "";
    let $cvHTML =
        `<div class="items pl-3 mt-3" data-filling="certificatesCard${sectionCount}">
            <span class="item" data-edit="certificate">${certificate}</span>
            <span class="item" data-edit="organization">${organization}</span>
            <span class="item" data-edit="location">${location}</span>
            <span class="item" data-edit="date">${date}</span>
            <span class="item" data-edit="description">${description}</span>
        </div>`;
    cvMainContent.find(`.section.certificates .content`).append($cvHTML);
}

function certificateSectionCardHTML(cardType, data = {}) {
    let certificate = data.certificate || "",
        organization = data.organization || "",
        location = data.location || "",
        date = data.date || "",
        description = data.description || "";
    let cardHTML =
        `<div class="card shadow-sm resume-folding-card mb-3">
            <div class="card-header collapsible cursor-pointer rotate active"
                data-bs-toggle="collapse" data-bs-target="#${cardType}Card${sectionCount}">
                <h3 class="card-title">${certificate}</h3>
                <div class="content-center">
                    <i class=" fa fa-trash text-white mr-3 delete-card-item" data-delete="${cardType}Card${sectionCount}" data-card="${cardType}"></i>
                    <div class="card-toolbar">
                        <i class="ki-duotone ki-down fs-1 text-white fold-arrow"></i>
                    </div>
                </div>
            </div>
            <div id="${cardType}Card${sectionCount}" class="collapse show">
                <div class="card-body p-3">
                    <form>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="certificate" value="${certificate}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="certificate" data-section="certificates"
                                    autocomplete="off" placeholder="Certificate">
                                <label for="username">Certificate</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="organization" value="${organization}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="organization" data-section="certificates"
                                    autocomplete="off" placeholder="Organization">
                                <label for="username">Organization</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" name="location" value="${location}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" data-section="certificates"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" name="date" value="${date}" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
                                    data-section="certificates" autocomplete="off"
                                    placeholder="e.g (2020-2021)">
                                <label for="username">Dates</label>
                            </div>
                        </div>
                        <div class="col-md-12 editor-container">
                            <label for="username">Description</label>
                            <textarea data-name="description" id="tinymceEditor${sectionCount}" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="certificates" cols="30"
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>`;
    if (cardType == "certificates") {
        appendCertificatesHTML(sectionCount, data);
    }
    tinymceEditorIds.push(sectionCount);
    return cardHTML;
}
//#endregion certificates 


//#region soft skill
function appendSoftSkillHTML(sectionCount, data = {}) {
    let skill = data.skill || "",
        description = data.description || "";
    let $cvHTML =
        `<div class="items  flex-column" data-filling="softSkillCard${sectionCount}">
            <span class="item" data-edit="skill">${skill}</span>
            <span class="item" data-edit="description">${description}</span>
        </div>`;
    cvMainContent.find(`.section.softSkill .content`).append($cvHTML);
}

function softSkillSectionCardHTML(cardType, data = {}) {
    let skill = data.skill || "",
        description = data.description || "";
    let cardHTML =
        `<div class="card shadow-sm resume-folding-card mb-3">
            <div class="card-header collapsible cursor-pointer rotate active"
                data-bs-toggle="collapse" data-bs-target="#${cardType}Card${sectionCount}">
                <h3 class="card-title">${skill}</h3>
                <div class="content-center">
                    <i class=" fa fa-trash text-white mr-3 delete-card-item" data-delete="${cardType}Card${sectionCount}" data-card="${cardType}"></i>
                    <div class="card-toolbar">
                        <i class="ki-duotone ki-down fs-1 text-white fold-arrow"></i>
                    </div>
                </div>
            </div>
            <div id="${cardType}Card${sectionCount}" class="collapse show">
                <div class="card-body p-3">
                <form>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="skill" value="${skill}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="skill" data-section="softSkill"
                                    autocomplete="off" placeholder="Skill">
                                <label for="username">Skill</label>
                            </div>
                        </div>
                        <div class="col-md-12 editor-container">
                            <label for="username">Description</label>
                            <textarea data-name="description" id="tinymceEditor${sectionCount}" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="softSkill" cols="30"
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>`;
    if (cardType == "softSkill") {
        appendSoftSkillHTML(sectionCount, data);
    }
    tinymceEditorIds.push(sectionCount);
    return cardHTML;
}
//#endregion soft skill 

//#region achievements
function appendachievementsHTML(sectionCount, data = {}) {
    let achievements = data.achievement || "",
        description = data.description || "";
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items  flex-column" data-filling="achievementsCard${sectionCount}">
            <span class="item" data-edit="achievement">${achievements}</span>
            <span class="item" data-edit="description">${description}</span>
        </div>`;
    $cvContent.find(`.section.achievements .content`).append($cvHTML);
}

function achievementsSectionCardHTML(cardType, data = {}) {
    let achievements = data.achievement || "",
        description = data.description || "";
    let cardHTML =
        `<div class="card shadow-sm resume-folding-card mb-3">
            <div class="card-header collapsible cursor-pointer rotate active"
                data-bs-toggle="collapse" data-bs-target="#${cardType}Card${sectionCount}">
                <h3 class="card-title">${achievements}</h3>
                <div class="content-center">
                    <i class=" fa fa-trash text-white mr-3 delete-card-item" data-delete="${cardType}Card${sectionCount}" data-card="${cardType}"></i>
                    <div class="card-toolbar">
                        <i class="ki-duotone ki-down fs-1 text-white fold-arrow"></i>
                    </div>
                </div>
            </div>
            <div id="${cardType}Card${sectionCount}" class="collapse show">
                <div class="card-body p-3">
                <form>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" name="achievement" value="${achievements}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="achievement" data-section="achievements"
                                    autocomplete="off" placeholder="Achievements">
                                <label for="username">Achievements</label>
                            </div>
                        </div>
                        <div class="col-md-12 editor-container">
                            <label for="username">Description</label>
                            <textarea data-name="description" id="tinymceEditor${sectionCount}" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="achievements" cols="30"
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>`;
    if (cardType == "achievements") {
        appendachievementsHTML(sectionCount, data);
    }
    tinymceEditorIds.push(sectionCount);
    return cardHTML;
}
//#endregion achievements

// Loader toggle
function loaderToggle(toggle = true) {
    let $loader = $(".custom-loader-container"),
        $cvContainer = $(".cv-content-container");

    $loader.removeClass("d-none");
    $cvContainer.css("overflow", "hidden");
    if (!toggle) {
        $loader.addClass("d-none");
        $cvContainer.removeAttr("style");
    }
}

// Init Tinymce Editor init
function initTinymceEditor(count) {
    let $cvContent = $(".cvContent");
    tinymce.init({
        selector: `#tinymceEditor${count}`,
        height: "350",
        menubar: false,
        toolbar: ["styleselect fontselect fontsizeselect",
            "undo redo | bold italic | alignleft aligncenter alignright alignjustify",
            "bullist numlist | outdent indent | lineHeight"],
        plugins: "advlist autolink link image lists charmap print preview code",
        setup: function (editor) {
            // Bind change event to TinyMCE editor
            editor.on('change input', function () {
                // Get content of the editor
                let content = editor.getContent(),
                    textareaElement = $(editor.targetElm),
                    cardName = textareaElement.data('card'),
                    target = textareaElement.data("fill"),
                    section = textareaElement.data("section");
                content = content.replace(/<p>/g, '<p style="font-family: var(--fontFamily)">'); // You can adjust the line-height value as needed
                // Value fill
                if (target == "summary") {
                    $cvContent.find(`[data-filling="${target}"]`).html(content);
                } else {
                    $cvContent.find(`.section.${section} .items[data-filling="${cardName}"] .item[data-edit="${target}"]`).html(content);
                }
                // Update hidden input value
                textareaElement.parents(".editor-container").find("input[type='hidden']").val(content);
            });
        },
        init_instance_callback: function (editor) {
            let textareaElement = $(editor.targetElm),
                textareaName = textareaElement.data("name");
            $('<input class="editor-input">').attr({
                type: 'hidden',
                name: textareaName,
                value: editor.getContent()
            }).appendTo($(editor.getElement()).closest('.editor-container'));
        }
    });
}
