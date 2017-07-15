var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

var score = 0;

var rightPressed = false;
var leftPressed = false;

var paddleHeight = 10;
var paddleWidth = canvas.width/6.5;
var paddleX = (canvas.width - paddleWidth) / 2;

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var bricks = [];
var brickRowCount = 3;
var brickColumnCount = 1;
var brickWidth = canvas.width/brickColumnCount-10;
var brickHeight = 20;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var lvl = 1;
var speedup = 0.25;
var speeddown = 1.3;

function createBricks() {
for(var i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for(var j = 0; j < brickRowCount; j++) {
    bricks[i][j] = {x: 0, y: 0, status: 1, h: Math.floor(Math.random()*((brickRowCount+brickColumnCount/3)-0)+0)};
  }
}}
createBricks();

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score + "  LVL: " + lvl, 35, 22);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(var i = 0; i < brickColumnCount; i++) {
    for(var j = 0; j < brickRowCount; j++) {
      if(bricks[i][j].status == 1) {
        var brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX-25, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
		if(bricks[i][j].h == 1){ctx.fillStyle = "#00ff00"}
		if(bricks[i][j].h == 2){ctx.fillStyle = "#009900"}
		//if(bricks[i][j].h == 3){ctx.fillStyle = "#ff1a1a"}
		//if(bricks[i][j].h == 4){ctx.fillStyle = "#990000"}
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  collisionDetect();
  drawPaddle();
  drawScore();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y > canvas.height-paddleHeight-ballRadius) {
    if(x > paddleX-7 && x < paddleX + paddleWidth+7) {
        dy = -dy;
    }
    else {
        
      alert("You loose!");
      document.location.reload();
    }
  }
  if(rightPressed && paddleX < canvas.width - paddleWidth+0.5) {
    paddleX += 5;
  }
  if(leftPressed && paddleX > 0) {
    paddleX -= 5;
  }

  x += dx;
  y += dy;
}

function keyDownHandler(a) {
  if(a.keyCode == 39) {rightPressed = true;}
  else if(a.keyCode == 37) {leftPressed = true;}
}

var b = 0;

function Interval() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
    ctx.fillText("Level complete!", canvas.width - 10, canvas.high/2);
	ctx.fillText(f, canvas.width - 1, canvas.high/2+10);
}

function collisionDetect() {
    for(i = 0; i < brickColumnCount; i++) {
        for(j = 0; j < brickRowCount; j++) {
            var a = bricks[i][j];
            if(a.status == 1) {
                if(x > a.x && x < a.x+brickWidth && y > a.y && y < a.y+brickHeight) {
                    dy = -dy;
                    a.status = 0;
					if(Math.abs(dy) > speeddown){
					if(a.h == 1){if(dy < 0) {dy -= -speeddown; {if(dx < 0) {dx -= -speeddown}else{dx += -speeddown}} } 
					  else{dy += -speeddown; {if(dx < 0) {dx -= -speeddown}else{dx += -speeddown}}}}
					}
					if(dy < 0) {dy -= speedup; {if(dx < 0) {dx -= speedup}else{dx += speedup}} } 
					   else{dy += speedup; {if(dx < 0) {dx -= speedup}else{dx += speedup}}}					
                    score++;
					b++;
					if(a.h == 2){ballRadius += 1}
					
                    if(b == brickRowCount*brickColumnCount) {
                        //alert("You Win!");						
                        lvlup();   					
                    }
                }  
            }
        }
    }
}

function lvlup() {
	lvl++;
	brickColumnCount++;
    if(brickColumnCount == 13) {brickColumnCount = 12}
	speedup += 0.15;
	speeddown += 0.8;
	if(brickRowCount%3 == 0  && brickRowCount < 7) {brickRowCount++}
	paddleX = (canvas.width - paddleWidth) / 2;
	x = canvas.width/2;
    y = canvas.height-30;
    dx = 2;
    dy = -2;
	b = 0;
	createBricks();
	brickWidth = canvas.width/brickColumnCount;
	ballRadius = 10;
}

function keyUpHandler(a) {
  if(a.keyCode == 39) {rightPressed = false;}
  else if(a.keyCode == 37) {leftPressed = false;}
}

setInterval(draw, 10);
