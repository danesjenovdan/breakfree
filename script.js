$(function ready() {
  if ($(window).height() > $('.landing').outerHeight(true) + 50) {
    $('.scroll-arrow').hide();
  }

  $(window).on('scroll', function () {
    $('.scroll-arrow').hide();
  });

  $('.js-open-chatbox').on('click', function (event) {
    event.preventDefault();
    // $('.modal-backdrop').show();
    // setTimeout(function () {
    //   $('.modal-backdrop').addClass('in');

    //   $('body').addClass('modal-open');

      $('.chatbox').show();
      $('.chatbox .frame-container').html('<iframe src="http://muki.webfactional.com/djstatic/breakfree/" border="0"></iframe>');
    // }, 150);
  });

  $('.modal-backdrop, .chatbox button.close').on('click', closeChat);

  function closeChat(event) {
    event.preventDefault();
    // $('body').removeClass('modal-open');

    $('.chatbox').hide();
    $('.chatbox .frame').remove();
    // $('.modal-backdrop').removeClass('in');
    // setTimeout(function () {
    //   $('.modal-backdrop').hide();
    // }, 150);
  }

  function showAllSignatures() {
    $('.js-more').remove();
    $('.js-signaturenames').removeClass('show-less');
  }

  $('.js-more').on('click', showAllSignatures);

  var maxSignatures = parseInt($('.js-signaturemax').text(), 10);
  $.get('https://djapi.knedl.si/getKuraSignatures/', function(r) {
    // var count = parseInt(res, 10);
    var all = r.names;
    $('.js-signaturenames').text(all)
    var count = r.counter;
    if (!isNaN(count)) {
      var percent = Math.floor(Math.min(count / maxSignatures * 100, 100));
      $('.js-signaturecount').text(count);
      // $('.js-signaturecount-bottom').text(r.names.split(',').length);
      $('.petition .progress-bar').attr('aria-valuenow', percent).css('width', percent + '%');
      $('.petition .progress-bar span').text(percent + '%');
    }
  });

  $('.petition__form').on('submit', function (event) {
    event.preventDefault();
    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var namePattern = /^(([A-Za-zšđžčćŠĐŽČĆé]+[\-\']?)*([A-Za-zšđžčćŠĐŽČĆé]+)?\s)+([A-Za-zšđžčćŠĐŽČĆé]+[\-\']?)*([A-Za-zšđžčćŠĐŽČĆé]+)?$/;
    if ($('#petition-email').val().match(emailPattern)) {
      if ($('#petition-name').val().match(namePattern)) {
        var data = {
          peticija: 'imasjajca.djnd' + $('#petition-djnd')[0].checked + '.dzzz' + $('#petition-greenpeace')[0].checked,
          name: $('#petition-name').val(),
          email: $('#petition-email').val(),
        };
        console.log(data);
        $.get('https://djapi.knedl.si/sign/', data, function (res) {
          console.log(res);
          if (res == 'Saved') {
            $('.js-petition-error').text('');
            $('.petition__form').hide();
            $('.petition__reset').show();
          } else {
            console.log('error', res);
            $('.js-petition-error').text('Napaka: ' + res);
          }
        });
      } else {
        alert('Tvoje ime ne izgleda kot ime. Prosim poskusi ponovno.')
      }
    } else {
      alert('Tvoj email ne izgleda kot email. Prosim poskusi ponovno.')
    }
  });

  $('.petition__reset .btn-link').on('click', function () {
    $('#petition-name').val('');
    $('#petition-email').val('');
    $('#petition-greenpeace, #petition-djnd').each(function () {
      this.checked = this.defaultChecked;
    });

    $('.petition__form').show();
    $('.petition__reset').hide();
  });

  var link = document.location.href;
  // $.ajax({
  //   method: 'POST',
  //   url: 'http://www.djnd.si/yomamasofat/',
  //   data: {
  //     fatmama: document.location.href,
  //   },
  //   success: function (resp) {
  //     link = resp;
  //   }
  // });

  var title = 'Imaš jajca?';
  var text = 'Baterijsko rejo moramo ukiniti!';
  var hashtags = '#imasjajca';
  //social
  $('.js-facebook').on('click', function () {
    var url = 'https://www.facebook.com/dialog/feed?app_id=374830049649678&redirect_uri=' + encodeURIComponent(document.location.href) + '&link=' + encodeURIComponent(document.location.href) + '&ref=responsive&name=' + encodeURIComponent(title);
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
