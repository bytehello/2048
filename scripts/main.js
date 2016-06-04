
var board = [];
var addable = [];
var score;
var isgameover = false;

var docW = document.documentElement.clientWidth;
var docH = document.documentElement.clientHeight;

var containerW, paddingW, cellW;

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

$(function(){

	makeResponsive();
	newgame();
	
	$("#newgame").click(function(){
		newgame();
	})

});

function newgame() {
	// initilize
	init();
	// create 2 random grids
	for (var i = 0; i < 2; i++) {
		generateANumber();
	}
}

function init() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-cell-" + i + "-" + j)
			.css({
				"top" : getOffset(i, j).top,
				"left" : getOffset(i, j).left
			});
		}
	}
	for (var i = 0; i < 4; i++) {
		board[i] = [];
		addable[i] = [];
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			addable[i][j] = true;
		}
	}
	score = 0;
	updateBoard();
	updateScore();
}


function updateBoard() {
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			if (board[i][j] === 0) {
				$("#number-cell-" + i + "-" + j).css({
					"width" : 0,
					"height" : 0,
					"top" : getOffset(i, j).top + 50,
					"left" : getOffset(i, j).left + 50
				});
			} else {
				$("#number-cell-" + i + "-" + j)
				.text(personalize(board[i][j]))
				.css({
					"width" : cellW + "px",
					"height" : cellW + "px",
					"line-height" : cellW + "px",
					"top" : getOffset(i, j).top,
					"left" : getOffset(i, j).left,
					"color" : getColor(board[i][j]),
					"background" : getBackgroundColor(board[i][j])
				});
			}
			addable[i][j] = true;
		}
	}
}

function generateANumber() {
	if (nospace()) return false;
	var i = parseInt(Math.floor(Math.random() * 4));
	var j = parseInt(Math.floor(Math.random() * 4));
	var timer = setInterval(function(){
		if (board[i][j] !== 0) {
			i = parseInt(Math.floor(Math.random() * 4));
			j = parseInt(Math.floor(Math.random() * 4));
		} else {
			clearInterval(timer);
			var number = Math.random() <= 0.5 ? 2 : 4;
			board[i][j] = number;
			showNumber(i, j, number);
			return true;
		}
	}, 10);
}

$(document).keydown(function(event){
	switch (event.keyCode || event.which) {
		case 37:
			event.preventDefault();
			if (moveLeft()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
			break;
		case 38:
			event.preventDefault();
			if (moveUp()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
			break;
		case 39:
			event.preventDefault();
			if (moveRight()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
			break;
		case 40:
			event.preventDefault();
			if (moveDown()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
			break;
		default:
			break;
	}
});

var startX, startY, endX, endY;
document.addEventListener("touchstart", function (e) {
	startX = e.touches[0].pageX;
	startY = e.touches[0].pageY;
})
document.addEventListener("touchmove", function (e) {
	e.preventDefault();
})
document.addEventListener("touchend", function (e) {
	endX = e.changedTouches[0].pageX;
	endY = e.changedTouches[0].pageY;
	var deltaX = endX - startX;
	var deltaY = endY - startY;
	console.log("deltaX:"+deltaX+" deltaY:"+deltaY)
	if (Math.abs(deltaX) < 0.02 * docW && Math.abs(deltaY) < 0.02 * docW) return;
	if (Math.abs(deltaX) >= Math.abs(deltaY)) {
		// move horizontally
		if (deltaX > 0) {
			// move right
			if (moveRight()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
		} else {
			// move left
			if (moveLeft()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
		}
	} else {
		// move vertically
		if (deltaY > 0) {
			// move down
			if (moveDown()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
		} else {
			// move up
			if (moveUp()) {
				setTimeout(function(){
					generateANumber();
				}, 200);
				setTimeout(function(){
					checkIfIsGameOver();
				}, 300);
			}
		}
	}
})


function checkIfIsGameOver() {
	if (isgameover) return;
	if (!canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown()) {
		isgameover = true;
		alert(":  (\n\nYou lose");
		return;
	}
}

function moveLeft() {
	if (!canMoveLeft()) return false;
	var noBlockHorizontal = function (i, j, k) {
		for (var u = k + 1; u < j; u++) {
			if (board[i][u] !== 0) return false;
		}
		return true;
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[i][j] !== 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] === 0 && noBlockHorizontal(i, j, k)) {
						showMove(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k) && addable[i][k]) {
						addable[i][k] = false;
						showMove(i, j, i, k);
						board[i][k] += board[i][j];
						score += board[i][k];
						updateScore();
						board[i][j] = 0;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoard, 200);
	return true;
}

function moveRight() {
	if (!canMoveRight()) return false;
	var noBlockHorizontal = function (i, j, k) {
		for (var u = k - 1; u > j; u--) {
			if (board[i][u] !== 0) return false;
		}
		return true;
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] !== 0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k] === 0 && noBlockHorizontal(i, j, k)) {
						showMove(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] === board[i][j] && noBlockHorizontal(i, j, k) && addable[i][k]) {
						addable[i][k] = false;
						showMove(i, j, i, k);
						board[i][k] += board[i][j];
						score += board[i][k];
						updateScore();
						board[i][j] = 0;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoard, 200);
	return true;
}

function moveUp() {
	if (!canMoveUp()) return false;
	var noBlockVertical = function (i, j, k) {
		for (var u = k + 1; u < i; u++) {
			if (board[u][j] !== 0) return false;
		}
		return true;
	}
	for (var i = 1; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] !== 0) {
				for (var k = 0; k < i; k++) {
					if (board[k][j] === 0 && noBlockVertical(i, j, k)) {
						showMove(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] === board[i][j] && noBlockVertical(i, j, k) && addable[k][j]) {
						addable[k][j] = false;
						showMove(i, j, k, j);
						board[k][j] += board[i][j];
						score += board[k][j];
						updateScore();
						board[i][j] = 0;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoard, 200);
	return true;
}

function moveDown() {
	if (!canMoveDown()) return false;
	var noBlockVertical = function (i, j, k) {
		for (var u = k - 1; u > i; u--) {
			if (board[u][j] !== 0) return false;
		}
		return true;
	}
	for (var i = 2; i >= 0; i--) {
		for (var j = 0; j < 4; j++) {
			if (board[i][j] !== 0) {
				for (var k = 3; k > i; k--) {
					if (board[k][j] === 0 && noBlockVertical(i, j, k)) {
						showMove(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] === board[i][j] && noBlockVertical(i, j, k) && addable[k][j]) {
						addable[k][j] = false;
						showMove(i, j, k, j);
						board[k][j] += board[i][j];
						score += board[k][j];
						updateScore();
						board[i][j] = 0;
						continue;
					}
				}
			}
		}
	}
	setTimeout(updateBoard, 200);
	return true;
}
