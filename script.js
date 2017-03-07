$(function ready() {
  if ($(window).height() > $('.landing').outerHeight(true) + 50) {
    $('.scroll-arrow').hide();
  }

  $(window).on('scroll', function () {
    $('.scroll-arrow').hide();
  });

  $('.js-open-chatbox').on('click', function (event) {
    event.preventDefault();
    $('.modal-backdrop').show();
    setTimeout(function () {
      $('.modal-backdrop').addClass('in');

      $('body').addClass('modal-open');

      $('.chatbox').show();
      $('.chatbox .frame-container').html('<iframe src="http://muki.webfactional.com/djstatic/breakfree/" border="0"></iframe>');
    }, 150);
  });

  $('.modal-backdrop, .chatbox button.close').on('click', closeChat);

  function closeChat(event) {
    event.preventDefault();
    $('body').removeClass('modal-open');

    $('.chatbox').hide();
    $('.chatbox .frame').remove();
    $('.modal-backdrop').removeClass('in');
    setTimeout(function () {
      $('.modal-backdrop').hide();
    }, 150);
  }

  $('.js-signaturenames').load('http://djnd-test.lepko.net/podpisek/?k=breakfree&list', function () {
    var $this = $(this);
    if (parseInt($this.css('max-height'), 10) > $this.height()) {
      showAllSignatures();
    }
  });

  function showAllSignatures() {
    $('.js-more').remove();
    $('.js-signaturenames').removeClass('show-less');
  }

  $('.js-more').on('click', showAllSignatures);

  var maxSignatures = parseInt($('.js-signaturemax').text(), 10);
  $.get('http://djnd-test.lepko.net/podpisek/?k=breakfree&count', function (res) {
    var count = parseInt(res, 10);
    if (!isNaN(count)) {
      var percent = Math.floor(Math.min(count / maxSignatures * 100, 100));
      $('.js-signaturecount').text(count);
      $('.petition .progress-bar').attr('aria-valuenow', percent).css('width', percent + '%');
      $('.petition .progress-bar span').text(percent + '%');
    }
  });

  $('.petition__form').on('submit', function (event) {
    event.preventDefault();
    var data = {
      k: 'breakfree',
      name: $('#petition-name').val(),
      email: $('#petition-email').val(),
      petition_greenpeace: $('#petition-greenpeace').val(),
      petition_djnd: $('#petition-djnd').val(),
    };
    console.log(data);
    $.get('http://djnd-test.lepko.net/podpisek/', data, function (res) {
      if (res == 'success') {
        $('.js-petition-error').text('');
        $('.petition__form').hide();
        $('.petition__reset').show();
      } else {
        console.log('error', res);
        $('.js-petition-error').text('Napaka: ' + res);
      }
    });
  });

  $('.petition__reset button').on('click', function () {
    $('#petition-name').val('');
    $('#petition-email').val('');
    $('#petition-greenpeace, #petition-djnd').each(function () {
      this.checked = this.defaultChecked;
    });

    $('.petition__form').show();
    $('.petition__reset').hide();
  });

  var link = document.location.href;
  $.ajax({
    method: 'POST',
    url: 'http://www.djnd.si/yomamasofat/',
    data: {
      fatmama: document.location.href,
    },
    success: function (resp) {
      link = resp;
    }
  });

  var title = 'Break Free SI';
  var text = 'Čas je zdaj: osvobodimo se fosilnih goriv!';
  var hashtags = '#breakfree';
  //social
  $('.js-facebook').on('click', function () {
    var url = 'https://www.facebook.com/dialog/feed?app_id=301375193309601&redirect_uri=' + encodeURIComponent(document.location.href) + '&link=' + encodeURIComponent(document.location.href) + '&ref=responsive&name=' + encodeURIComponent(title);
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'facebook');
    return false;
  });
  $('.js-twitter').on('click', function () {
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + hashtags + ' ' + link);
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'twitter');
    return false;
  });
  $('.js-gplus').on('click', function () {
    var url = 'https://plus.google.com/share?url=' + encodeURIComponent(document.location.href);
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'gplus');
    return false;
  });
  $('.js-email').on('click', function () {
    var url = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + text + ' ' + encodeURIComponent(document.location.href);
    window.open(url, '_blank');
    // ga('send', 'event', 'social', 'email');
    return false;
  });
});
