
function makeResponsive () {

	if (docW > 500) {
		docW = 500
	}

	containerW = 0.92 * docW;
	paddingW = 0.04 * docW;
	cellW = 0.2 * docW;

	$("#grid-container").css({
		width : containerW + "px",
		height : containerW + "px",
		padding : paddingW + "px"
	});

	$(".grid-cell").css({
		width : cellW + "px",
		height : cellW + "px"
	})

}

function getOffset(i, j) {
	return {
		top : paddingW + i * (cellW + paddingW),
		left : paddingW + j * (cellW + paddingW)
	}
}

function getColor(i) {
	return i <= 4 ? "#776e65" : "#fff";
}

function getBackgroundColor(i) {
	var obj = {
		"2" : "#eee4da",
		"4" : "#ede0c8",
		"8" : "#f2b179",
		"16" : "#f59563",
		"32" : "#f67c5f",
		"64" : "#f65e3b",
		"128" : "#edcf72",
		"256" : "#edcc61",
		"512" : "#9c0",
		"1024" : "#33b5e5",
		"2048" : "#09c",
		"4096" : "#a6c",
		"8192" : "#93c"
	}
	return obj[i] ? obj[i] : "#000";
}

function nospace() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] === 0) return false;
		}
	}
	return true;
}

function canMoveLeft() {
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[i][j] !== 0) {
				if (board[i][j-1] === 0 || board[i][j-1] === board[i][j]) return true;
			}
		}
	}
	return false;
}

function canMoveRight() {
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] !== 0) {
				if (board[i][j+1] === 0 || board[i][j+1] === board[i][j]) return true;
			}
		}
	}
	return false;
}

function canMoveUp() {
	for (var i = 1; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] !== 0) {
				if (board[i-1][j] === 0 || board[i-1][j] === board[i][j]) return true;
			}
		}
	}
	return false;
}

function canMoveDown() {
	for (var i = 2; i >= 0; i--) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] !== 0) {
				if (board[i+1][j] === 0 || board[i+1][j] === board[i][j]) return true;
			}
		}
	}
	return false;
}
