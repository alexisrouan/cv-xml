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

(function($) {

    var el = $(this[0]);
    var args = arguments[0] || {};
    var callBack = arguments[1];

    if (typeof callback == 'function') {
        callback.call(this);
    }

    var settings = $.extend({
        // These are the defaults.

        onready: function() {
            console.warn('jquery.cv onready');
        },

        //Rest of the Settings goes here...
    });


    // CREATE CV
    $.fn.createCV = function($param) {

        console.warn('createCV');
        console.log('$param : ', $param);


        var target = $(this);
        console.log("$url=" + $param.url);
        console.log("$accroche=" + $param.accroche);




        $.ajax({
            type: "GET",
            url: $param.url,
            cache: false,
            dataType: "xml",
            success: function(xml) {

                $(target).empty();
                xmlDoc = $.parseXML(xml),
                    $xml = $(xmlDoc),
                    $(xml).children().each(function() {

                        $(this).children().each(function(n) {

                            switch ($(this).get(0).nodeName) {
                                // TITRE
                                case 'titre':
                                    $(target).append("<header></header>");
                                    $(target).find("header").append("<h1 class='cv-title'>" + $(this).text() + "</h1>");
                                    $(target).find("h1").firstLetter();
                                    break;

                                    // ACCROCHE
                                case 'accroche':
                                    $(target).find("header").append("<accroche>" + $(this).text() + "</accroche>");
                                    $(target).find("accroche").firstLetter();
                                    break;



                                    // IDENTITE
                                case 'identite':
                                    $(target).append("<section id='identite'>");
                                    $(this).children().children().each(function(i) {

                                        if ($(this).text()) {

                                            $htmlStr = "<span class='label " + $(this).get(0).nodeName + "'>" + $(this).getLabel() + "&nbsp;:&nbsp;</span>";
                                            if ($(this).get(0).nodeName == "email") {
                                                $htmlStr += "<a class='" + $(this).get(0).nodeName + "-txt' href='mailto:" + $(this).text() + "'>" + $(this).text() + "</a>";
                                            } else if ($(this).get(0).nodeName == "website") {
                                                $htmlStr += "<a class='" + $(this).get(0).nodeName + "-txt' href='" + $(this).attr("href") + "' target='_blank'>" + $(this).text() + "</a>";
                                            } else {
                                                $htmlStr += "<span class='" + $(this).get(0).nodeName + "-txt'>" + $(this).text() + "</span>";
                                            }

                                            $("#identite").append($htmlStr);

                                        }

                                    });
                                    break;

                                    // MAJ
                                case 'maj':
                                    $(target).find("#identite").append("<maj>" + $(this).text() + "</maj>");
                                    break;


                                    // COMPETENCES
                                case 'competences':
                                    $(target).append("<section id='competences'></section>");
                                    // TITRES RUBRIQUES
                                    $("#competences").append("<h2>" +  getSectionTitle(this) + "</h2>");

                   
                                    $("#competences").append("<ul id='comp-list'></ul>");
                                    $("#comp-list").append("<li class='grid-sizer'></li>");
                                    $("#comp-list").append("<li class='gutter-sizer'></li>");
                                    $(this).children().each(function(i) {

                                        $("#comp-list").append("<li class='grid-item'></li>");
                                        // titre + liste
                                        $("#comp-list >li:last-of-type").append("<h3>" + $(this).attr('label') + "</h3><ul id='comp" + i + "' class='comp'></ul>");
                                        $(this).children().each(function(j) {
                                            if ($(this).text().length > 20) {
                                                $("#comp-list >li:last-of-type").addClass("width2x");
                                            }
                                            $(this).text() ? $("#comp" + i).append("<li><span class='comp-name'>" + $(this).text() + "</span><span class='comp-note'>" + $(this).attr("note") + "</span></li>") : '';
                                        });
                                    });
                                    break;

                                    // EXPERIENCES
                                case 'experiences':

                                    $(target).append("<section id='experiences'></section>");
                                    $("#experiences").append("<h2>" +  getSectionTitle(this) + "</h2>");


                                    // $(this).setTitle();
                                    console.log('this = ', $('#experiences'));
                                    $("#experiences").append("<ul id='exp-list'></ul>");

                                    $(this).children().each(function(j) {
                                        $("#experiences ul#exp-list").append("<li id='experience" + j + "' class='experiences'>");

                                        $(this).children().each(function() {

                                            if ($(this).get(0).nodeName == "projets") {

                                                $("#experience" + j).append("<ul class='projet'>");

                                                $(this).children().each(function(p) {
                                                    $("#experience" + j + " ul.projet").append("<li>");
                                                    /* UL Projet detail */
                                                    if ($(this).children().length > 0) {
                                                        $("#experience" + j + " ul.projet > li:last-child").append("<ul class='projet-detail'></ul>");
                                                        $(this).children().each(function() {
                                                            $(this).text() ? $("#experience" + j + " ul.projet li:last-child ul:last-child").append("<li><span class='label " + $(this).get(0).nodeName + "'>" + $(this).getLabel() + "&nbsp;:&nbsp;</span><span class='" + $(this).get(0).nodeName + "-txt'>" + $(this).text() + "</span></li>") : '';
                                                        });
                                                    }
                                                });

                                                $("#experience" + j).append("</ul>");

                                            } else {
                                                if ($(this).text()) {
                                                    $(this).get(0).nodeName == "desc" ? $("#experience" + j).append("<p class='" + $(this).get(0).nodeName + "-txt'>" + $(this).text() + "</p>") : $("#experience" + j).append("<span class='label " + $(this).get(0).nodeName + "'>" + $(this).getLabel() + "&nbsp;:&nbsp;</span><span class='" + $(this).get(0).nodeName + "-txt'>" + $(this).text() + "</span>");
                                                }
                                            };

                                        });

                                    });
                                    break;

                                    // FORMATIONS - DIVERS - AUTRES
                                default:

                                    $currentSection = $(this).get(0).nodeName;
                                    $(target).append("<section id='" + $currentSection + "'></section>");



                                    $("#" + $currentSection).append("<h2>" +  getSectionTitle(this) + "</h2>");


             





                                    $("#" + $currentSection).append("<ul id='" + $currentSection + "-list'></ul>");

                                    $(this).children().each(function() {

                                        if ($(this).children().length) {
                                            $("#" + $currentSection + "-list").append("<li><span class='label'>" + $(this).getLabel() + "</span><br/></li>");
                                            $(this).children().each(function() {
                                                $(this).text() ? $("#" + $currentSection + "-list li:last-child").append("<span class='label " + $(this).get(0).nodeName + "'>" + $(this).getLabel() + "&nbsp;:&nbsp;</span><span class='" + $(this).get(0).nodeName + "-txt'>" + $(this).text() + "</span><br/>") : '';
                                            });

                                        } else {
                                            $(this).text() ? $("#" + $currentSection + " ul:last-child").append("<li><span class='label " + $(this).get(0).nodeName + "'>" + $(this).getLabel() + "&nbsp;:&nbsp;</span><span class='" + $(this).get(0).nodeName + "-txt'>" + $(this).text() + "</span></li>") : '';
                                        }

                                    });

                                    break;
                            }

                        });


                    });



                // COMPACT MODE
                $('#compact-mode, #opt-compact').on('click', function() {
                    $(this).toggleClass('actif');
                    $(target).toggleClass('compact-mode');
                });

                // DESC MODE
                $('#opt-desc').click(function() {
                    $(this).toggleClass('actif');
                    $(target).toggleClass('desc-mode');
                });

                // PRINT
                $(".print-button").click(function() {
                    window.print();
                });

                // FONT FAMILY
                $("#font-family-input").on('change', function() {
                    $(target).css('font-family', $(this).find('option:selected').val())
                });

                // FONT SIZE
                $("#font-size-input").on('change', function() {
                    updFontSize();
                });

                var updFontSize = function() {
                    var valof = $("#font-size-input").val();
                    $('output').text(valof + "%");
                    $(target).css('font-size', valof + '%').find('#comp-list').masonry();
                }


                // GRID SIZER
                $("#grid-sizer-input").on('change', function() {
                    updGridSizer();
                });

                var updGridSizer = function() {
                    var valof = $("#grid-sizer-input").val();
                    $('output-grid').text(valof + "%");
                    $('#comp-list .grid-sizer, #comp-list .grid-item').css('width', valof + 'em');
                    $('li.width2x').css('width', $("#grid-sizer-input").val() * 2 + $("#gutter-sizer-input").val() * 1 + 'em');
                    $(target).find('#comp-list').masonry();
                }


                // GUTTER SIZER
                $("#gutter-sizer-input").on('change', function() {
                    updGutterSizer();
                });

                var updGutterSizer = function() {
                    var valof = $("#gutter-sizer-input").val();
                    $('output-gutter').text(valof + "em");
                    $('#comp-list .gutter-sizer').css('width', valof + 'em');
                    $('li.width2x').css('width', $("#grid-sizer-input").val() * 2 + $("#gutter-sizer-input").val() * 1 + 'em');
                    $(target).find('#comp-list').masonry();
                }



                // Move header
                $(target).find("header").insertAfter("#identite");

                // MASONRY : COMPETENCES
                $(target).find('#comp-list').masonry({
                    itemSelector: '.grid-item',
                    columnWidth: '.grid-sizer',
                    gutter: '.gutter-sizer',
                    percentPosition: true,
                    stagger: 0,
                    printable: true
                });

                updFontSize();
                updGridSizer();
                updGutterSizer();

            }
        });

        // Add class first letter
        $.fn.firstLetter = function() {
            str = this.get(0).innerHTML;
            this.get(0).innerHTML = str.replace(/\S+/g, "<span class='first-letter'>$&</span>");
        };

        // Get label or nodename
        $.fn.getLabel = function() {
            return $(this).attr('label') ? $(this).attr('label') : $(this).get(0).nodeName;
        };

        // Set h2
        // $.fn.setTitle = function() {
        //     return $(this).attr('label') ? $("section:last-child").append("<h2>" + $(this).attr('label') + "</h2>") : '';
        // };
        $.fn.setTitle = function( node ) {

            console.warn('this=', this);
             $(node).attr('label') ? $(this).append("<h2>" + $(node).attr('label') + "</h2>") : '';
        };


        getSectionTitle = function( node ) {
            console.log('getSectionTitle:', node);
             return $(node).attr('label') ?  $(node).attr('label') : '';
        };


        // ACCROCHE MODE
        $('#opt-accr').click(function() {
            $(this).accrMode();
        });
        $.fn.accrMode = function(e) {
            $(e).toggleClass('actif');
            $(target).toggleClass('accr-mode');
        };
    };


}(jQuery));