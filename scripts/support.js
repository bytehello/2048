
var docW = document.documentElement.clientWidth;
var docH = document.documentElement.clientHeight;
var containerW, paddingW, cellW;

function makeResponsive () {

	if (docW > 500) {
		docW = 500
	}

	containerW = 0.92 * docW;
	paddingW = 0.04 * docW;
	cellW = 0.2 * docW;

	$("#grid-container").css({
		width : containerW,
		height : containerW,
		padding : paddingW
	})

	$(".grid-cell").css({
		width : cellW,
		height : cellW
	})

}

function personalize(number) {
	return {
		"2" : "2",
		"4" : "4",
		"8" : "8",
		"16" : "16",
		"32" : "32",
		"64" : "64",
		"128" : "128",
		"256" : "256",
		"512" : "512",
		"1024" : "1024",
		"2048" : "2048",
		"4096" : "4096",
		"8192" : "8192"
	}[number]
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

function canMove(dir) {
	if (dir === "left") {
		for (var i = 0; i < 4; i++) {
			for (var j = 1; j < 4; j++) {
				if (board[i][j] !== 0) {
					if (board[i][j-1] === 0 || board[i][j-1] === board[i][j]) return true;
				}
			}
		}
		return false;
	}
	if (dir === "right") {
		for (var i = 0; i < 4; i++) {
			for (var j = 2; j >= 0; j--) {
				if (board[i][j] !== 0) {
					if (board[i][j+1] === 0 || board[i][j+1] === board[i][j]) return true;
				}
			}
		}
		return false;
	}
	if (dir === "up") {
		for (var i = 1; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (board[i][j] !== 0) {
					if (board[i-1][j] === 0 || board[i-1][j] === board[i][j]) return true;
				}
			}
		}
		return false;
	}
	if (dir === "down") {
		for (var i = 2; i >= 0; i--) {
			for (var j = 0; j < 4; j++) {
				if (board[i][j] !== 0) {
					if (board[i+1][j] === 0 || board[i+1][j] === board[i][j]) return true;
				}
			}
		}
		return false;
	}
}