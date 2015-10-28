// https://www.youtube.com/watch?v=BM4GPPhpLYU
// use bootstrap for columns & rows.

function main(){
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

	$('.question').click(function(){
		var value = $(this).children('.value')[0];
		var answer = $(this).children('.answer')[0];
		var points = answer.getAttribute('data-points');
		$(value).toggle();
		$(answer).toggle();
		// console.log('points:', points);
		$(answer).toggleClass('active');
	});
};


$(document).ready(main);