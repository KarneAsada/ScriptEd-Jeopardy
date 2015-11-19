/*global $ */
(function () {
    'use strict';

    $(document).ready(function () {
        var gameData = {
            valueMultiplier: 1,
            teams: []
        };

        var teamStyles = {
            fonts: [
                'Indie Flower',
                'Shadows Into Light',
                'Pacifico',
                'Amatic SC',
                'Architects Daughter',
                'Gloria Hallelujah',
                'Covered By Your Grace',
                'Kaushan Script',
                'Coming Soon',
                'Shadows Into Light Two'
            ],
            avatars: [
                'bluetoy.png',
                'firetoy.png',
                'greentoy.png',
                'lilastoy.png',
                'masktoy.png',
                'orangetoy.png',
                'pinktoy.png',
                'redtoy.png',
                'toothtoy.png',
                'yellowtoy.png'
            ]
        };

        var getRandomArrayElement = function (array) {
            return array[Math.floor(Math.random() * array.length)];
        };

        var createTeams = function (teamNames) {
            var x;
            var teamHTML;
            var font;
            var fontCSS;

            for (x = 0; x < teamNames.length; x += 1) {
                gameData.teams.push({
                    name: teamNames[x],
                    score: 0
                });

                teamHTML = $($('#template-team-scoreboard').html());

                teamHTML.find('.scoreboard-avatar img').attr({
                    src: 'img/' + getRandomArrayElement(teamStyles.avatars),
                    alt: teamNames[x]
                });

                font = getRandomArrayElement(teamStyles.fonts);
                teamHTML.find('.scoreboard-name')
                    .text(teamNames[x])
                    .css('font-family', "'" + font + "', cursive");

                fontCSS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=' + font.replace(' ', '+') + '">';
                $('title').after(fontCSS);

                $('.scoreboard-teams').append(teamHTML);

                teamHTML = $($('#template-team-clue-viewer').html());

                teamHTML.find('clue-actions-name').text(teamNames[x]);
                $('.clue-viewer .clue-actions').append(teamHTML);
            }
        };

        var showAnswer = function () {
            $('.clue-actions').fadeOut(400, function () {
                $('.clue-question').fadeOut(400, function () {
                    $('.clue-answer').fadeIn(400, function () {
                        $('.clue-close').fadeIn();
                    });
                });
            });
        };

        // Game Setup
        $('.add-team').on('click', function (e) {
            e.preventDefault();
            var formGroup = $(this).prev().clone();

            formGroup.find('input').val('');
            $(this).before(formGroup);

            $('.game-setup form input[type="text"]').last().focus();
            if ($('.game-setup .form-control').length === 6) {
                $(this).hide();
            }
        });

        $('.game-setup form').on('submit', function (e) {
            e.preventDefault();
            var teamNames = $(this).find('input[type="text"]').map(function (index, element) {
                if (element.value) {
                    return element.value;
                }
            });

            if (teamNames.length) {
                createTeams(teamNames);
                $('.game-setup').hide();
                $('.game-board').addClass('ready');
                $('.scoreboard').toggle();
            }
        });

        // Game Board Setup
        $('.game-board ol li').each(function () {
            var dollarValue = ($(this).index() + 1) * gameData.valueMultiplier * 200;

            if (!$(this).children('.value').length) {
                $(this).prepend('<span class="value">$' + dollarValue + '</span>');
            } else {
                $(this).children('.value').text('$' + dollarValue);
            }

            $(this).attr('data-dollar-value', dollarValue);

            $(this).on('click', function () {
                var questionText = $(this).children('.question').text();
                var answerText = $(this).children('.answer').text();

                $(this).children('.value').hide();
                $('.clue-question').text(questionText);
                $('.clue-answer').html('Answer:<br>' + answerText);
                $('.clue-viewer').data('dollar-value', dollarValue);
                $('.game-board').removeClass('ready');
                $('.clue-close').hide();
                $('.bg-modal, .clue-viewer').show();

                $(this).addClass('asked').off('click');
            });
        });

        // Do certain things when certain keys are pressed
        $(document).on('keypress', function (key) {
            if (key.which === 115 && $('.game-board').hasClass('ready')) {
                // Key #115 = lowercase s
                $('.bg-modal, .scoreboard').toggle();
            }

            if (key.which === 120 && $('.clue-viewer').filter(':visible')) {
                // Key #120 = lowercase x
                showAnswer();
            }
        });
    });
}());