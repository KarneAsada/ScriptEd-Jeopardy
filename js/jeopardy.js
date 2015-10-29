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
    });


    // Greeting View

    $('.addTeam').click(function(){
    	$('.teamNames').append('<input type="text" class="name" maxlength="10">');
    	if ($('.name').length === 6){
    		$(this).hide();
    	}
    });

    $('.makeTeams').click(function(){
    	var teamNames = $('.name').map(function(team){
    		if ($('.name')[team].value){
	    		return $('.name')[team].value;
    		}
    	});
    	if (teamNames.length){
	    	createTeams(teamNames);
	    	$('.preGame').hide();
	    	$('.scoreboard').toggle();
    	}
    });


    // Scoreboard

	$(document).keypress(function(key){
		if (key.which === 115){
			$('.scoreboard').toggle();
		}
	})

    var fonts = [
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
	]

	var teamIcons = ['bluetoy.png', 'firetoy.png', 'greentoy.png', 'lilastoy.png', 'masktoy.png', 'orangetoy.png', 'pinktoy.png', 'redtoy.png', 'toothtoy.png', 'yellowtoy.png']

    function randomize(arr){
		var current = Math.floor(Math.random()*arr.length);
		var chosen = arr[current];
		arr.splice(current, 1);
		return chosen;
	};

	function createTeams(arr){
		for (var x = 0; x < arr.length; x++){
			var teamObj = {
				name: arr[x],
				score: 0,
			};
			gameData.teams.push(teamObj);
			$('.avatars').append('<td><img src="images/' +randomize(teamIcons)+ '" title='+ arr[x] +'></td>')
			$('.scores').append('<td>'+teamObj.score+'</td>')
			var teamName = $('<td>' + arr[x] + '</td>').css('font-family', randomize(fonts));
			$('.teams').append(teamName);
		}
	}


});





