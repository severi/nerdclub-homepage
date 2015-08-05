$(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
        $('.navbar').addClass('shrink');
    } else {
        $('.navbar').removeClass('shrink');
    }
});
