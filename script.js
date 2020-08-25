let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

let frameID;
let score = 0;
let timeleft = 30;
let appearCounter = 0;
let appearInterval = 900;
let timeCounter = 0;
let timeInterval = 1000;
let lastInterval = 0;

let shooter = {x: 0, y: height};
let target = {x: 0, y: 0};
let bullets = [];
let bulletSpeed = 20;
let balloons = [];

function drawShooter() {
    //gun
    let angle = - Math.atan2(height - target.y, target.x);
    let x = 20 + Math.cos(angle) * 150;
    let y = height - 20 + Math.sin(angle) * 150;
    shooter = {x: x, y: y};
    ctx.beginPath();
    ctx.fillStyle = '#222';
    ctx.lineWidth = 15;
    ctx.moveTo(0, height)
    ctx.lineTo(x, y)
    ctx.stroke();
    ctx.closePath();

    //body
    ctx.beginPath();
    ctx.fillStyle = '#222';
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#333';
    ctx.moveTo(0, height)
    ctx.arc(0, height, 125, 0, Math.PI + (Math.PI/2), true);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawBullets() {
    bullets.forEach((val, i) => {
        val.x += val.direction.x * bulletSpeed;
        val.y += val.direction.y * bulletSpeed;
        ctx.beginPath();
        ctx.arc(val.x, val.y, 5, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();

        if (val.y < -10) {
            bullets.splice(i, 1);
        }
    });
}

function drawBalloons() {
    let speed;
    ctx.lineWidth = 1;
    balloons.forEach((val, i) => {
        if (val.type == 1) {
            speed = 2;
            ctx.fillStyle = '#ff2d2d';
        } else if (val.type == 2) {
            speed = 4;
            ctx.fillStyle = '#58a2ff';
        } else if (val.type == 3) {
            speed = 6;
            ctx.fillStyle = '#08d208';
        }

        val.x += val.direction.x * speed;
        val.y += val.direction.y * speed;

        ctx.beginPath();
        ctx.ellipse(val.x, val.y, 35, 50, 0, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();

        if (val.y < -50) {
            balloons.splice(i, 1);
        }
    });
}

function addBalloon() {
    let newBalloon = {};
    newBalloon.x = 1000;
    newBalloon.y = 500;
    newBalloon.type = Math.ceil(Math.random() * 3)  ;

    let xDir = Math.random();
    if (xDir > 0.8) {
        xDir = 0.8;
    } else if(xDir < 0.3) {
        xDir = 0.3;
    }

    newBalloon.direction = {x: -xDir, y: -0.6};

    balloons.push(newBalloon);
}

function shoot() {
    let direction = {x: 0, y: 0};
    direction.x = target.x - shooter.x;
    direction.y = target.y - shooter.y;
    let length = Math.sqrt(direction.x*direction.x + direction.y* direction.y);
    direction.x /= length;
    direction.y /= length;

    let bullet = {x: shooter.x, y: shooter.y, direction: direction};
    bullets.push(bullet);
}

function collide() {
    balloons.forEach((bln, iBln) => {
        bullets.forEach((blt, iBlt) => {
            let dx = blt.x - bln.x;
            let dy = blt.y - bln.y;

            if ((dx*dx) / (35*35) + (dy*dy) / (50*50) <= 1) {
                balloons.splice(iBln, 1);
                bullets.splice(iBlt, 1);

                score += bln.type*10;
            }
        });
    });
}

function drawTimeleft() {
    let min = (timeleft / 60 | 0).toString();
    let sec = (timeleft % 60).toString();

    if (min.length < 2) min = '0'+min;
    if (sec.length < 2) sec = '0'+sec;

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(min+':'+sec, 10, 20);

    if (timeleft < 1) {
        window.cancelAnimationFrame(frameID);
    }
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '18px Arial';
    ctx.fillText('Score : ' + score, 10, 45);
}

function play(time = 0) {
    let deltaTime = time - lastInterval;
    lastInterval = time;
    timeCounter += deltaTime;
    appearCounter += deltaTime;

    ctx.clearRect(0, 0, width, height);
    drawShooter();
    drawBullets();
    drawBalloons();
    collide();
    drawScore();

    if (appearCounter > appearInterval) {
        appearCounter = 0;

        addBalloon();
    }

    if (timeCounter > timeInterval) {
        timeCounter = 0;
        timeleft--;
    }
    frameID = requestAnimationFrame(play);
    drawTimeleft();
}

canvas.addEventListener('mousemove', function(e) {
    target.x = e.offsetX;
    target.y = e.offsetY;
})

canvas.addEventListener('click', function(e) {
    shoot();
})

play();
// drawTimeleft();