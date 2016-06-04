
var version = 1.1;
var board = [];
var addable = [];
var score;
var isgameover = false;

$(function(){
	init();
	newgame();
})

function init() {
	makeResponsive();
	addKeyEvent();
	addTouchEvent();
	$("#newgame").click(function(){
		newgame();
	})
}

function newgame() {
	boardReady();
	createNumbers(2);
}

function boardReady() {
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$("#grid-cell-" + i + "-" + j)
			.css({
				top : getOffset(i, j).top,
				left : getOffset(i, j).left
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
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var spot = board[i][j];
			if (spot === 0) {
				$("#number-cell-"+i+"-"+j).css({
					"width" : 0,
					"height" : 0,
					"top" : getOffset(i, j).top + 50,
					"left" : getOffset(i, j).left + 50
				});
			} else {
				$("#number-cell-"+i+"-"+j)
				.text(personalize(spot))
				.css({
					"width" : cellW,
					"height" : cellW,
					"line-height" : cellW+"px",
					"top" : getOffset(i, j).top,
					"left" : getOffset(i, j).left,
					"color" : getColor(spot),
					"background" : getBackgroundColor(spot)
				});
			}
			addable[i][j] = true;
		}
	}
}

function updateScore() {
	$("#score").text(score);
}

function createNumbers(n) {
	for (var i = 0; i < n; i++) {
		createOneNumber();
	}
}
function createOneNumber() {
	if (nospace()) return false;
	var i = parseInt(Math.floor(Math.random()*4));
	var j = parseInt(Math.floor(Math.random()*4));
	var timer = setInterval(function(){
		if (board[i][j] !== 0) {
			i = parseInt(Math.floor(Math.random()*4));
			j = parseInt(Math.floor(Math.random()*4));
		} else {
			clearInterval(timer);
			var number = Math.random() <= 0.5 ? 2 : 4;
			board[i][j] = number;
			showNumber(i, j, number);
		}
	}, 10);
}

function addKeyEvent() {
	$(document).keydown(function(event){
		switch (event.keyCode || event.which) {
			case 37:
				event.preventDefault();
				ifReadyThenMove("left");
				break;
			case 38:
				event.preventDefault();
				ifReadyThenMove("up");
				break;
			case 39:
				event.preventDefault();
				ifReadyThenMove("right");
				break;
			case 40:
				event.preventDefault();
				ifReadyThenMove("down");
				break;
			default:
				break;
		}
	});
}

function ifReadyThenMove(dir) {
	if (canMove(dir)) {
		move(dir);
		setTimeout(function(){
			createOneNumber();
		}, 200);
		setTimeout(function(){
			checkIfIsGameover();
		}, 400);
	}
}

function addTouchEvent() {
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
		if (Math.abs(deltaX) < 0.02*docW && Math.abs(deltaY) < 0.02*docW) return;
		if (Math.abs(deltaX) >= Math.abs(deltaY)) {
			if (deltaX > 0) {
				ifReadyThenMove("right");
			} else {
				ifReadyThenMove("left");
			}
		} else {
			if (deltaY > 0) {
				ifReadyThenMove("down");
			} else {
				ifReadyThenMove("up");
			}
		}
	})
}

function checkIfIsGameover() {
	if (isgameover) return;
	if (!(canMove("left") || canMove("right") || canMove("up") || canMove("down"))) {
		isgameover = true;
		alert(": (\n\nYou lose");
		return;
	}
}

function move(dir) {
	if (dir === "left") {
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
	}
	if (dir === "right") {
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
	}
	if (dir === "up") {
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
	}
	if (dir === "down") {
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
	}
	setTimeout(updateBoard, 200);
}
