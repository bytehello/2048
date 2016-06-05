
(function(){

	var version = 2.0;

	var board = [];
	var addable = [];

	var score;
	var gameover = false;

	var docW = document.documentElement.clientWidth;
	var containerW, paddingW, cellW;

	$(function(){
		init();
	})

	function init() {
		makeResponsive();
		addKeyEvent();
		addTouchEvent();
		newGame();
		$("#newGame").click(function(){
			newGame();
		})
	}
		
	function makeResponsive() {
		docW = docW > 500 ? 500 : docW;
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

				function showMove(fromx, fromy, tox, toy) {
					$("#number-cell-" + fromx + "-" + fromy).animate({
						"top" : getOffset(tox, toy).top,
						"left" : getOffset(tox, toy).left
					}, 200);
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

				function nospace() {
					for (var i = 0; i < 4; i++) {
						for (var j = 0; j < 4; j++) {
							if (board[i][j] === 0) return false;
						}
					}
					return true;
				}

				function showNumber(i, j, number) {
					$("#number-cell-" + i + "-" + j)
					.show()
					.text(personalize(number))
					.css({
						"color" : getColor(number),
						"background" : getBackgroundColor(number)
					})
					.animate({
						"width" : cellW,
						"height" : cellW,
						"line-height" : cellW+"px",
						"top" : getOffset(i, j).top,
						"left" : getOffset(i, j).left
					}, 50);
				}

			function checkIfIsGameover() {
				if (gameover) return;
				if (!(canMove("left") || canMove("right") || canMove("up") || canMove("down"))) {
					gameover = true;
					alert(": (\n\nYou lose");
					return;
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

	function newGame() {
		boardReady();
		createNumbers(2);
	}

		function boardReady() {
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					$("#grid-cell-"+i+"-"+j)
					.css({
						top : getOffset(i, j).top,
						left : getOffset(i, j).left
					})
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

			function getOffset(i, j) {
				return {
					top : paddingW + i * (cellW + paddingW),
					left : paddingW + j * (cellW + paddingW)
				}
			}

			function updateBoard() {
				$(".number-cell").remove();
				for (var i = 0; i < 4; i++) {
					for (var j = 0; j < 4; j++) {
						$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
						if (board[i][j] === 0) {
							$("#number-cell-"+i+"-"+j).css({
								"width" : 0,
								"height" : 0,
								"top" : getOffset(i, j).top + 50,
								"left" : getOffset(i, j).left + 50
							})
						} else {
							$("#number-cell-"+i+"-"+j)
							.text(personalize(board[i][j]))
							.css({
								"width" : cellW,
								"height" : cellW,
								"line-height" : cellW+"px",
								"top" : getOffset(i, j).top,
								"left" : getOffset(i, j).left,
								"color" : getColor(board[i][j]),
								"background" : getBackgroundColor(board[i][j])
							})
						}
						addable[i][j] = true;
					}
				}
			}

				function personalize(i) {
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
					}[i]
				}

				function getColor(i) {
					return i <= 4 ? "#776e65" : "#fff";
				}

				function getBackgroundColor(i) {
					var colors = {
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
					return colors[i] ? colors[i] : "#000";
				}

			function updateScore() {
				$("#score").text(score);
			}


		function createNumbers(n) {
			for (var i = 0; i < n; i++) {
				createOneNumber();
			}
		}

})();
