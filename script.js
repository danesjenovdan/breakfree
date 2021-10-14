$(function ready() {
  var petitionName = 'nedamonarave';
  var allNames = '';

  var $sigNames = $('.js-signaturenames');

  function showAllSignatures() {
    $sigNames.text('');
    allNames.split(', ').forEach(function(name) {
      $sigNames.append(name + ', ');
    });
    $('.js-more').remove();
    $('.js-signaturenames').removeClass('show-less');
  }

  $('.js-more').on('click', showAllSignatures);

  $.ajax('https://api.djnd.si/getAllSignaturesAndCountForMultiple/?peticije=' + petitionName).done(function(res) {
    // $sigNames.text('... ' + (res.names || '').slice(-5000));
    //res.names.split(', ').forEach(function(name) {
    //  $sigNames.append(name + ', ');
    //});
    $sigNames.text((res.names || '').slice(0, 4000));
    allNames = res.names;
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
  // $.ajax({
  //   method: 'POST',
  //   url: 'https://djnd.si/yomamasofat/',
  //   data: {
  //     fatmama: document.location.href,
  //   },
  //   success: function(resp) {
  //     link = resp;
  //   },
  // });

  var title = '@JernejVrtovec, nismo pozabili, da je Slovenija še vedno članica ECT, ki je ovira za razogljičenje.';
  var FBtitle = 'Jernej Vrtovec, nismo pozabili, da je Slovenija še vedno članica ECT, ki je ovira za razogljičenje.';
  var text = 'Prvo priložnost za predlog izstopa ste zamudili. Boste imeli do COP26 v Glasgowu konec meseca že čisto vest, mi pa bolj čisto okolje?';
  var hashtags = '#exitECT #talcifosilov #koncajtetonorost';
  // social
  $('.js-facebook').on('click', function() {
    var url = 'https://www.facebook.com/dialog/feed?app_id=301375193309601&redirect_uri=' + encodeURIComponent(document.location.href) + '&link=' + encodeURIComponent(document.location.href) + '&ref=responsive&quote=' + encodeURIComponent(FBtitle + ' ' + text + ' ' + hashtags);
    window.open(url, '_blank');
    plausible('FB share')
    return false;
  });
  $('.js-twitter').on('click', function() {
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title + ' ' + text + ' ' + hashtags + ' ' + link);
    window.open(url, '_blank');
    plausible('TW share')
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

  // DATE MATH
  // To set two dates to two variables
  var date1 = new Date();
  var date2 = new Date("10/31/2021");
    
  // To calculate the time difference of two dates
  var differenceInTime = date2.getTime() - date1.getTime();
    
  // To calculate the no. of days between two dates
  var differenceInDays = differenceInTime / (1000 * 3600 * 24);
    
  //To display the final no. of days (result)
  $('#days').text(Math.floor(differenceInDays));
});
