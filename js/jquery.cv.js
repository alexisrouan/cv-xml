/*
// Create closure.
(function( $ ) {

    // This is the easiest way to have default options.

         var settings = $.extend({
             // These are the defaults.

             onready: function(){},

             //Rest of the Settings goes here...
         }, options );

     // Plugin definition.
     $.fn.hilight = function( options ) {

         //Here's the Callback
         settings.onready.call(this);

         //Your plugin code goes Here
     };

 // End of closure.

 })( jQuery );

*/

(function ($) {
  $.fn.createCard = function ($title, $content) {
    var card = $('<div />').addClass('card').appendTo(this);

    var cardHeader = $('<div />').addClass('card-header').appendTo(card);

    var cardTitle = $('<div />')
      .addClass('card-title')
      .appendTo(cardHeader)
      .append($title);

    var cardContent = $('<div />')
      .addClass('card-content')
      .appendTo(card)
      .append($content);

    return card;
  };

  $.fn.createRow = function () {
    var row = $('<div />').addClass('row').appendTo(this);

    var col = $('<div />')
      .addClass(
        'col-10 offset-1 col-md-8 offset-md-2  col-lg-6 offset-lg-3  col-xl-4 offset-xl-4'
      )
      .appendTo(row);

    return col;
  };

  $.fn.createCV = function (options) {
    var el = $(this[0]);
    var args = arguments[0] || {};
    // var callBack = arguments[1];

    window.callBack = arguments[1];

    var settings = $.extend(
      {
        // These are the defaults.

        onready: function () {
          console.warn('jquery.cv onready');
          if (window.callBack) window.callBack.call();
          // return $(this) ;
        },

        //Rest of the Settings goes here...
      },
      options
    );

    console.warn('createCV');
    console.log('args : ', args);
    console.log('options : ', options);
    console.log('callBack : ', callBack);

    var target = $(this);
    console.log('$url=' + options.url);
    console.log('$accroche=' + options.accroche);

    $.ajax({
      type: 'GET',
      url: options.url,
      cache: false,
      dataType: 'xml',
      success: function (xml) {
        $(target).empty();
        (xmlDoc = $.parseXML(xml)), ($xml = $(xmlDoc));
        $(xml)
          .children()
          .each(function () {
            $(this)
              .children()
              .each(function (n) {
                switch ($(this).get(0).nodeName) {
                  // TITRE
                  case 'titre':
                    $('<header/>', {
                      class: 'cv-header sectionSelector',
                    })
                      .appendTo(target)
                      .createRow()
                      .append('<h1/>')
                      .find('h1')
                      .addClass('cv-title')
                      .text($(this).text())
                      .firstLetter();

                    break;

                  // ACCROCHE
                  case 'accroche':
                    var accroche = $('<accroche />')
                      .insertAfter('header.cv-header h1')
                      .text($(this).text())
                      .firstLetter();

                    // $(target).find("header h1")
                    // .append("<accroche/>")
                    // .find("accroche")
                    // .text( $(this).text() )
                    // .firstLetter();
                    break;

                  // IDENTITE
                  case 'identite':
                    var $htmlStr = '';

                    if (options.identite !== false) {
                      $htmlStr = '<div>';
                      $(this)
                        .children()
                        .children()
                        .each(function (i) {
                          if ($(this).text()) {
                            $htmlStr +=
                              "<span class='label " +
                              $(this).get(0).nodeName +
                              "'>" +
                              $(this).getLabel() +
                              '</span>';
                            if ($(this).get(0).nodeName == 'email') {
                              $htmlStr +=
                                "<a class='" +
                                $(this).get(0).nodeName +
                                "-txt' href='mailto:" +
                                $(this).text() +
                                "'>" +
                                $(this).text() +
                                '</a>';
                            } else if ($(this).get(0).nodeName == 'website') {
                              $htmlStr +=
                                "<a class='" +
                                $(this).get(0).nodeName +
                                "-txt' href='" +
                                $(this).attr('href') +
                                "' target='_blank'>" +
                                $(this).text() +
                                '</a>';
                            } else {
                              $htmlStr +=
                                "<span class='" +
                                $(this).get(0).nodeName +
                                "-txt'>" +
                                $(this).text() +
                                '</span>';
                            }
                          }
                        });
                      $htmlStr += '</div>';
                    }

                    $('<section/>', {
                      id: 'identite',
                      class: 'sectionSelector',
                    })
                      .appendTo(target)
                      .createRow()
                      .append($htmlStr);

                    break;

                  // MAJ
                  case 'maj':
                    $(target)
                      .find('#identite')
                      .append('<maj>' + $(this).text() + '</maj>');
                    break;

                  // COMPETENCES
                  case 'competences':
                    $('<section/>', {
                      id: 'competences',
                      class: 'sectionSelector',
                    })
                      .appendTo(target)
                      .append('<h2>' + getSectionTitle(this) + '</h2>')
                      .append("<ul id='comp-list'/>");

                    // $(target).append("<section id='competences'></section>");

                    // TITRES RUBRIQUES
                    //$("#competences").append("<h2>" +  getSectionTitle(this) + "</h2>");

                    // $("#competences").append("<ul id='comp-list'/>");

                    // MASONRY : COMPETENCES
                    if (options.masonry) {
                      $('#comp-list')
                        .append("<li class='grid-sizer'/>")
                        .append("<li class='gutter-sizer'/>");
                    }

                    $(this)
                      .children()
                      .each(function (i) {
                        var $isMasonry = options.masonry ? 'grid-item ' : '';
                        $('#comp-list').append(
                          '<li class=' + $isMasonry + "'slide'/>"
                        );
                        // titre + liste
                        // $("#comp-list >li:last-of-type").append("<h3>" + $(this).attr('label') + "</h3><ul id='comp" + i + "' class='comp'></ul>");
                        $('#comp-list >li:last-of-type')
                          .createRow()
                          .createCard(
                            $(this).attr('label'),
                            "<ul id='comp" + i + "' class='comp'/>"
                          );
                        $(this)
                          .children()
                          .each(function (j) {
                            if ($(this).text().length > 20) {
                              $('#comp-list >li:last-of-type').addClass(
                                'width2x'
                              );
                            }

                            if ($(this).text()) {
                              $('#comp' + i).append(
                                "<li><span class='comp-name'>" +
                                  $(this).text() +
                                  "</span><span class='comp-note' data-note='" +
                                  $(this).attr('note') +
                                  "'>" +
                                  $(this).attr('note') +
                                  '</span></li>'
                              );
                            }
                          });
                      });
                    break;

                  // EXPERIENCES
                  case 'experiences':
                    $('<section/>', {
                      id: 'experiences',
                      class: 'sectionSelector',
                    })
                      .appendTo(target)
                      .append('<h2>' + getSectionTitle(this) + '</h2>')
                      .append("<ul id='exp-list'/>");

                    $(this)
                      .children()
                      .each(function (j) {
                        $('#experiences ul#exp-list').append(
                          "<li id='experience" +
                            j +
                            "' class='experiences slide'>"
                        );

                        var $cardTitle = '';
                        var $cardContent = $('<ul/>', {
                          class: 'exp',
                        });

                        $(this)
                          .children()
                          .each(function () {
                            if ($(this).get(0).nodeName == 'projets') {
                              if (options.projectDetail !== false) {
                                $('#experience' + j).append(
                                  "<ul class='projet' />"
                                );
                                $(this)
                                  .children()
                                  .each(function (p) {
                                    $('#experience' + j + ' ul.projet').append(
                                      '<li >'
                                    );
                                    /* UL Projet detail */
                                    if (
                                      options.projectDetail !== false &&
                                      $(this).children().length > 0
                                    ) {
                                      $(
                                        '#experience' +
                                          j +
                                          ' ul.projet > li:last-child'
                                      ).append(
                                        "<ul class='projet-detail'></ul>"
                                      );
                                      $(this)
                                        .children()
                                        .each(function () {
                                          $(this).text()
                                            ? $(
                                                '#experience' +
                                                  j +
                                                  ' ul.projet li:last-child ul:last-child'
                                              ).append(
                                                "<li><span class='label " +
                                                  $(this).get(0).nodeName +
                                                  "'>" +
                                                  $(this).getLabel() +
                                                  "</span><span class='" +
                                                  $(this).get(0).nodeName +
                                                  "-txt'>" +
                                                  $(this).text() +
                                                  '</span></li>'
                                              )
                                            : '';
                                        });
                                    }
                                  });
                              }
                            } else {
                              if ($(this).text()) {
                                var $label = $('<span/>', {
                                    class: 'label ' + $(this).get(0).nodeName,
                                  }).text($(this).get(0).nodeName),
                                  $content = $('<span/>', {
                                    class: $(this).get(0).nodeName + '-txt',
                                  }).text($(this).text()),
                                  $li = $('<li/>', {})
                                    .append($label)
                                    .append($content);

                                if (options.cardExp === true) {
                                  if ($(this).get(0).nodeName == 'poste') {
                                    $cardTitle = $(this).text();
                                  } else {
                                    $cardContent.append($li);
                                  }
                                } else {
                                  $('#experience' + j).append($li);
                                }
                              }
                            }
                          });

                        if (options.cardExp === true) {
                          $('#experience' + j)
                            .createRow()
                            .createCard($cardTitle, $cardContent);
                        }
                      });
                    break;

                  // FORMATIONS - DIVERS - AUTRES
                  default:
                    // STRUCTURE
                    var $titleRub = $('<h2/>', {}).text(getSectionTitle(this)),
                      $ulContentRub = $('<ul/>', {
                        id: $(this).get(0).nodeName + '-list',
                      });
                    $('<section/>', {
                      id: $(this).get(0).nodeName,
                      class: 'sectionSelector',
                    })
                      .appendTo(target)
                      .append($titleRub)
                      .append($ulContentRub);

                    // REMPLISSAGE
                    $(this)
                      .children()
                      .each(function () {
                        console.log(
                          '\n-------------------------------------------------'
                        );
                        var $liSlide = $('<li/>', {
                            class: 'slide',
                          }),
                          $contentSlide = $('<ul/>', {
                            class: 'contentSlide',
                          }),
                          $title = '';

                        if ($(this).children().length) {
                          /** AVEC CHILDREN ON CREE UNE CARD POUR CHAQUE CHLDREN */
                          $($liSlide).appendTo($ulContentRub);

                          $title = $(this).attr('label')
                            ? $(this).attr('label')
                            : $(this).get(0).nodeName;

                          $(this)
                            .children()
                            .each(function () {
                              if ($(this).text()) {
                                if ($(this).get(0).nodeName == 'nom') {
                                  $title = $(this).text();
                                } else {
                                  var $li2 = $('<li/>', {
                                      class: '',
                                    }),
                                    $label = $('<span/>', {
                                      class: 'label ' + $(this).get(0).nodeName,
                                    }).text($(this).getLabel()),
                                    $txt = $('<span/>', {
                                      class: $(this).get(0).nodeName + '-txt',
                                    }).text($(this).text());

                                  $($li2).append($label).append($txt);

                                  $($li2).appendTo($contentSlide);
                                }
                              }
                            });
                        } else {
                          /** PAS DE CHILDREN */
                          if ($(this).text()) {
                            $li2 =
                              "<li><span class='label " +
                              $(this).get(0).nodeName +
                              "'>" +
                              $(this).getLabel() +
                              "</span><span class='" +
                              $(this).get(0).nodeName +
                              "-txt'>" +
                              $(this).text() +
                              '</span></li>';

                            $($contentSlide).appendTo($li2);
                          }
                        }

                        if (options.cardExp === true) {
                          $($contentSlide).appendTo($liSlide);
                          $($liSlide)
                            .createRow()
                            .createCard($title, $contentSlide);
                        } else {
                          $($liSlide).append('<h3>' + $title + '</h3>');

                          $($contentSlide).appendTo($liSlide);
                        }
                      });

                    break;
                }
              });
          });

        if (typeof callback == 'function') {
          console.log('callBack2 : ', callBack);
        }
        // console.log('callBack2 call ', callBack);
        // callback.call(this);

        console.log('options : ', options);
        // COMPACT MODE
        $('#compact-mode, #opt-compact').on('click', function () {
          $(this).toggleClass('actif');
          $(target).toggleClass('compact-mode');
        });

        // DESC MODE
        $('#opt-desc').click(function () {
          $(this).toggleClass('actif');
          $(target).toggleClass('desc-mode');
        });

        // PRINT
        $('#print-button').click(function () {
          console.log('print');

          $('.generated-cv').print();
          window.print();
        });

        // FONT FAMILY
        $('#font-family-input').on('change', function () {
          $(target).css('font-family', $(this).find('option:selected').val());
        });

        // FONT SIZE
        $('#font-size-input').on('change', function () {
          updFontSize();
        });

        var updFontSize = function () {
          var valof = $('#font-size-input').val();
          $('output').text(valof + '%');
          $(target).css('font-size', valof + '%');
          if (options.masonry) {
            $(target).find('#comp-list').masonry();
          }
        };

        // GRID SIZER
        $('#grid-sizer-input').on('change', function () {
          updGridSizer();
        });

        var updGridSizer = function () {
          console.warn('updGridSizer');

          var valof = $('#grid-sizer-input').val();
          $('output-grid').text(valof + '%');
          $('#comp-list .grid-sizer, #comp-list .grid-item').css(
            'width',
            valof + 'em'
          );
          $('li.width2x').css(
            'width',
            $('#grid-sizer-input').val() * 2 +
              $('#gutter-sizer-input').val() * 1 +
              'em'
          );
          $(target).find('#comp-list').masonry();
        };

        // GUTTER SIZER
        $('#gutter-sizer-input').on('change', function () {
          updGutterSizer();
        });

        var updGutterSizer = function () {
          var valof = $('#gutter-sizer-input').val();
          $('output-gutter').text(valof + 'em');
          $('#comp-list .gutter-sizer').css('width', valof + 'em');
          $('li.width2x').css(
            'width',
            $('#grid-sizer-input').val() * 2 +
              $('#gutter-sizer-input').val() * 1 +
              'em'
          );
          $(target).find('#comp-list').masonry();
        };

        // Move header
        $(target).find('header').insertAfter('#identite');

        updFontSize();

        // MASONRY : COMPETENCES
        if (options.masonry) {
          console.warn('jQuery CV : init MASONRY : COMPETENCES');

          $(target).find('#comp-list').masonry({
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer',
            percentPosition: true,
            stagger: 0,
            printable: true,
          });
          updGridSizer();
          updGutterSizer();
        }

        settings.onready.call();
      },
    });

    // Add class first letter
    $.fn.firstLetter = function () {
      str = this.get(0).innerHTML;
      this.get(0).innerHTML = str.replace(
        /\S+/g,
        "<span class='first-letter'>$&</span>"
      );
    };

    // Get label or nodename
    $.fn.getLabel = function () {
      return $(this).attr('label')
        ? $(this).attr('label')
        : $(this).get(0).nodeName;
    };

    $.fn.setTitle = function (node) {
      console.warn('this=', this);
      $(node).attr('label')
        ? $(this).append('<h2>' + $(node).attr('label') + '</h2>')
        : '';
    };

    getSectionTitle = function (node) {
      console.log('getSectionTitle:', node);
      return $(node).attr('label') ? $(node).attr('label') : '';
    };

    // ACCROCHE MODE
    $('#opt-accr').click(function () {
      $(this).accrMode();
    });
    $.fn.accrMode = function (e) {
      $(e).toggleClass('actif');
      $(target).toggleClass('accr-mode');
    };
  };
})(jQuery);
