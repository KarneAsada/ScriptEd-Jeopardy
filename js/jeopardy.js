// https://www.youtube.com/watch?v=BM4GPPhpLYU
// use bootstrap for columns & rows.


/*global $ */
$(document).ready(function () {
    'use strict';

    var gameData = {
        valueMultiplier: 1,
        teams: [
            {
                name: "",
                score: 0
            },
            {
                name: "",
                score: 0
            }
        ]
    };

    $('.questions > .row > div').each(function () {
        var points = ($('.questions > .row').index($(this).parent()) + 1) * gameData.valueMultiplier * 100;
        $(this).children('.value').text('$' + points);
    }).on('click', function () {
        var answer = $(this).children('.answer')[0];
        var points = ($('.questions > .row').index($(this).parent()) + 1) * gameData.valueMultiplier * 100;

        $(answer).toggle().toggleClass('active');

        console.log(points);

        $(this).off('click');
    });

});