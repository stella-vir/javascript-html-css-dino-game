// var offset = 0
var floorHeight = 100
var playerX = 10
var playerY = floorHeight
var playerWidth = 30
var playerHeight = 70

var jump = false
var speed = 0
var acceleration = 9.8
var jumpSpeed = -20

var obstacles = []
var freqMin = 10
var freqMax = 20
var spawnInterval = 0

var obstacleRadius = 10;

var obsV = -10;

var score = 0;

var gg = false;

// function border() {
//   document.getElementById("myDiv").style.border = "thick solid #0000FF";
//
// }

function drawplayer(ctx) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();

    var path=new Path2D();
    var headOffset = (floorHeight-playerY) * 0.5;

    path.moveTo(playerX,playerY+headOffset-playerHeight);
    path.lineTo(playerX+playerWidth/2,playerY+headOffset-playerHeight+playerWidth/3);
    path.lineTo(playerX+playerWidth,playerY+headOffset-playerHeight);
    path.lineTo(playerX,playerY+headOffset-playerHeight);
    // ctx.fill(path);
    ctx.stroke(path);

    ctx.beginPath();
    ctx.strokeStyle = '#6600ff';
    ctx.lineWidth = 2;

    ctx.rect(playerX+playerWidth/2, playerY-playerHeight+3, 1, 1);
    // ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.ellipse(playerX+playerWidth/2, playerY-playerHeight/2, 10, 25, 0, 0, Math.PI*2);
    // ctx.fill();
    ctx.stroke();

}

function drawObstacles(ctx) {
  for (var i=0; i<obstacles.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = '#00cc66';
    ctx.arc(obstacles[i], floorHeight, obstacleRadius, Math.PI, Math.PI*2)
    ctx.fill();


  }
}

function spawnObstacles() {
  // obstacles' spawning depends on the canvas size
  const canvas = document.querySelector('#canvas');
  if (spawnInterval<=0) {
    // console.log('Spawning an obstacle.')
    // start from outside of the canvas, all the positions
    obstacles.push(canvas.width+obstacleRadius);
    spawnInterval = parseInt(freqMin + (freqMax - freqMin)* Math.random());
  } else {
    // count down to 0 until the next obstable spawning
    spawnInterval--;
  }


}


function draw() {
    const canvas = document.querySelector('#canvas');
    // var canvas = document.getElementById("canvas");
    if (!canvas.getContext) {
        return;
    }

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.stroke();


    // set line stroke and line width
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 10;

    // draw a red line
    ctx.beginPath();
    // set the initial position
    // ctx.moveTo(offset+0, (y+canvas.height)/2);
    // ctx.lineTo(offset+canvas.width, (y+canvas.height)/2);
    // ctx.stroke();
    ctx.moveTo(0, floorHeight);
    ctx.lineTo(canvas.width, floorHeight);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.font = '30px verdana';
    ctx.strokeText('Score: '+score, 60, 50);

    drawplayer(ctx);
    drawObstacles(ctx);

    if (gg) {
      ctx.fillStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.font = '20px verdana';
      ctx.fillText('Game over, well done!', 50, 80);

    }

}

function handlerPlayerInput() {
  // restart the game
  if (gg && jump) {
    playerY = floorHeight;
    speed = 0;
    score = 0;
    obstacles = [];
    jump = false;
    gg = false;
    // end the func here
    return;
  }
  if (jump && playerY == floorHeight) {
    speed = jumpSpeed;
    jump = false;

  }
}

function updatePlayerPos() {
  playerY += speed;
  speed += acceleration;
  // >= below the floor 0 -> 100 top-down
  if (playerY >= floorHeight) {
    playerY = floorHeight;
    speed = 0;
  }

}

function updateObstacles() {
  for (var i=obstacles.length-1; i>=0; i--) {
    obstacles[i] += obsV;
    // going backwards to avoid indices not matchable
    // when the obstacle is approaching the left edge -- 0
    if (obstacles[i] < -obstacleRadius) {
        // remove one from the array in each position
        obstacles.splice(i, 1);
        score += 1;
    }
  }

}


function detectCollison() {
    var npcColliWid = 4;
    var npcL = playerX+playerWidth/2-npcColliWid;
    var npcR = playerX+playerWidth/2+npcColliWid;
    var npcB = playerY;


    for (var i=0; i<obstacles.length; i++) {
      var obsL = obstacles[i]-obstacleRadius;
      var obsR = obstacles[i]+obstacleRadius;
      var obsT = floorHeight-obstacleRadius;

      if (npcL<=obsR && npcR>=obsL && npcB>=obsT) {
        gg = true;
        break;
      }
    }
}


function gameTick() {

    // offset += 10;
    // if (offset > 500)
    //   offset=0;
    handlerPlayerInput();
    if (!gg) {
      updatePlayerPos();
      spawnObstacles();
      updateObstacles();
      detectCollison();
    }

      draw();

}

document.addEventListener('keydown', (event) => {
  if (event.key === " ") {
    console.log('Jump');
    jump = true;
  }
}, false);


// 100=1 millisecond 1000=1 second
setInterval(function(){gameTick()},200);



// end
