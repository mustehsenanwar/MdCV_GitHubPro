// Color Change
$(document).on('change input', ".cvColorChange", function () {
    let color = $(this).val();
    changeColor(color);
});

// Print CV
$(document).on('click', ".printCV", function () {
    printCV();
});



$(function () {
    //list of skills
    var skills = {
        JavaScript: '100',
        HTML: '67',
        CSS: '37',
        PHP: '28',
        Java: '19'

    };

    displayData(skills);
    animate();

    //add new skill
    $('input:button').click(function () {
        var name = $('#txtSkill').val(),
            perc = $('#txtPerc').val();

        if (name && perc) {
            skills[name] = perc;
            displayData(skills);
            animate();

            var newheight = $('.chart').outerHeight() + 50;
            $('.chart').css('height', newheight);
        } else {
            animate();
        }
        $('input:text').val('');
    });
});


//Functions
//display data
function displayData(skills) {
    $('.bars').html('');
    $('.skills').html('');
    for (let key in skills) {
        $('.skills').append("<li><span>" + key + "</span></li>");
        $('.bars').append(`<li><div data-percentage='${skills[key]}' class='bar'></div></li>`);
    };
}


//animate the data
function animate() {
    $('.bar').css('width', '0px');
    $(".bars .bar").each(function (i) {
        var percentage = $(this).data('percentage');

        $(this).delay(i + "00").animate({ 'width': percentage + '%' }, 700);
        $(this).html($(this).html() + "<div class='perc'>" + percentage + "</div>");
    });
}