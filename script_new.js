$(function ready() {
  var petitionName = 'copyleft';
  var subject = 'Fix copyright before it is too late / Popravimo avtorsko pravo, preden bo prepozno';
  var content = '';
  $.get('./mail.html', function(res) {
    content = res;
  });

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
      peticija: petitionName + '.djnd=' + $('#petition-djnd')[0].checked + '.savethelink=' + $('#petition-savethelink')[0].checked,
      // subject,
      // content,
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
    $('#petition-savethelink, #petition-djnd').each(function() {
      this.checked = this.defaultChecked;
    });

    $('.petition__form').show();
    $('.petition__reset').hide();
  });

  // hover state on ios
  $(document).on('touchstart', function(event) {
    const $hover = $(event.target).closest('.demand__hover, .demand__text');
    const $demands = $('.demand');
    if ($hover.length) {
      $demands.removeClass('hover');
      $hover.closest('.demand').addClass('hover');
    } else {
      $demands.removeClass('hover');
    }
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

  var title = 'Rešimo internet';
  var text = 'Podpiši peticijo in od evropskih poslank/-cev zahtevaj, da glasujejo proti reformi avtorskega prava ter zaščitijo tvoje internetno življenje!';
  var hashtags = '#copyleft';
  //social
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
  $('.js-gplus').on('click', function() {
    var url = 'https://plus.google.com/share?url=' + encodeURIComponent(document.location.href);
    window.open(url, '_blank');
    return false;
  });
  $('.js-email').on('click', function() {
    var url = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + text + ' ' + encodeURIComponent(document.location.href);
    window.open(url, '_blank');
    return false;
  });


  // MODALS
  $('.modal').on('hide.bs.modal', function (e) {
    $('html, body').css('overflow-y', '');
  });

  $('.modal').on('show.bs.modal', function (e) {
    $('html, body').css('overflow-y', 'hidden');
  });

  var sdsResponse = [
    "&raquo;Evropski poslanci iz vrst SDS menimo, da je nova direktiva o avtorskih pravicah potrebna, saj je trenutno v uporabi tista iz leta 2000, od takrat pa se je področje internetnih storitev močno razvilo. Avtorji si vsekakor zaslužijo pravično plačilo za svoje delo in tisti, ki zagovarjajo dejstvo, da je avtorstvo na internetu lastnina vsakega izmed nas, postavljajo avtorje v ničvreden položaj. Po tej logiki bi morale biti tudi knjige in časopisi zastonj. V SDS se zavzemamo za spoštovanje lastnine, torej tudi spoštovanje avtorskih pravic.",
    "Kljub temu menimo, da je postopek, o katerem bomo odločali v četrtek, preuranjen, saj temelji na tem, da se zaradi zaključka mandata vsem mudi. Menimo, da si tako pomembna direktiva pred začetkom pogajanj zasluži širšo razpravo tudi izven odbora JURI, ki je mimogrede najmanjši odbor v Evropskem parlamentu in šteje le 20 članov. Ob dejstvu, da podpora direktivi tudi  v odboru ni bila enotna in da je večina političnih skupin razdeljena v svojem mnenju, ni potrebe po hitenju. Želimo si, da bi glasovali o usklajenem predlogu, ki bi ga podpirala velika večina poslancev in ki bi ga pred glasovanjem usvojila tudi slovenska in evropska javnost.",
    "Naj opozorimo, da je bilo velikokrat v medijih predstavljeno napačno dejstvo, da bo Evropski parlament ta teden glasoval o zakonodaji, kar ne drži. V četrtek bomo glasovali le o podelitvi mandata za začetek pogajanj – trialog z Evropsko komisijo in Svetom EU. Evropski poslanci iz SDS bomo pri glasovanju upoštevali pozive mnogih strokovnjakov in avtentične prošnje zaskrbljenih slovenskih državljanov, tudi iz sfere gospodarstva in medijev in v tej fazi podelitve mandata ne bomo podprli.&laquo;"
  ];

  var modalData = {
    'romana-tomc': {
      emails: 'romana.tomc-office@ep.europa.eu, romana.tomc@ep.europa.eu, maja.mikanec@ep.europa.eu, marta.osojnik@ep.europa.eu, andreja.pintar@ep.europa.eu',
      phone: {
        Slovenija:  '+386 (0)1 434 54 45',
        Bruselj:    '+32 (0)2 28 45 665',
        Strasbourg: '+33 (0)3 88 1 75 665',
      },
      response: sdsResponse,
    },
    'milan-zver': {
      emails: 'milan.zver@europarl.europa.eu, polona.kek@europarl.europa.eu, peter.suhel@europarl.europa.eu',
      phone: {
        Slovenija:  '+386 (0)40 672 819',
        Bruselj:    '+32 (0)2 28 45 315',
        Strasbourg: '+32 (0)2 28 37 315',
      },
      response: sdsResponse,
    },
    'ivo-vajgl': {
      emails: 'ivo.vajgl@europarl.europa.eu, antonino.arlacchi@europarl.europa.eu, damjan.stanonik@europarl.europa.eu, zrinka.mozara@europarl.europa.eu, vajgl.pisarna@gmail.com, tadeja.kuhar@ivovajgl.eu',
      phone: {
        Slovenija:  '+386 (0)41 808 414',
        Slovenija2: '+386 (0)51 395 540',
        Bruselj:    '+32 (0)2 28 37 620',
      },
      response: [
        "&raquo;Danes sem na zasedanju Evropskega parlamenta glasoval PROTI predlogu pristojnega odbora Evropskega parlamenta za pravne zadeve (JURI), da se prične postopek tristranskih pogajanj o predlogu direktive o avtorskih pravicah na enotnem digitalnem trgu (med Evropsko komisijo, Svetom EU in EP).",
        "S tem želim prispevati, da se odločanje prestavi na jesen in tako omogoči več časa za mirno, argumentirano in poglobljeno razpravo. Burni odzivi v zadnjih dneh kažejo, da te ni bilo dovolj, ali pa tema ni bila dovolj znana širši javnosti.",
        "Okoli te direktive so se očitno angažirali vsi resursi velikega kapitala na čelu z Googlom in drugimi spletnimi velikani, dobil sem tudi mnoge odzive umetnikov in drugih ustvarjalcev – avtorjev, ki z močnimi argumenti podpirajo sprejetje direktive. Množično so se odzvali tudi tisti, ki iskreno verjamejo, da poznajo najboljšo rešitev.",
        "Prepričan sem, da je po osemnajstih letih čas, da prenovimo pravni sistem zaščite avtorskih pravic, nikakor pa se to ne sme zgoditi na račun svobode interneta. Tako kot v primeru sporazuma ACTA, ki sem mu od vsega začetka nasprotoval, sem tudi v tem primeru po načelu previdnosti za to, da vse strani še enkrat soočijo argumente in poiščejo ustrezne rešitve, ki bodo omogočile, da bo ‘volk sit in koza cela’ oziroma sprejetje direktive o avtorskih pravicah, ki ne bo posegala v svobodo interneta, in da gospodarji interneta ne bodo posegali v naša življenja.&laquo;",
      ],
    },
    'patricija-sulin': {
      emails: 'patricija.sulin@europarl.europa.eu, robert.velikonja@europarl.europa.eu, tomaz.lisjak@europarl.europa.eu',
      phone: {
        Slovenija: '+386 (0)40 829 854',
        Bruselj:   '+32 (0)2 28 45 470',
      },
      response: sdsResponse,
    },
    'alojz-peterle': {
      emails: 'alojz.peterle@europarl.europa.eu, andrej.cernigoj@peterle.eu, blaz.karlin@europarl.europa.eu, marta.osojnik@ep.europa.eu',
      phone: {
        Slovenija:  '+386 (0)1 422 35 80',
        Bruselj:    '+32 (0)2 28 45 638',
        Strasbourg: '+33 (0)3 88 1 75 638',
      },
      response: [
        "&raquo;Ocenjujem, da bo vsebina direktive doživela še dopolnila in popravke. Razvoj dogodkov na tem področju budno spremljam. Zavzemam se za to, da informacije na spletu ostanejo dostopne. Razumem pa tudi željo in potrebo po tem, da se zaščiti svobodo tiska in uredi pošteno plačilo avtorjem. Kvalitetne vsebine postajajo prej izjema kot pravilo in ta trend moramo obrniti. Ne bom pa podpiral rešitev, ki bi uvajale filtriranje ali cenzuro.&laquo;"
      ],
    },
    'tanja-fajon': {
      emails: 'tanja.fajon@europarl.europa.eu, pisarna@tanja-fajon.eu, ajda.zizek@tanja-fajon.eu, maja.kezunovickrasek@tanja-fajon.eu, milica.kotur@ep.europa.eu, jure.tanko@ep.europa.eu',
      phone: {
        Slovenija:  '+386 (0)1 290 99 71',
        Bruselj:    '+32 (0)2 284 74 93',
        Strasbourg: '+33 (0)3 88 1 75 493',
      },
      response: [
        "&raquo;Skoraj 750 tisoč ljudi po vsej Evropi nas prosi v @EP_Slovenija, da zavarujemo že uveljavljene svoboščine interneta #SaveYourInternet in vnovič preučimo člena #Article11 in #Article13. Z odgovornostjo sprejemam poziv: Z vami delim iste skrbi. #EPlenary&laquo;",
        '<br><a href="https://twitter.com/tfajon/status/1014439422601900034">Povezava do tvita</a>',
      ],
    },
    'igor-soltes': {
      emails: '',
      phone: {},
      response: [
        "&raquo;Ocenjujem, da je predlog direktive pripravljen slabo in ima veliko pomanjkljivosti, uvedba direktive v praksi pa lahko povzroči nepopravljivo škodo za naše temeljne pravice in svoboščine, omeji svobodo izražanja, ustvarjalnost in inovativnost naše družbe ter prinese številne negativne posledice za področje izobraževanja, znanosti, kulture in novinarstva. Še več, gre za brezsramno vzpostavljanje cenzure na spletu, ki bi moral biti odprt in javen prostor, dostopen vsem in vsakomur. Prepričan sem, da to ni smer, v katero si Evropejke in Evropejci želimo iti. Svetovnega spleta ni brez svobode izražanja, niti brez svobodne izmenjave stališč in mnenj, zato bom glasoval za zavrnitev takšne direktive.",
        "Vsekakor nasprotujem 11. in 13. členu, ki lahko prineseta številne škodljive posledice. Izredno sporen je 13. člen, ki platformam in spletnim ponudnikom nalaga, da sprejmejo ukrepe za preprečitev kršitev avtorskih pravic na spletu, kar v resnici pomeni, da morajo sistematično spremljati vedenje svojih uporabnikov in filtrirati njihove prispevke. Gre za t. i. samodejne filtre, ki bodo nadzorovali naše fotografije, videoposnetke in besedila ter jih ob zgolj sumu kršitev avtorskih pravic tudi blokirali. To predstavlja resno grožnjo svobodi izražanja na spletu, omejuje nemoten pretok informacij in vzpostavlja prikrito cenzuro. Obenem to pomeni tudi veliko finančno breme za ponudnike, še zlasti  pa manjše  spletne platforme, ki si tega ne bodo morale privoščiti.  Nedvomno pa bi to ustrezalo velikim korporacijam, ki bi lahko na tak način povečevale svoje dobičke in pridobile še več nadzora nad spletom.",
        "Zelo sem kritičen tudi do 11. člena, ki vzpostavlja davek na povezave (ang. link tax), ki bo posameznikom povzročal številne težave pri vsakodnevni uporabi interneta, kot na primer pri izmenjavi stališč o različnih novicah in izražanju svojega mnenja na spletnih platformah. Ta člen namreč daje založnikom medijskih publikacij (npr. izdajateljem novic) pravico, da zaračunavajo nadomestilo za vsakršno rabo njihovih vsebin, četudi gre zgolj za kratek odlomek z objavo povezave do vira. Nesprejemljivo je, da se ozke interese velikih medijskih podjetij postavlja nad pravico vsakega posameznika, da svobodno sodeluje na internetu. Poleg tega pa gre za poskus uvedbe predpisa, ki se je že izjalovil v Nemčiji in Španiji, posledice pa so bile izrazito negativne, še zlasti za dostop do informacij, pa tudi za novinarstvo in neodvisne ustvarjalce.",
        "Nesprejemljivo je, da je parlamentarni odbor za pravne zadeve pred dnevi povsem preslišal vsa ta množična opozorila in kritike javnosti ter stroke. Vsi najbolj sporni deli tako žal še vedno ostajajo v predlogu direktive. V Skupini Zelenih/ESZ bomo to odločitev odbora izpodbijali in v juliju zahtevali, da se na plenarnem zasedanju Evropskega parlamenta o direktivi izrečejo prav vsi evropski poslanci. Prizadevali si bomo za to, da razveljavimo škodljivo odločitev odbora, kar bi omogočilo, da se predlog še dodobra spremeni in da se torej vendarle ohrani svoboden internet. Vsaka druga rešitev pa je nedopustna.&laquo;",
      ],
    },
    'franc-bogovic': {
      emails: 'franc.bogovic@ep.europa.eu, info@bogovic.eu, jure.bizjak@ep.europa.eu, gregor.kosir@ep.europa.eu, lejla.kogej@bogovic.eu, jure.osredkar@bogovic.eu, mateja.jagodic@bogovic.eu',
      phone: {
        Bruselj:    '+32 (0)2 28 45 583',
        Strasbourg: '+33 (0)3 88 1 75 583',
      },
      response: [
        "&raquo;Dovolite, da v uvodu pojasnim, da je trenutno stanje na evropskem trgu v luči spoštovanja avtorskih pravic v katastrofalnem stanju, saj je zakonodajna ureditev povsem prepuščena državam članicam, ki največkrat ne sledijo hitremu razvoju dogajanj na tem področju. Globalne spletne platforme, ki so glavni končni ponudnik vsebin pa ne nosijo nobene odgovornosti do avtorjev vsebin, ki se pojavljajo na njihovih straneh, čeprav te iste vsebine tržijo na različne načine. Zato je treba poudariti, da vsi, ki ostro nasprotujejo tej direktivi, na nek način podpirajo status quo, katerega pa v največji meri izkoriščajo ravno ameriški spletni koncerni, na katere vsi opozarjajo. Bitke z njimi Evropa ne bo dobila z gledanjem stran od problemov, temveč z uzakonitvijo pametne regulacije, ki bo zagotavljala poštena nadomestila za tiste, ki jim pripadajo. Moram pa biti jasen, niti slučajno to ne pomeni cenzure ali še huje, kakršnegakoli zapiranja internetnih vsebin. Moramo pa zadevo urediti tako, da se bo pri trženju internetnih vsebin vedelo, kdo pije in kdo plača, saj trenutno z njimi služijo tisti, ki jih prodajajo in ne tisti, ki jih ustvarjajo. (t. i. &raquo;value gap&laquo;)",
        "Zato se na tem mestu ne strinjam s filozofijo t. i. piratskih strank po Evropi, okoli katere se združuje tudi nasprotovanje direktivi v Sloveniji. Pravica do pravičnega nadomestila je temeljna pravica vsakega ustvarjalca vsebine ali glasbeno/vizualnega izdelka, ki mu omogoča preživetje in nadaljnje delo. To pravico nameravamo zaščititi, odprti internet pa si ne predstavljamo kot samopostrežno trgovino, kjer si vsak vzame kar mu paše, čeprav ni njegovo.",
        "Direktiva ne opredeljuje posameznih nadomestil, zavzema se samo za to, da bosta imela ponudnik vsebine in imetnik avtorskih pravic medsebojno urejen pravni status (licenca). Vse ostalo je stvar dogovora med njima.",
        "Sam se v Strasbourgu večkrat srečam s predstavniki slovenskih združenj na področju avtorskih pravic, kjer se pogovorimo o aktualnem dogajanju, zato sem kljub temu, da nisem član odbora JURI, na tekočem s spremembami, ki jih pripravlja Evropski parlament.",
        "Direktiva, o kateri bomo glasovali na julijskem zasedanju, še vedno ni popolna, in dopuščam možnost, da se bo sprejela kakšna rešitev, ki jo bo težko izvajati v praksi ali pa se bo izkazala za neposrečeno. Namreč, trenutno še nimamo dorečenih mehanizmov za njeno izvajanje. Verjetno sicer lahko še kakšno spremembo pričakujemo tudi skozi popravke na plenarnem zasedanju, kjer bomo še bolj natančno opredelili določene cilje. Še vedno pa se bo končna rešitev izoblikovala na trialogu treh evropskih institucij. Vendar, krenili smo v pravo smer, in iz vidika Slovenije je treba k temu pristopiti aktivno, saj so naši avtorji in založniki trenutno v zelo podrejenem položaju v luči svetovne glasbene, filmske in medijske industrije. Medtem ko so si velike multinacionalne založniške hiše danes že izborile nadomestila za svoje stranke (izvajalce in avtorje), pa manjšim ostane le bore malo. Direktiva gre torej v smer, da bo distribucija zaslužka bolj pošteno razdeljena med avtorje oz. izvajalce glede na njihov dejanski prispevek k celotni trženjski pogači.",
        "Člena 11. in 13. sta ključna dela te direktive in na njima stoji ali pade. Če želimo zagotoviti ustrezna nadomestila tudi za manjše založnike in avtorje vsebin, moramo iti s temi členi naprej, hkrati pa jim tudi zagotoviti možnost učinkovitega pravnega varstva v odnosu do večjih spletnih ponudnikov, ki njihove vsebine velikokrat tudi nelegalno tržijo naprej. To ne pomeni nujno dodatne obremenitve za nas potrošnike, temveč samo to, da bodo morali tisti, ki služijo z oglasnim prostorom, del tega zaslužka dati tudi založnikom in avtorjem. Namen direktive mora ostati sprejetje ureditve, ki bo sledila zagotavljanju enakovrednih pogojev založnikov na trgu ter upoštevala svobodo izražanja in obveščanja.",
        "Glede izjem smo dobili neposredno zagotovilo poročevalca Alexa Vossa (EPP), da bo Evropski parlament kot pogajalec vztrajal pri izjemi iz direktive za vse organizacije,  katerih trženje vsebin ni primarna dejavnost in pod katere eksplicitno sodijo vse izobraževalne in raziskovalne ustanove ter njihove podatkovne baze. Prav tako so iz  direktive izvzete objave t. i. &raquo;Hyperlink&laquo; povezav, torej zgolj zasebno deljenje obstoječih vsebin.",
        "Gre torej za zelo zahtevno področje, kjer pa bi morala Slovenija pristopiti kot aktivna udeleženka v zakonodajnem procesu. Zato je velika škoda, da Vlada RS še vedno ni uspela sprejeti stališča do te direktive in glede na trenutno politično situacijo se bojim, da ga še nekaj časa ne bo. Zato obstaja bojazen, da bo ta direktiva pripravljena brez konkretnega slovenskega prispevka.&laquo;",
      ],
    },
  };

  var copyText = [
    "Spoštovani poslanec oz. poslanka Evropskega parlamenta!",
    "Kot veste, boste v prihodnjih dneh v Evropskem parlamentu glasovali o predlogu reforme avtorskega prava, ki ga je sprejel odbor JURI.",
    "Pišem vam, ker ne vem, kako boste o spornem predlogu glasovali, ali pa ste izrazili namero, da predlog podprete. Edina možnost zaščite interesov državljanov EU je v rokah Evropskega parlamenta, torej tudi v vaših rokah.",
    "Tako strokovna javnost kot splošna javnost napovedano cenzuro interneta, zapakirano v reformo avtorskega prava, ostro obsojata. V primeru, da se glede predloga ne znate opredeliti zaradi pomanjkanja informacij, vam pošiljam nekaj uporabnih povezav, kjer se lahko informirate o tem, zakaj je nesprejemljiv: https://djnd.si/bqib, https://djnd.si/mzh, https://djnd.si/mzm, https://djnd.si/bqic.",
    "V vsakem primeru pa od vas zahtevam, da ravnate v interesu tistih, ki smo vam podelili mandat, ne pa v interesu tiste peščice (založnikov in zabavne industrije), ki bo od napovedanih sprememb mastno zaslužila, in torej glasujete PROTI.",
    "Hvala za razumevanje in lep pozdrav,",
    "[IME IN PRIIMEK]",
  ].join('\n\n');

  $('.js-copy-text').val(copyText);

  var callText = [
    "Živjo,",
    "tukaj [IME IN PRIIMEK]. Kličem vas zaradi prihajajočega glasovanja o predlogu reforme avtorskega prava, ki ga je sprejel odbor JURI.",
    "Zanima me, kako boste o spornem predlogu glasovali. Edina možnost zaščite interesov državljanov EU je v rokah Evropskega parlamenta, torej tudi v vaših rokah.",
    "Tako strokovna javnost kot splošna javnost napovedano cenzuro interneta, zapakirano v reformo avtorskega prava, ostro obsojata.",
    "Od vas zahtevam, da ravnate v interesu tistih, ki smo vam podelili mandat, ne pa v interesu tiste peščice (založnikov in zabavne industrije), ki bo od napovedanih sprememb mastno zaslužila, in torej glasujete PROTI."
  ].join('\n\n');

  $('.js-call-text').val(callText);

  $('.js-email-button').on('click', function() {
    var $panel = $(this).closest('.panel');
    var $modal = $('#email-modal');
    var id = $panel.data('id');

    $modal.find('.modal-header h3').text($panel.find('h3').text());
    $modal.find('.modal-header h4').text($panel.find('h4').text());

    $modal.find('.js-copy-emails').val(modalData[id].emails + ', copyleft@danesjenovdan.si');

    $modal.modal('show');
  });

  $('#email-modal .js-mailto-link').on('click', function() {
    var $modal = $('#email-modal');
    var url = 'mailto:' + $modal.find('.js-copy-emails').val() + '?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent($modal.find('.js-copy-text').val());
    window.open(url, '_blank');
  });

  $('.js-call-button').on('click', function() {
    var $panel = $(this).closest('.panel');
    var $modal = $('#call-modal');
    var $phones = $modal.find('.js-phone-container');
    var id = $panel.data('id');
    var phones = modalData[id].phone;

    $modal.find('.modal-header h3').text($panel.find('h3').text());
    $modal.find('.modal-header h4').text($panel.find('h4').text());

    $phones.empty();
    var html = '';
    for (var prop in phones) {
      if (phones.hasOwnProperty(prop)) {
        var phoneNum = phones[prop].replace('(0)', '').replace(/\s/g, '');
        html += '<p>' + prop + '<br><a href="tel:' + phoneNum + '">' + phones[prop] + '</a></p>';
      }
    }
    $phones.html(html);

    $modal.modal('show');
  });

  $('.js-response-button').on('click', function() {
    var $panel = $(this).closest('.panel');
    var $modal = $('#response-modal');
    var $res = $modal.find('.js-response-text');
    var id = $panel.data('id');
    var res = modalData[id].response;

    $modal.find('.modal-header h3').text($panel.find('h3').text());
    $modal.find('.modal-header h4').text($panel.find('h4').text());

    $res.empty();
    var html = '';
    for (var i = 0; i < res.length; i++) {
      html += '<p>' + modalData[id].response[i] + '</p>'
    }
    $res.html(html);

    $modal.modal('show');
  });
});
