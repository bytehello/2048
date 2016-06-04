
function showNumber(i, j, number) {
	$("#number-cell-" + i + "-" + j)
	.show()
	.text(personalize(number))
	.css({
		"color" : getColor(number),
		"background" : getBackgroundColor(number)
	})
	.animate({
		"width" : cellW + "px",
		"height" : cellW + "px",
		"line-height" : cellW + "px",
		"top" : getOffset(i, j).top,
		"left" : getOffset(i, j).left
	}, 50);
}

function showMove(fromx, fromy, tox, toy) {
	$("#number-cell-" + fromx + "-" + fromy).animate({
		"top" : getOffset(tox, toy).top,
		"left" : getOffset(tox, toy).left
	}, 200);
}

function updateScore() {
	$("#score").text(score);
}
