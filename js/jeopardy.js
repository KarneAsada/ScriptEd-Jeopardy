/*global $ */

// If you see a function you don't recognize, try Googling it!
(function () {
    'use strict';

    $(function () {
        /*
            The gameData object will be used to store information about the
            current game, including about each team and their score.
        */
        var gameData = {
            dollarValueMultiplier: 1,
            teams: [],
            currentDollarValue: 0
        };

        /*
            We'll use the arrays in the teamStyles object to pick at random
            each team's avatar and the font for their "handwriting" on the
            scoreboard.
        */
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
            /*
                This is a way to return a random thing from an array.
                Don't worry, we Googled this one.
            */
            return array[Math.floor(Math.random() * array.length)];
        };

        var createTeams = function (teamNames) {
            /*
                We're going to use all these variables later.
                It's best to declare them all now at the start of this function.
            */
            var x;
            var templateHTML;
            var font;
            var fontCSS;

            /*
                Start this for loop at zero, and keep going one at a time until
                you get to the length of the teamNames array (which we've passed
                to this function as an argument)
            */
            for (x = 0; x < teamNames.length; x += 1) {
                /*
                    Add an object to the teams array within gameData with the
                    team's name, and their score (zero for now, of course)
                */
                gameData.teams.push({
                    name: teamNames[x],
                    score: 0
                });

                /*
                    Get the HTML from the template we defined in our HTML page
                    for representing a team on the scoreboard
                */
                templateHTML = $($('#template-team-scoreboard').html());

                /*
                    Find the image tag, and set its src attribute to a random
                    avatar, and the alt attribute to the team's name
                */
                templateHTML.find('.scoreboard-avatar img').attr({
                    src: 'img/' + getRandomArrayElement(teamStyles.avatars),
                    alt: teamNames[x]
                });

                // Get a random font for this team's name on the scoreboard
                font = getRandomArrayElement(teamStyles.fonts);

                /*
                    Add the team name to the template, and change the CSS for it
                    to use the font we just picked
                */
                templateHTML.find('.scoreboard-name')
                    .text(teamNames[x])
                    .css('font-family', "'" + font + "', cursive");


                /*
                    Create a link tag for this font's stylesheet on Google
                    Fonts. Add the font name in the appropriate spot, but make
                    sure to replace any spaces with plus signs.
                */
                fontCSS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=' + font.replace(' ', '+') + '">';

                // Now add that link tag to our HTML page after the title
                $('title').after(fontCSS);

                /*
                    Add the HTML for this teams' part of the scoreboard to the
                    actual scoreboard
                */
                $('.scoreboard-teams').append(templateHTML);

                /*
                    Get the HTML from the template we defined in our HTML page
                    for representing a team on the clue viewer. Note that we're
                    reusing the templateHTML variable that we used to update the
                    scoreboard, because why not?
                */
                templateHTML = $($('#template-team-clue-viewer').html());

                // Add the team's name to this HTML
                templateHTML.find('clue-actions-name').text(teamNames[x]);

                // Now add this HTML to the clue viewer
                $('.clue-viewer .clue-actions').append(templateHTML);
            }
        };

        // We'll call this function when it's time to show the answer to a question.
        var showAnswer = function () {
            /*
                When using jQuery's fadeIn and fadeOut functions, the second
                parameter can be set to a function you want to run after the
                fade has finished. The first parameter is how long you want the
                fade to take, in milliseconds. See https://api.jquery.com/fadein/.
            */
            $('.clue-actions').fadeOut(400, function () {
                $('.clue-question').fadeOut(400, function () {
                    $('.clue-answer').fadeIn(400, function () {
                        $('.clue-close').fadeIn();
                    });
                });
            });
        };

        // Game Setup
        $('.add-team').on('click', function () {
            /*
                "this" in this case means the element that is being clicked on.
                Note that we have to put it inside $() to make the equivalent
                jQuery object, so we can use jQuery functions on it.

                Specifically, we're getting the previous element (one of the
                existing team name fields) and making a copy of it.
            */
            var formGroup = $(this).prev().clone();

            // Set the value of the form field in this copied version to nothing
            formGroup.find('input').val('');

            // Then add it to the HTML right before the Add Team button
            $(this).before(formGroup);

            /*
                Now go to the last form field, and focus on that, so that the
                user can go straight to typing the next team name
            */
            $('.game-setup form input[type="text"]').last().focus();

            /*
                We want a maximum of six teams. So if there are already six
                form fields for team names, hide this button so the user can't
                add any more.
            */
            if ($('.game-setup .form-control').length === 6) {
                $(this).hide();
            }
        });

        $('.game-setup form').on('submit', function (e) {
            /*
                The next line means that when we submit this form, it won't be
                submitted the normal way, so we can do the other stuff in this
                function instead. See https://api.jquery.com/event.preventdefault/
            */
            e.preventDefault();

            /*
                This next part gets all of the values from the team name form
                fields, and puts them into an array called teamNames.
            */

            var teamNames = $(this).find('input[type="text"]').map(function (index, element) {
                if (element.value) {
                    return element.value;
                }
            });

            /*
                Only do this next part if there were any team names provided...
                otherwise nothing will happen (until the user enters some team
                names and tries to submit this form again).
            */
            if (teamNames.length) {
                createTeams(teamNames);
                $('.game-setup').hide();
                $('.game-board').addClass('ready');
                $('.scoreboard').toggle();
            }
        });

        // Game Board Setup
        $('.game-board ol li').each(function () {
            /*
                Calculate the dollar value by finding out which li this is
                within it's ol, add 1 (since counting in JavaScript starts at
                zero), then multiply that by 200, then the multiplier (which is
                currently always 1, but might be 2 if we add Double Jeopardy).
            */

            var dollarValue = ($(this).index() + 1) * 200 * gameData.dollarValueMultiplier;

            /*
                If there's already an element with the class "value", just update
                the text inside it. Otherwise add the element, including the text.
            */
            if (!$(this).find('.value').length) {
                $(this).find('.value').text('$' + dollarValue);
            } else {
                $(this).prepend('<span class="value">$' + dollarValue + '</span>');
            }

            /*
                Assign the dollar value to the attribute data-dollar-value on
                this element (we'll need it later)
            */
            $(this).data('dollar-value', dollarValue);
        });

        $('.game-board ol li').on('click', function () {
            // Get the text of the question and answer
            var questionText = $(this).find('.question').text();
            var answerText = $(this).find('.answer').text();

            // Make this spot on the board empty
            $(this).children('.value').hide();

            /*
                Assign the value of this question to the current dollar value
                variable, stored in the gameData object
            */
            gameData.currentDollarValue = $(this).data('dollar-value');

            // Fill in the question and answer for the question that was clicked
            $('.clue-question').text(questionText);
            $('.clue-answer').html('Answer:<br>' + answerText);

            /*
                If the game board has the class "ready", pressing S will show
                the scoreboard, so let's remove it for now.
            */
            $('.game-board').removeClass('ready');

            // OK, now we can show this clue.
            $('.bg-modal, .clue-viewer').show();

            /*
                Also, add the class "asked" to this spot on the board, and remove
                this click handler, so that we can only do this all once per
                question.
            */
            $(this).addClass('asked').off('click');
        });

        /*
            This function will run when we click anything with the class "btn"
            that's inside the div with the class "clue-actions", even if it
            doesn't exist yet when the page is first loaded. See
            https://api.jquery.com/on/
        */
        $('.clue-actions').on('click', '.btn', function () {
            /*
                To figure out the team number, get the element with the class
                "clue-action-team" that's a parent of this button, and find
                where it is in the list of all elements with that class
            */
            var teamNumber = $('.clue-actions-team').index($(this).parents('.clue-actions-team'));

            /*
                If we clicked the "Right!" button, add to this team's score; if
                they got it wrong, subtract from their score.
            */
            if ($(this).hasClass('btn-success')) {
                gameData.teams[teamNumber].score += gameData.currentDollarValue;
            } else {
                gameData.teams[teamNumber].score -= gameData.currentDollarValue;
            }

            // Update this team's score on the scoreboard
            if (gameData.teams[teamNumber].score < 0) {
                /*
                    If the score is negative, add the class "negative", and add
                    a negative sign in front of the dollar sign. We use the
                    Math.abs function here to get the absolute value of the
                    score (to display it without an extra minus sign added).
                */
                $('.scoreboard-score').eq(teamNumber)
                    .addClass('negative')
                    .text('-$' + Math.abs(gameData.teams[teamNumber].score));
            } else {
                /*
                    Maybe their score used to be negative and now it isn't, so
                    we have to try to remove the class "negative" just in case.
                */
                $('.scoreboard-score').eq(teamNumber)
                    .removeClass('negative')
                    .text('$' + gameData.teams[teamNumber].score);
            }

            if ($(this).hasClass('btn-success')) {
                // If they got it right, show everyone the answer, and move on
                showAnswer();
            } else {
                // If they got it wrong, fade out this team's set of buttons
                $(this).parents('.clue-actions-team').fadeOut(400, function () {
                    // If there are no other teams' buttons visible...
                    if (!$(this).siblings().filter(':visible').length) {
                        /*
                            ...that means everyone got this one wrong.
                            So just show the answer.
                        */
                        showAnswer();
                    }
                });
            }
        });

        /*
            This runs when you click a <button> element inside an element with
            the class "clue-close"
        */
        $('.clue-close button').on('click', function () {

            // Hide the clue viewer and the black background
            $('.bg-modal, .clue-viewer').toggle();

            // Fade back in the question, and team buttons, for the next clue
            $('.clue-question, .clue-actions, .clue-actions-team').fadeIn(0);
            // Similarly, fade out the answer, and the "Back to game board" button
            $('.clue-answer').fadeOut(0);
            $(this).parent().fadeOut(0);

            /*
                Add the class "ready" back to the game board, to make it
                possible to show the scoreboard
            */
            $('.game-board').addClass('ready');
        });

        // Do things when certain keys are pressed
        $(document).on('keypress', function (key) {
            if (key.which === 115 && $('.game-board').hasClass('ready')) {
                /*
                    Key #115 = lowercase s. Note that the game board has to also
                    have the class "ready" in order for this to run.
                */
                $('.bg-modal, .scoreboard').toggle();
            }

            if (key.which === 120 && $('.clue-viewer').filter(':visible')) {
                /*
                    Key #120 = lowercase x. Note that the clue viewer must also
                    be visible for this to run.
                */
                showAnswer();
            }
        });
    });
}());