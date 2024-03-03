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



//#region Education
function appendEducationHTML(sectionCount) {
    let $cvHTML =
        `<div class="items pl-3" data-filling="educationCard${sectionCount}">
            <span class="item" data-edit="degree"></span>
            <span class="item" data-edit="universty"></span>
            <span class="item" data-edit="location"></span>
            <span class="item" data-edit="date"></span>
            <span class="item" data-edit="description"></span>
        </div>`;
    cvMainContent.find(`.section.education`).append($cvHTML);
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