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