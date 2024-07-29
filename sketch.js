/*
The Game Project
*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score;
var flagpole;
var lives = 3;

var jumpSound;
var loopSound;
var fallSound;
var collectableSound;
var levelCompleteSound;
var gameOverSound;

var cameraPosX = 0;

var enemies;

var trees_x = [-50, 310, 770, 1000, 1230, 1460, 1690, 2000, 2180, 2400, 2750];

var clouds = [
  { x_pos: -40, y_pos: 80},
  { x_pos: 100, y_pos: 100},
  { x_pos: 220, y_pos: 80},
  { x_pos: 400, y_pos: 150},
  { x_pos: 700, y_pos: 120},
  { x_pos: 550, y_pos: 100},
  { x_pos: 900, y_pos: 150},
  { x_pos: 1100, y_pos: 90},
  { x_pos: 1250, y_pos: 110},
  { x_pos: 1400, y_pos: 80},
  { x_pos: 1600, y_pos: 150},
  { x_pos: 1800, y_pos: 90},
  { x_pos: 2000, y_pos: 80},
  { x_pos: 2200, y_pos: 80},
  { x_pos: 2400, y_pos: 90},
  { x_pos: 2700, y_pos: 80}
];

var mountains = [
  { x_pos: 0, y_pos: floorPos_y - 100, width: 200, height: 250 },
  { x_pos: 100, y_pos: floorPos_y - 150, width: 220, height: 200 },
  { x_pos: 400, y_pos: floorPos_y - 120, width: 180, height: 250 },
  { x_pos: 500, y_pos: floorPos_y - 120, width: 180, height: 210 },
  { x_pos: 950, y_pos: floorPos_y - 150, width: 150, height: 170 },
  { x_pos: 1050, y_pos: floorPos_y - 150, width: 120, height: 150 },
  { x_pos: 1800, y_pos: floorPos_y - 150, width: 160, height: 230 },
  { x_pos: 1700, y_pos: floorPos_y - 150, width: 150, height: 250 },
  { x_pos: 2200, y_pos: floorPos_y - 150, width: 150, height: 200 },
  { x_pos: 2750, y_pos: floorPos_y - 150, width: 150, height: 200 }
];

var canyons = [
  { x_pos: 850, width: 80, depth: 1000},
  { x_pos: 1200, width: 80, depth: 1000},
  { x_pos: 1600, width: 70, depth: 1000},
  { x_pos: 2000, width: 80, depth: 1000}
];

var collectables = [
  { x_pos: 100, y_pos: floorPos_y, size: 30, isFound: false },
  { x_pos: 700, y_pos: floorPos_y, size: 30, isFound: false },
  { x_pos: 1500, y_pos: floorPos_y, size: 30, isFound: false },
  { x_pos: 2300, y_pos: floorPos_y, size: 30, isFound: false }
];


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    loopSound = loadSound('assets/Loop sound.wav');
    loopSound.setVolume(0.15);
    
    fallSound = loadSound('assets/fall.wav');
    fallSound.setVolume(0.1);
    
    collectableSound = loadSound('assets/collectable.wav');
    collectableSound.setVolume(0.4);
    
    levelCompleteSound = loadSound('assets/levelComplete.wav');
    levelCompleteSound.setVolume(0.4);
    
    gameOverSound = loadSound('assets/gameOver.wav');
    gameOverSound.setVolume(0.8);
}


function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    startGame();
    loopSound.loop();
}

function startGame(fullRestart = false) {
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    game_score = 0;
    scrollPos = 0;
    flagpole = {isReached: false, x_pos: 2550};
    // Reset collectables
    for (var i = 0; i < collectables.length; i++) {
        collectables[i].isFound = false;
    }
    if (fullRestart) {
        lives = 3;
    }

    enemies = [];
    enemies.push(new Enemy(20, floorPos_y - 10, 100));
    enemies.push(new Enemy(300, floorPos_y - 10, 100));
    enemies.push(new Enemy(1000, floorPos_y - 10, 100)); 
    enemies.push(new Enemy(1700, floorPos_y - 10, 100));
    enemies.push(new Enemy(2800, floorPos_y - 10, 100));
}


function draw() {
  background(135, 206, 235); // fill the sky blue
    
  cameraPosX = gameChar_x - width / 2;

  // Draw the game scenery
  push();
  translate(-cameraPosX, 0);
    
  // Draw the ground
  noStroke();
  fill(0,128,0);
  rect(-1000, floorPos_y, 5000, height - floorPos_y);

  drawMountains();
  drawTrees();
  drawClouds();

  // Draw the canyons
  for (var i = 0; i < canyons.length; i++) {
      drawCanyon(canyons[i]);
      checkCanyon(canyons[i]);
  }

  // Draw the collectables
  for (var i = 0; i < collectables.length; i++) {
      if(collectables[i].isFound == false){
          drawCollectable(collectables[i]);
          checkCollectable(collectables[i]);
      }
  }
    
  renderFlagpole();    
    
   for (var i = 0; i < enemies.length; i++) {
       
       enemies[i].draw();
       
       if(isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y)){
           lives--;
           if (lives > 0) {
               startGame();
            }
           else {
               fill(255);
               textSize(32);
               textAlign(CENTER, CENTER);
               text("Game Over. Press space to continue.", width / 2 + cameraPosX, height / 2);
               loopSound.stop();
               gameOverSound.play();
               noLoop(); // Stop the draw loop
            }
        }
    }

    // Draw the game character
    if(isLeft && isFalling)
    {
        // Jumping left
        fill(210, 180, 140);
        ellipse(gameChar_x, gameChar_y - 45, 20, 20);
        fill(255, 230, 180);
        ellipse(gameChar_x, gameChar_y-55, 25,10);
        fill(200, 30, 100);
        triangle(gameChar_x - 15, gameChar_y - 10, gameChar_x + 15, gameChar_y - 10, gameChar_x, gameChar_y - 35);
        fill(0);
        ellipse(gameChar_x - 3, gameChar_y - 45, 3, 3);
        ellipse(gameChar_x + 3, gameChar_y - 45, 3, 3);
        fill(210, 180, 140);
        ellipse(gameChar_x - 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x + 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x - 5, gameChar_y - 5, 8, 15);
        ellipse(gameChar_x + 5, gameChar_y - 5, 8, 15);
    }
    
    else if(isRight && isFalling)
    {
        // Jumping right
        fill(210, 180, 140);
        ellipse(gameChar_x, gameChar_y - 45, 20, 20);
        fill(255, 230, 180);
        ellipse(gameChar_x, gameChar_y-55, 25,10);
        fill(200, 30, 100);
        triangle(gameChar_x - 15, gameChar_y - 10, gameChar_x + 15, gameChar_y - 10, gameChar_x, gameChar_y - 35);
        fill(0);
        ellipse(gameChar_x - 3, gameChar_y - 45, 3, 3);
        ellipse(gameChar_x + 3, gameChar_y - 45, 3, 3);
        fill(210, 180, 140);
        ellipse(gameChar_x - 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x + 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x - 5, gameChar_y - 5, 8, 15);
        ellipse(gameChar_x + 5, gameChar_y - 5, 8, 15);
    }
    else if(isLeft)
    {
        // Walking left
        fill(210, 180, 140);
        ellipse(gameChar_x, gameChar_y - 45, 20, 20);
        fill(255, 230, 180);
        ellipse(gameChar_x, gameChar_y-55, 25,10);
        fill(200, 30, 100);
        triangle(gameChar_x - 15, gameChar_y - 10, gameChar_x + 15, gameChar_y - 10, gameChar_x, gameChar_y - 35);
        fill(0);
        ellipse(gameChar_x - 3, gameChar_y - 45, 3, 3);
        ellipse(gameChar_x + 3, gameChar_y - 45, 3, 3);
        fill(210, 180, 140);
        ellipse(gameChar_x - 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x + 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x - 5, gameChar_y - 5, 8, 15);
        ellipse(gameChar_x + 5, gameChar_y - 5, 8, 15);
    }
    else if(isRight)
    {
        // Walking right
        fill(210, 180, 140);
        ellipse(gameChar_x, gameChar_y - 45, 20, 20);
        fill(255, 230, 180);
        ellipse(gameChar_x, gameChar_y-55, 25,10);
        fill(200, 30, 100);
        triangle(gameChar_x - 15, gameChar_y - 10, gameChar_x + 15, gameChar_y - 10, gameChar_x, gameChar_y - 35);
        fill(0);
        ellipse(gameChar_x - 3, gameChar_y - 45, 3, 3);
        ellipse(gameChar_x + 3, gameChar_y - 45, 3, 3);
        fill(210, 180, 140);
        ellipse(gameChar_x - 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x + 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x - 5, gameChar_y - 5, 8, 15);
        ellipse(gameChar_x + 5, gameChar_y - 5, 8, 15);
    }
    else if(isFalling || isPlummeting)
    {
        // Jumping forward
        fill(210, 180, 140);
        ellipse(gameChar_x, gameChar_y - 45, 20, 20);
        fill(255, 230, 180);
        ellipse(gameChar_x, gameChar_y-55, 25,10);
        fill(200, 30, 100);
        triangle(gameChar_x - 15, gameChar_y - 10, gameChar_x + 15, gameChar_y - 10, gameChar_x, gameChar_y - 35);
        fill(0);
        ellipse(gameChar_x - 3, gameChar_y - 45, 3, 3);
        ellipse(gameChar_x + 3, gameChar_y - 45, 3, 3);
        fill(210, 180, 140);
        ellipse(gameChar_x - 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x + 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x - 5, gameChar_y - 5, 8, 15);
        ellipse(gameChar_x + 5, gameChar_y - 5, 8, 15);
    }
    else
    {
        // Standing
        fill(210, 180, 140);
        ellipse(gameChar_x, gameChar_y - 45, 20, 20);
        fill(255, 230, 180);
        ellipse(gameChar_x, gameChar_y-55, 25,10);
        fill(200, 30, 100);
        triangle(gameChar_x - 15, gameChar_y - 10, gameChar_x + 15, gameChar_y - 10, gameChar_x, gameChar_y - 35);
        fill(0);
        ellipse(gameChar_x - 3, gameChar_y - 45, 3, 3);
        ellipse(gameChar_x + 3, gameChar_y - 45, 3, 3);
        fill(210, 180, 140);
        ellipse(gameChar_x - 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x + 10, gameChar_y - 25, 8, 8);
        ellipse(gameChar_x - 5, gameChar_y - 5, 8, 15);
        ellipse(gameChar_x + 5, gameChar_y - 5, 8, 15);
    }
    
    pop();
    
    // Display the score
    fill(255);
    noStroke();
    textSize(18);
    text("Score: " + game_score, 45, 30);
    
    // Display lives
    for (var i = 0; i < lives; i++) {
        fill(255, 0, 0);
        rect(30 + i * 30, 60, 20, 20);
    }

    // INTERACTION CODE
    if (isLeft) {
        gameChar_x -= 5;
    }
    if (isRight) {
        gameChar_x += 5;
    }
    if (gameChar_y < floorPos_y) {
        gameChar_y += 2;
        isFalling = true;
    } else {
        isFalling = false;
    } 
    
    if(flagpole.isReached == false){
        checkFlagpole();
    }

    gameChar_world_x = gameChar_x - scrollPos;
    
    checkPlayerDie();
    
    if (flagpole.isReached){
        fill(255);
        textSize(32);
        text("Level Complete. Press space to continue.", width / 2 - 200, height / 2);
        loopSound.stop();
        levelCompleteSound.play();
    }
    
}

function keyPressed()
{
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);

    if(keyCode === 37) // Left arrow
    {
        console.log("isLeft");
        isLeft = true;
    }
    else if(keyCode === 39) // Right arrow
    {
        console.log("isRight");
        isRight = true;
    }
    else if(keyCode === 38) // Up arrow
    {
        if (gameChar_y >= floorPos_y)
        {
            console.log("jump");
            gameChar_y -= 100; // Adjust the jump height as needed
            isFalling = true;
            jumpSound.play();
        }
    }
    else if (keyCode === 32)
    {
        if (lives <= 0) {
          // Restart the game if lives are zero
          startGame(true);
          loop(); // Restart the draw loop
          loopSound.loop();
        }
    }
    
    if (flagpole.isReached && key === ' ') {
        startGame(true); // Pass true to reset lives
        loop(); // Restart the draw loop
        loopSound.loop();
    }
}

function keyReleased()
{
    console.log("keyReleased: " + key);
    console.log("keyReleased: " + keyCode);

    if(keyCode === 37) // Left arrow
    {
        console.log("isLeft released");
        isLeft = false;
    }
    else if(keyCode === 39) // Right arrow
    {
        console.log("isRight released");
        isRight = false;
    }
}

function drawTrees(){
    for (var i = 0; i < trees_x.length; i++) {
    fill(90, 60, 30);
    rect(trees_x[i] - 10, floorPos_y - 100, 20, 100);
    fill(25, 100, 25);
    triangle(trees_x[i]-75, floorPos_y - 150,
             trees_x[i], floorPos_y-300,
             trees_x[i]+75, floorPos_y-150
            );
    triangle(trees_x[i]-100, floorPos_y-75,
             trees_x[i], floorPos_y-225,
             trees_x[i]+100, floorPos_y-75
            );
  }
}

function drawClouds(){
    for (var i = 0; i < clouds.length; i++) {
    noStroke();
    fill(255);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, 65, 65);
    ellipse(clouds[i].x_pos - 30, clouds[i].y_pos, 45, 45);
    ellipse(clouds[i].x_pos + 30, clouds[i].y_pos, 35, 35);
  }
}

function drawMountains(){
    for (var i = 0; i < mountains.length; i++) {
    noStroke();
    fill(130, 130, 130);
    triangle(
      mountains[i].x_pos+50,
      floorPos_y,
      mountains[i].x_pos + mountains[i].width+50,
      floorPos_y,
      mountains[i].x_pos + mountains[i].width / 2 + 50,
      floorPos_y - mountains[i].height
    );
        
    fill(100, 100, 100);
    triangle(
      mountains[i].x_pos,
      floorPos_y,
      mountains[i].x_pos + mountains[i].width,
      floorPos_y,
      mountains[i].x_pos + mountains[i].width / 2,
      floorPos_y - mountains[i].height
    );
  }
}

function drawCollectable(t_collectable){
    noFill();
    strokeWeight(6);
    stroke(220, 185, 0);
    ellipse(t_collectable.x_pos,
            floorPos_y - t_collectable.size * 0.4, 
            t_collectable.size * 0.8, 
            t_collectable.size * 0.8);
    fill(255, 0, 255);
    stroke(255);
    strokeWeight(1);
    quad(t_collectable.x_pos - t_collectable.size * 0.1, floorPos_y-t_collectable.size * 0.8,
         t_collectable.x_pos - t_collectable.size*0.2, floorPos_y-t_collectable.size*1.1,
         t_collectable.x_pos+t_collectable.size*0.2, floorPos_y-t_collectable.size*1.1,
         t_collectable.x_pos+t_collectable.size * 0.1, floorPos_y-t_collectable.size*0.8);
    noStroke();
}

function checkCollectable(t_collectable){
    if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, floorPos_y) < t_collectable.size) {
        t_collectable.isFound = true;
        game_score += 1;
        collectableSound.play();
    }
}

function drawCanyon(t_canyon) {
  fill(101, 67, 33);
  rect(t_canyon.x_pos, floorPos_y, t_canyon.width, t_canyon.depth);
}

function checkCanyon(t_canyon){  
    if (
        gameChar_x > t_canyon.x_pos &&
        gameChar_x < t_canyon.x_pos + t_canyon.width &&
        gameChar_y >= floorPos_y &&
        gameChar_y < floorPos_y + t_canyon.depth
    ) {
        // Character is inside the canyon
        isPlummeting = true;
        gameChar_x = constrain(gameChar_x, t_canyon.x_pos, t_canyon.x_pos + t_canyon.width);
        gameChar_y = constrain(gameChar_y, floorPos_y, floorPos_y + t_canyon.depth);
        
        // Play fall sound only once when entering the canyon
        if (!fallSound.isPlaying()) {
            fallSound.play();
        }
    } else {
        isPlummeting = false;
    }

    if (isPlummeting) {
        gameChar_y = min(gameChar_y + 10, floorPos_y + t_canyon.depth);
        gameChar_x = constrain(gameChar_x, t_canyon.x_pos, t_canyon.x_pos + t_canyon.width);
    }
}

function renderFlagpole() {
    push();
    strokeWeight(5);
    stroke(190);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255, 0, 0);
    noStroke();

    if (flagpole.isReached) {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
        pop(); // Close the push-pop block after drawing the text
        noLoop();
        return;
    } else {
        fill(255);
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
        pop();
    }
}

function checkFlagpole() {
    gameChar_world_x = gameChar_x - scrollPos;
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15){
        flagpole.isReached = true;
    }
}

function checkPlayerDie() {
  if (gameChar_y > height) {
    lives--;
    if (lives > 0) {
      startGame();
    } else {
      // Game over logic here
      fill(255);
      textSize(32);
      text("Game Over. Press space to continue.", width / 2 - 200 , height / 2);
      loopSound.stop();
      gameOverSound.play();
      noLoop(); // Stop the draw loop
    }
  }
}

function Enemy(x, y, range){
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function(){
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range){
            this.inc = -1;
        }
        else if(this.currentX < this.x){
            this.inc = 1;
        }
    }
    
    this.draw = function(){
        this.update();
        
        fill(210, 180, 140);
        ellipse(this.currentX, this.y - 45, 20, 20);
        fill(255, 0, 0);
        ellipse(this.currentX, this.y - 20, 20, 30);
        fill(0);
        ellipse(this.currentX - 3, this.y - 45, 3, 3);
        ellipse(this.currentX + 3, this.y - 45, 3, 3);
        fill(210, 180, 140);
        ellipse(this.currentX - 10, this.y - 25, 8, 8);
        ellipse(this.currentX + 10, this.y - 25, 8, 8);
        ellipse(this.currentX - 5, this.y - 5, 8, 15);
        ellipse(this.currentX + 5, this.y - 5, 8, 15);
    }
    
    this.checkContact = function(gc_x, gc_y){
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 20){
            return true;
        }
        return false;
    }
}
