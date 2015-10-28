// https://www.youtube.com/watch?v=BM4GPPhpLYU
// use bootstrap for columns & rows.

function main(){

	$('.question').click(function(){
		var value = $(this).children('.value')[0];
		var answer = $(this).children('.answer')[0];
		$(value).toggle();
		$(answer).toggle();
		// console.log('value: ', value);
		// console.log('answer: ', answer);
	})
};


$(document).ready(main);