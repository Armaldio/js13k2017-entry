import Square from './Square';
import Circle from './Circle';

let canvas       = document.getElementById("canvas");
let ctx          = canvas.getContext("2d");
let ballRadius   = 10;
let cursorRadius = 20;
let x            = canvas.width / 2;
let y            = canvas.height / 2;
let ballSpeed    = 2;

let dx = randomInt(0, 1) === 0 ? ballSpeed : ballSpeed * -1;
let dy = randomInt(0, 1) === 0 ? ballSpeed : ballSpeed * -1;

let time      = 60;
let curr_time = 60;
let lostGame  = false;
let score     = 0;

let onHoverLost = false;

let lastMousePos = {};
lastMousePos.x   = 0;
lastMousePos.y   = 0;

let lost   = new Square(cursorRadius * 5);
let cursor = new Circle(cursorRadius);
let ball   = new Circle(ballRadius);
ball.x     = x;
ball.y     = y;

let bottom_text = "Find and click on the lost square while avoiding the ball";

function randomizeLostSquarePosition () {
	do {
		lost.x = randomInt(0, canvas.width - (lost.width));
		lost.y = randomInt(0, canvas.height - (lost.height));
	} while (0);//lost.overlapWithCircle(ball));
}

function getMousePos (canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function drawBall () {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fillStyle   = "rgba(43, 43, 43, .6)";
	ctx.strokeStyle = 'black';
	ctx.lineWidth   = 1.5;
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}

function drawCursor () {
	ctx.beginPath();
	ctx.arc(lastMousePos.x, lastMousePos.y, cursor.radius, 0, Math.PI * 2);
	ctx.fillStyle   = lostGame ? "rgba(255, 0, 0, .6)" : onHoverLost ? "rgba(0, 255, 0, .6)" : "rgba(150, 150, 150, .6)";
	ctx.strokeStyle = 'black';
	ctx.lineWidth   = 1;
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
}

function drawLoadingBar () {
	ctx.fillStyle = "#343434";
	ctx.fillRect(0, canvas.height - 5, canvas.width * curr_time / time, 5);
}

function randomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat (min, max) {
	return Math.random() * (max - min + 1) + min;
}

function drawLostSquare () {
	ctx.fillStyle = "rgba(0, 0, 0, " + lost.opacity + ")";
	ctx.fillRect(lost.x, lost.y, lost.width, lost.height);
}

function drawBottomText () {
	ctx.font      = "30px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "#282828";
	ctx.fillText(bottom_text, canvas.width / 2, canvas.height - 20);
}

function drawScore () {
	ctx.font      = "20px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "#282828";
	ctx.fillText("Score : " + score, 10, 20);
}

function drawBestScore () {
	ctx.font      = "20px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "#282828";
	let scores    = JSON.parse(localStorage.getItem("scores"));
	if (scores === null) {
		scores = [ 0 ];
	}
	let max = Math.max(...scores);
	ctx.fillText("Best   : " + max, 10, 40);
}

function draw () {
	ctx.fillStyle = "#3d3d3d";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawBottomText();
	drawScore();
	drawBestScore();

	drawLostSquare();
	drawCursor();
	drawBall();

	drawLoadingBar();

	onHoverLost = lost.overlapWithCircle(cursor);
	if (onHoverLost) {
		lost.opacity += 0.005;
	}

	if (cursor.intersectsWithCircle(ball) && !lostGame) {
		gameOver();
	}

	if (ball.x + dx > canvas.width - ballRadius || ball.x + dx < ballRadius) {
		dx = -dx;
	}
	if (ball.y + dy > canvas.height - ballRadius || ball.y + dy < ballRadius) {
		dy = -dy;
	}

	ball.x += dx;
	ball.y += dy;
}

/**
 * Get the mouse position everywhere
 * So the ball don't block when outside the canvas
 */
document.addEventListener('mousemove', function (evt) {
	lastMousePos = getMousePos(canvas, evt);
	cursor.x     = lastMousePos.x;
	cursor.y     = lastMousePos.y;
}, false);

function nextLevel () {
	cursor.radius -= 0.1;
	lost.width -= 0.5;
	lost.height  = lost.width;
	ball.radius += 1;
	dx *= 1.03;
	dy *= 1.03;
	lost.opacity = 0;
	score++;
	randomizeLostSquarePosition();
	time--;
	curr_time = time;
}

canvas.addEventListener('click', function (evt) {
	if (lostGame) {
		return;
	}
	lastMousePos = getMousePos(canvas, evt);

	if (onHoverLost) {
		nextLevel();
	}
}, false);

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
							   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

window.main = function () {
	window.requestAnimationFrame(main);

	draw();
};

document.addEventListener('keydown', function (event) {
	if (event.keyCode === 82) { //r - restart
		location.reload();
	}
});

randomizeLostSquarePosition();
main(); //Start the cycle.

function gameOver () {
	bottom_text = "R to retry";
	lostGame    = true;
	let scores  = JSON.parse(localStorage.getItem("scores"));
	if (scores === null) {
		scores = [];
	}
	scores.push(score);
	localStorage.setItem("scores", JSON.stringify(scores));
	score = 0;
}

setInterval(function () {
	if (curr_time <= 0 && lostGame === false) {
		gameOver();
		return; //game over
	}
	curr_time -= 0.05;
	//console.log(curr_time);
}, 1 / time * 1000);