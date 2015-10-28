// https://www.youtube.com/watch?v=BM4GPPhpLYU
// use bootstrap for columns & rows.


/*global $ */
$(document).ready(function () {
    'use strict';

    var teams = {
        teamOne: {
            name: "",
            score: 0
        },
        teamTwo: {
            name: "",
            score: 0
        }
    };

    $('.question').on('click', function () {
        var value = $(this).children('.value')[0];
        var answer = $(this).children('.answer')[0];
        var points = answer.getAttribute('data-points');
        $(value).toggle();
        $(answer).toggle();
        $(answer).toggleClass('active');
        $(this).off('click');
    });

});