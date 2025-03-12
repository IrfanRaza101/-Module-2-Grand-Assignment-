"use strict";

$('.order').click(function (e) {
  var button = $(this);

  if (!button.hasClass('animate')) {
    button.addClass('animate');
    setTimeout(function () {
      button.removeClass('animate');
    }, 10000);
  }
});