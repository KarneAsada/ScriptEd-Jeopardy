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
                "'Indie Flower', cursive",
                "'Shadows Into Light', cursive",
                "'Pacifico', cursive",
                "'Amatic SC', cursive",
                "'Architects Daughter', cursive",
                "'Gloria Hallelujah', cursive",
                "'Covered By Your Grace', cursive",
                "'Kaushan Script', cursive",
                "'Coming Soon', cursive",
                "'Shadows Into Light Two', cursive"
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

            for (x = 0; x < teamNames.length; x += 1) {

                gameData.teams.push({
                    name: teamNames[x],
                    score: 0
                });

                teamHTML = $('<div class="scoreboard-team"></div>');

                teamHTML.append(
                    '<div class="scoreboard-avatar"><img src="img/'
                        + getRandomArrayElement(teamStyles.avatars)
                        + '" alt="' + teamNames[x] + '"></div>'
                );
                teamHTML.append('<div class="scoreboard-score">$0</div>');
                teamHTML.append(
                    $('<div class="scoreboard-name">' + teamNames[x] + '</div>')
                        .css('font-family', getRandomArrayElement(teamStyles.fonts))
                );

                $('.scoreboard-teams').append(teamHTML);

                teamHTML = $('<div class="clue-actions-team"></div>');
                teamHTML.append('<div class="clue-actions-name">' + teamNames[x] + '</div>');
                teamHTML.append('<div class="btn-group" role="group"><button type="button" class="btn btn-success" title="Right!"><span class="glyphicon glyphicon-ok"></span></button><button type="button" class="btn btn-danger" title="Wrong!"><span class="glyphicon glyphicon-remove"></span></button></div>');
                $('.clue-viewer .clue-actions').append(teamHTML);
            }
        };

        $('.game-board td').each(function () {
            var dollarValue = ($('.game-board > tbody > tr').index($(this).parent()) + 1) * gameData.valueMultiplier * 100;
            $(this).children('.value').text('$' + dollarValue);

            $(this).on('click', function () {
                var questionText = $(this).children('.question').text();
                var answerText = $(this).children('.answer').text();

                $(this).children('.value').hide();
                $('.bg-modal').show();
                $('.clue-viewer .question-text').text(questionText);
                $('.clue-viewer .answer-text').html('Answer:<br>' + answerText);
                $('.clue-viewer').data('dollar-value', dollarValue);
                $('.clue-viewer').show();

                $(this).addClass('asked').off('click');
            });
        });

        // Greeting View
        $('.add-team').on('click', function (e) {
            e.preventDefault();
            var formGroup = $(this).prev().clone();

            formGroup.find('input').val('');
            $(this).before(formGroup);

            $('.team-names input').last().focus();
            if ($('.name').length === 6) {
                $(this).hide();
            }
        });

        $('.team-names').on('submit', function (e) {
            e.preventDefault();
            var teamNames = $('.team-names input[type="text"]').map(function (index, element) {
                return $(element).val();
            });

            if (teamNames.length) {
                createTeams(teamNames);
                $('.game-setup').hide();
                $('.scoreboard').toggle();
            }
        });

        $('.clue-actions').on('click', '.btn', function () {
            var teamNumber = $('.clue-actions-team').index($(this).parents('.clue-actions-team'));

            if ($(this).hasClass('btn-success')) {
                gameData.teams[teamNumber].score += $('.clue-viewer').data('dollar-value');
            } else {
                gameData.teams[teamNumber].score -= $('.clue-viewer').data('dollar-value');
            }

            $('.scoreboard-score').eq(teamNumber).text('$' + gameData.teams[teamNumber].score);

            if (gameData.teams[teamNumber].score < 0) {
                $('.scoreboard-score').eq(teamNumber).addClass('negative');
            } else {
                $('.scoreboard-score').eq(teamNumber).removeClass('negative');
            }

            if ($(this).hasClass('btn-success')) {
                $('.clue-actions').fadeOut(400, function () {
                    $('.question-text').fadeOut(400, function () {
                        $('.answer-text').fadeIn(400, function () {
                            $('.clue-viewer').addClass('done');
                        });
                    });
                });
            } else {
                $(this).parents('.clue-actions-team').fadeOut(400, function () {
                    if (!$(this).siblings().is(':visible').length) {
                        $('.question-text').fadeOut(400, function () {
                            $('.answer-text').fadeIn(400, function () {
                                $('.clue-viewer').addClass('done');
                            });
                        });
                    }
                });
            }
        });

        $('.clue-viewer').on('click', function () {
            if ($(this).hasClass('done')) {
                $('.bg-modal, .clue-viewer').toggle();
                $('.clue-viewer').removeClass('done');
                $('.question-text, .clue-actions, .clue-actions-team').fadeIn(0);
                $('.answer-text').fadeOut(0);
            }
        });

        // Scoreboard
        $(document).keypress(function (key) {
            if (key.which === 115 && $('.game-setup')[0].style.display === "none") {
                $('.bg-modal, .scoreboard').toggle();
            }
        });
    });
}());