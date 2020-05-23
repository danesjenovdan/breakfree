$(function ready() {
  var petitionName = 'nedamonarave';

  function showAllSignatures() {
    $('.js-more').remove();
    $('.js-signaturenames').removeClass('show-less');
  }

  $('.js-more').on('click', showAllSignatures);

  $.ajax('https://api.djnd.si/getAllSignaturesAndCountForMultiple/?peticije=' + petitionName).done(function(res) {
    var $sigNames = $('.js-signaturenames');
    $sigNames.text(res.names);
    if (parseInt($sigNames.css('max-height'), 10) > $sigNames.height()) {
      showAllSignatures();
    }
    var maxSignatures = parseInt($('.js-signaturemax').text(), 10);
    var count = res.counter;
    if (typeof count === 'number' && !isNaN(count)) {
      var percent = Math.floor(Math.min(count / maxSignatures * 100, 100));
      $('.js-signaturecount').text(count);
      $('.petition .progress-bar').attr('aria-valuenow', percent).css('width', percent + '%');
      $('.petition .progress-bar span').text(percent + '%');
    }
  });

  $('.petition__form').on('submit', function(event) {
    event.preventDefault();

    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!$('#petition-email').val().match(emailPattern)) {
      alert('Tvoj email ne izgleda kot email. Prosim poskusi ponovno.');
      return;
    }

    var namePattern = /^(([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+[\-\']?)*([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+)?\s)+([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+[\-\']?)*([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+)?$/;
    if (!$('#petition-name').val().match(namePattern)) {
      alert('Tvoje ime ne izgleda kot ime. Prosim poskusi ponovno.');
      return;
    }

    $(this).find(':input').attr('disabled', true);

    var data = {
      name: $('#petition-name').val(),
      email: $('#petition-email').val(),
      peticija: petitionName + '.consent=' + $('#petition-consent')[0].checked
    };

    $.get('https://api.djnd.si/sign/', data, function(res) {
        if (res === 'Saved') {
          $('.js-petition-error').text('');
          $('.petition__form').hide();
          $('.petition__reset').show();
        } else {
          console.error('error', res);
          $('.js-petition-error').text('Napaka: ' + res);
          $('.petition__form').find(':input').attr('disabled', false);
        }
      }
    );
  });

  $('.petition__reset .btn-link').on('click', function() {
    $('.petition__form').find(':input').attr('disabled', false);

    $('#petition-name').val('');
    $('#petition-email').val('');
    $('#petition-consent').each(function() {
      this.checked = this.defaultChecked;
    });

    $('.petition__form').show();
    $('.petition__reset').hide();
  });

  var link = document.location.href;
  $.ajax({
    method: 'POST',
    url: 'https://djnd.si/yomamasofat/',
    data: {
      fatmama: document.location.href,
    },
    success: function(resp) {
      link = resp;
    },
  });

  var title = 'Ustavimo razprodajo slovenske narave!';
  var text = 'Podpišite peticijo in pomagajte ustaviti razprodajo naše narave in prihodnosti.';
  var hashtags = '#naravenedamo';
  // social
  $('.js-facebook').on('click', function() {
    var url = 'https://www.facebook.com/dialog/feed?app_id=301375193309601&redirect_uri=' + encodeURIComponent(document.location.href) + '&link=' + encodeURIComponent(document.location.href) + '&ref=responsive&name=' + encodeURIComponent(title);
    window.open(url, '_blank');
    return false;
  });
  $('.js-twitter').on('click', function() {
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + hashtags + ' ' + link);
    window.open(url, '_blank');
    return false;
  });
  $('.js-email').on('click', function() {
    var url = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + text + ' ' + encodeURIComponent(document.location.href);
    window.open(url, '_blank');
    return false;
  });

  $('#btn-scroll').on('click', function() {
    $([document.documentElement, document.body]).animate({
      scrollTop: $(".petition__form").offset().top
  }, 2000);
  });

});
