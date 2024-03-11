let sectionCount = 1;
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

// Color Change
function changeColor(newColor) {
    document.documentElement.style.setProperty('--theme1', newColor);
}

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
            <i class="fa fa-circle"></i>
            <div class="w-100 pull-away pr-5">
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
        `<div class="item" data-filling="hobbiesCard${sectionCount}">
            <i class="fa fa-circle"></i>
            <div class="w-100 pull-away pr-5">
                <span class="text" data-edit="text">${text}</span>
            </div>
        </div>`;
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
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" value="${degree}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="degree" data-section="education"
                                    autocomplete="off" placeholder="Degree Name">
                                <label for="username">Degree</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="university" value="${university}" data-section="education"
                                    autocomplete="off" placeholder="University">
                                <label for="username">University</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" value="${location}" data-section="education"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
                                    data-section="education" value="${date}" autocomplete="off"
                                    placeholder="e.g (2020-2021)">
                                <label for="username">Dates</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <label for="username">Description</label>
                            <textarea name="description" data-card="${cardType}Card${sectionCount}"
                                class="form-control input-fill-value"
                                data-fill="description" data-section="education" cols="30"
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "education") {
        appendEducationHTML(sectionCount, data);
    }
    return cardHTML;
}
//#endregion Education


//#region Experience 
function appendExprienceHTML(sectionCount, data = {}) {
    let designation = data.designation || "",
        companyName = data['company-name'] || "",
        location = data.location || "",
        date = data.date || "",
        description = data.description || "";
    let $cvHTML =
        `<div class="items pl-3 mt-3" data-filling="experienceCard${sectionCount}">
            <span class="item" data-edit="designation">${designation}</span>
            <span class="item" data-edit="company-name">${companyName}</span>
            <span class="item" data-edit="location">${location}</span>
            <span class="item" data-edit="date">${date}</span>
            <span class="item" data-edit="description">${description}</span>
        </div>`;
    cvMainContent.find(`.section.experience .content`).append($cvHTML);
}

function expriencesectionCardHTML(cardType, data = {}) {
    let designation = data.designation || "",
        companyName = data['company-name'] || "",
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
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" value="${designation}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="designation" data-section="experience"
                                    autocomplete="off" placeholder="Designation">
                                <label for="username">Designation</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" value="${companyName}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="company-name" data-section="experience"
                                    autocomplete="off" placeholder="Company Name">
                                <label for="username">Company Name</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" value="${location}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" data-section="experience"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" value="${date}" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
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
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "experience") {
        appendExprienceHTML(sectionCount, data);
    }
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
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" value="${certificate}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="certificate" data-section="certificates"
                                    autocomplete="off" placeholder="Certificate">
                                <label for="username">Certificate</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" value="${organization}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="organization" data-section="certificates"
                                    autocomplete="off" placeholder="Organization">
                                <label for="username">Organization</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" value="${location}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
                                    data-fill="location" data-section="certificates"
                                    autocomplete="off" placeholder="e.g Emirati">
                                <label for="username">Location</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-item">
                                <input type="text" value="${date}" data-card="${cardType}Card${sectionCount}" class="input-fill-value" data-fill="date"
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
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "certificates") {
        appendCertificatesHTML(sectionCount, data);
    }
    return cardHTML;
}
//#endregion certificates 


//#region soft skill
function appendSoftSkillHTML(sectionCount, data = {}) {
    let skill = data.skill || "",
        description = data.description || "";
    let $cvHTML =
        `<div class="items pl-3 mt-1 pt-0 flex-column" data-filling="softSkillCard${sectionCount}">
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
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" value="${skill}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
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
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "softSkill") {
        appendSoftSkillHTML(sectionCount, data);
    }
    return cardHTML;
}
//#endregion soft skill 

//#region achievements
function appendachievementsHTML(sectionCount, data = {}) {
    let achievements = data.achievements || "",
        description = data.description || "";
    let $cvContent = $(".cvContent");
    let $cvHTML =
        `<div class="items pl-3 mt-1 pt-0 flex-column" data-filling="achievementsCard${sectionCount}">
            <span class="item" data-edit="achievements">${achievements}</span>
            <span class="item" data-edit="description">${description}</span>
        </div>`;
    $cvContent.find(`.section.achievements .content`).append($cvHTML);
}

function achievementsSectionCardHTML(cardType, data = {}) {
    let achievements = data.achievements || "",
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
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-item">
                                <input type="text" value="${achievements}" data-card="${cardType}Card${sectionCount}" class="input-fill-value"
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
                                rows="5">${description}</textarea>
                        </div>
                        <div class="col-md-12">
                            <div class="ai-suggestion-btn">AI Suggestions</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    if (cardType == "achievements") {
        appendachievementsHTML(sectionCount, data);
    }
    return cardHTML;
}
//#endregion achievements