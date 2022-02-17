$(function ready() {
  const petitionName = 'stanovanjskezadruge';

  const progressBar = $('.progress-bar');

  $.ajax('https://api.djnd.si/getAllSignaturesAndCountForMultiple/?peticije=' + petitionName).done(function(res) {
    $('.counter').text(res.counter);
    $('.counter-minus').text(3000 - res.counter);
    let progressBarWidth = Math.ceil(res.counter/3000*100)
    if (progressBarWidth < 2) {
      progressBarWidth = 2;
    }
    progressBar.css('width', progressBarWidth + '%');
    progressBar.attr('aria-valuenow', res.counter);
  });

  $('form.sign-petition-box').on('submit', function(event) {
    event.preventDefault();

    const nameVal = $.trim($('#name').val() || '');
    const emailVal = $.trim($('#email').val() || '');
    const newsletter = $('#newsletter').is(":checked"); // TODO: subscribe

    if (!nameVal || nameVal.length < 4 || nameVal.indexOf(' ') === -1) {
      alert('Tvoje ime ne izgleda kot ime. Prosim poskusi ponovno.');
      return;
    }

    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailVal.match(emailPattern)) {
      alert('Tvoj email ne izgleda kot email. Prosim poskusi ponovno.');
      return;
    }

    $(this).find(':input').attr('disabled', true);

    const data = {
      name: nameVal,
      email: emailVal,
      peticija: petitionName + '.consent=' + true
    };

    $.get('https://api.djnd.si/sign/', data, function(res) {
        if (res === 'Saved') {
          $.post( "https://stanovanjske-zadruge-zemljevid.lb.djnd.si/api/token/", function( data ) {
            console.log( data )
            if (data.status === 'success') {
              const token = data.data.token;
              $('.sign-error').text('');
              $('form.sign-petition-box').hide();
              $('.petition__reset').show();
              $('#map-link').attr("href", `https://stanovanjske-zadruge-zemljevid-peticija.lb.djnd.si/?token=${token}`);
            }
          }, "json");
        } else {
          $('#petition__error').text('Prišlo je do napake: ' + res);
          $('form.sign-petition-box').find(':input').attr('disabled', false);
        }
      }
    );
  });

});
