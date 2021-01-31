$(function ready() {
  var petitionName = 'univerzapetition';
  var allNames = '';

  var $sigNames = $('.js-signaturenames');
  var staticNames = 'prof. dr. Marko Marinčič (FF UL), prof. dr. Igor Papič (FE UL), prof. dr. Stanislav Pejovnik (FKKT UL), prof. dr. Gregor Anderluh (Kemijski inštitut), prof. dr. Jože Mencinger (PF UL), prof. dr. Ivan Svetlik (FDV UL), doc. dr. Gorazd Kovačič (FF UL), Branimir Štrukelj (SVIZ), izr. prof. dr. Marija Javornik Krečič (FF UM), prof. dr. Danijel Rebolj (UM), prof. dr. Rado Bohinc (FDV UL, nekdanji rektor UP), prof. dr. Lucija Čok (nekdanja rektorica UP)';
  var staticNum = staticNames.split(', ').length;

  function showAllSignatures() {
    $sigNames.text(staticNames + ', ');
    allNames.split(', ').forEach(function(name, i, arr) {
      $sigNames.append(name + (i === arr.length - 1 ? '' : ', '));
    });
    $('.js-more').remove();
    $('.js-signaturenames').removeClass('show-less');
  }

  $('.js-more').on('click', showAllSignatures);

  $.ajax('https://api.djnd.si/getAllSignaturesAndCountForMultiple/?peticije=' + petitionName).done(function(res) {
    $sigNames.text(staticNames + ', ' + (res.names || '').slice(0, 4000));
    allNames = res.names;
    if (parseInt($sigNames.css('max-height'), 10) > $sigNames.height()) {
      showAllSignatures();
    }
    var maxSignatures = parseInt($('.js-signaturemax').text(), 10);
    var count = res.counter;
    if (typeof count === 'number' && !isNaN(count)) {
      var percent = Math.floor(Math.min(count / maxSignatures * 100, 100));
      $('.js-signaturecount').text(staticNum + count);
      $('.petition .progress-bar').attr('aria-valuenow', percent).css('width', percent + '%');
      $('.petition .progress-bar span').text(percent + '%');
    }
  });

  $('.petition__form').on('submit', function(event) {
    event.preventDefault();

    var emailVal = $.trim($('#petition-email').val() || '');
    var nameVal = $.trim($('#petition-name').val() || '');
    var orgVal = $.trim($('#petition-org').val() || '');

    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailVal.match(emailPattern)) {
      alert('Tvoj email ne izgleda kot email. Prosim poskusi ponovno.');
      return;
    }

    // var namePattern = /^(([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+[\-\']?)*([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+)?\s)+([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+[\-\']?)*([A-Za-zšđžčćäëöüŠĐŽČĆÄËÖÜéÉ]+)?$/;
    // if (!nameVal.match(namePattern)) {
    //   alert('Tvoje ime ne izgleda kot ime. Prosim poskusi ponovno.');
    //   return;
    // }
    if (!nameVal || nameVal.length < 4 || nameVal.indexOf(' ') === -1) {
      alert('Tvoje ime ne izgleda kot ime. Prosim poskusi ponovno.');
    }

    $(this).find(':input').attr('disabled', true);

    var data = {
      name: nameVal + (orgVal ? ' (' + orgVal + ')' : ''),
      email: emailVal,
      peticija: petitionName + '.consent=' + true
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
    $('#petition-org').val('');
    $('#petition-email').val('');

    $('.petition__form').show();
    $('.petition__reset').hide();
  });

  // var link = document.location.href;
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

  var title = 'Peticija proti uničevanju javnega visokega šolstva in znanosti';
  var text = 'Podpri javno visoko šolstvo in znanost ter podpiši peticijo proti njuni razgradnji!';
  var hashtags = '#akademskaskupnost';
  // social
  $('.js-facebook').on('click', function() {
    var url = 'https://www.facebook.com/dialog/feed?app_id=247501873333164&redirect_uri=' + encodeURIComponent(document.location.href) + '&link=' + encodeURIComponent(document.location.href) + '&ref=responsive&name=' + encodeURIComponent(title);
    window.open(url, '_blank');
    return false;
  });
  $('.js-twitter').on('click', function() {
    var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + hashtags + ' ' + document.location.href);
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
