// Copyright 2012 Shaun Williams
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License Version 3 as 
//  published by the Free Software Foundation.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.

// ==========================================================================
// PAC-MAN
// an accurate remake of the original arcade game

// Based on original works by Namco, GCC, and Midway.
// Research by Jamey Pittman and Bart Grantham
// Developed by Shaun Williams, Mason Borda

// ==========================================================================

(function(){

//@line 1 "src/inherit.js"
//  Apparently, the mutable, non-standard __proto__ property creates a lot of complexity for JS optimizers,
//   so it may be phased out in future JS versions.  It's not even supported in Internet Explorer.
//
//  Object.create does everything that I would use a mutable __proto__ for, but this isn't implemented everywhere yet.
// 
//  So instead of the following:
//
//      var obj = {
//          __proto__: parentObj,
//          hello: function() { return "world"; },
//      };
//
//  You can use this:
//
//      var obj = newChildObject(parentObj, {
//          hello: function() { return "world"; },
//      };

var newChildObject = function(parentObj, newObj) {

    // equivalent to: var resultObj = { __proto__: parentObj };
    var x = function(){};
    x.prototype = parentObj;
    var resultObj = new x();

    // store new members in resultObj
    if (newObj) {
        var hasProp = {}.hasOwnProperty;
        for (var name in newObj) {
            if (hasProp.call(newObj, name)) {
                resultObj[name] = newObj[name];
            }
        }
    }

    return resultObj;
};

var DEBUG = false;
//@line 1 "src/sound.js"
/* Sound handlers added by Dr James Freeman who was sad such a great reverse was a silent movie  */

var audio = new preloadAudio();

function audioTrack(url, volume) {
    var audio = new Audio(url);
    if (volume) audio.volume = volume;
    audio.load();
    var looping = false;
    this.play = function(noResetTime) {
        playSound(noResetTime);
    };
    this.startLoop = function(noResetTime) {
        if (looping) return;
        audio.addEventListener('ended', audioLoop);
        audioLoop(noResetTime);
        looping = true;
    };
    this.stopLoop = function(noResetTime) {
        try{ audio.removeEventListener('ended', audioLoop) } catch (e) {};
        audio.pause();
        if (!noResetTime) audio.currentTime = 0;
        looping = false;
    };
    this.isPlaying = function() {
        return !audio.paused;
    };
    this.isPaused = function() {
        return audio.paused;
    }; 
    this.stop = this.stopLoop;

    function audioLoop(noResetTime) {
        playSound(noResetTime);
    }
    function playSound(noResetTime) {
        // for really rapid sound repeat set noResetTime
        if(!audio.paused) {
            audio.pause();
            if (!noResetTime ) audio.currentTime = 0;
        }
        try{
            var playPromise = audio.play();
            if(playPromise) {
                playPromise.then(function(){}).catch(function(err){});
            }
        } 
        catch(err){ console.error(err) }
    }
}


function preloadAudio() {

    this.credit            = new audioTrack('sounds/credit.mp3');
    this.coffeeBreakMusic  = new audioTrack('sounds/coffee-break-music.mp3');
    this.die               = new audioTrack('sounds/miss.mp3');
    this.ghostReturnToHome = new audioTrack('sounds/ghost-return-to-home.mp3');
    this.eatingGhost       = new audioTrack('sounds/eating-ghost.mp3');
    this.ghostTurnToBlue   = new audioTrack('sounds/ghost-turn-to-blue.mp3', 0.5);
    this.eatingFruit       = new audioTrack('sounds/eating-fruit.mp3');
    this.ghostSpurtMove1   = new audioTrack('sounds/ghost-spurt-move-1.mp3');
    this.ghostSpurtMove2   = new audioTrack('sounds/ghost-spurt-move-2.mp3');
    this.ghostSpurtMove3   = new audioTrack('sounds/ghost-spurt-move-3.mp3');
    this.ghostSpurtMove4   = new audioTrack('sounds/ghost-spurt-move-4.mp3');
    this.ghostNormalMove   = new audioTrack('sounds/ghost-normal-move.mp3');
    this.extend            = new audioTrack('sounds/extend.mp3');
    this.eating            = new audioTrack('sounds/eating.mp3', 0.5);
    this.startMusic        = new audioTrack('sounds/start-music.mp3');

    this.ghostReset = function(noResetTime) {
        for (var s in this) {
            if (s == 'silence' || s == 'ghostReset' ) return;
            if (s.match(/^ghost/)) this[s].stopLoop(noResetTime);
        }
    };

    this.silence = function(noResetTime) {
        for (var s in this) {
            if (s == 'silence' || s == 'ghostReset' ) return;
            this[s].stopLoop(noResetTime);
        }
    }
}
//@line 1 "src/random.js"

var getRandomColor = function() {
    return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
};

var getRandomInt = function(min,max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
};

//@line 1 "src/game.js"
//////////////////////////////////////////////////////////////////////////////////////
// Game

// game modes
var GAME_PACMAN = 0;
var GAME_MSPACMAN = 1;
var GAME_COOKIE = 2;
var GAME_OTTO = 3;

var practiceMode = false;
var turboMode = false;

// current game mode
var gameMode = GAME_PACMAN;
var getGameName = (function(){

    var names = ["PAC-MAN", "MS PAC-MAN", "COOKIE-MAN","CRAZY OTTO"];
    
    return function(mode) {
        if (mode == undefined) {
            mode = gameMode;
        }
        return names[mode];
    };
})();

var getGameDescription = (function(){

    var desc = [
        [
            "ORIGINAL ARCADE:",
            "NAMCO (C) 1980",
            "",
            "REVERSE-ENGINEERING:",
            "JAMEY PITTMAN",
            "",
            "REMAKE:",
            "SHAUN WILLIAMS",
        ],
        [
            "ORIGINAL ARCADE ADDON:",
            "MIDWAY/GCC (C) 1981",
            "",
            "REVERSE-ENGINEERING:",
            "BART GRANTHAM",
            "",
            "REMAKE:",
            "SHAUN WILLIAMS",
        ],
        [
            "A NEW PAC-MAN GAME",
            "WITH RANDOM MAZES:",
            "SHAUN WILLIAMS (C) 2012",
            "",
            "COOKIE MONSTER DESIGN:",
            "JIM HENSON",
            "",
            "PAC-MAN CROSSOVER CONCEPT:",
            "TANG YONGFA",
        ],
        [
            "THE UNRELEASED",
            "MS. PAC-MAN PROTOTYPE:",
            "GCC (C) 1981",
            "",
            "SPRITES REFERENCED FROM",
            "STEVE GOLSON'S",
            "CAX 2012 PRESENTATION",
            "",
            "REMAKE:",
            "SHAUN WILLIAMS",
        ],
    ];
    
    return function(mode) {
        if (mode == undefined) {
            mode = gameMode;
        }
        return desc[mode];
    };
})();

var getGhostNames = function(mode) {
    if (mode == undefined) {
        mode = gameMode;
    }
    if (mode == GAME_OTTO) {
        return ["plato","darwin","freud","newton"];
    }
    else if (mode == GAME_MSPACMAN) {
        return ["blinky","pinky","inky","sue"];
    }
    else if (mode == GAME_PACMAN) {
        return ["blinky","pinky","inky","clyde"];
    }
    else if (mode == GAME_COOKIE) {
        return ["elmo","piggy","rosita","zoe"];
    }
};

var getGhostDrawFunc = function(mode) {
    if (mode == undefined) {
        mode = gameMode;
    }
    if (mode == GAME_OTTO) {
        return atlas.drawMonsterSprite;
    }
    else if (mode == GAME_COOKIE) {
        return atlas.drawMuppetSprite;
    }
    else {
        return atlas.drawGhostSprite;
    }
};

var getPlayerDrawFunc = function(mode) {
    if (mode == undefined) {
        mode = gameMode;
    }
    if (mode == GAME_OTTO) {
        return atlas.drawOttoSprite;
    }
    else if (mode == GAME_PACMAN) {
        return atlas.drawPacmanSprite;
    }
    else if (mode == GAME_MSPACMAN) {
        return atlas.drawMsPacmanSprite;
    }
    else if (mode == GAME_COOKIE) {
        //return atlas.drawCookiemanSprite;
        return drawCookiemanSprite;
    }
};


// for clearing, backing up, and restoring cheat states (before and after cutscenes presently)
var clearCheats, backupCheats, restoreCheats;
(function(){
    clearCheats = function() {
        pacman.invincible = false;
        pacman.ai = false;
        for (i=0; i<5; i++) {
            actors[i].isDrawPath = false;
            actors[i].isDrawTarget = false;
        }
        executive.setUpdatesPerSecond(60);
    };

    var i, invincible, ai, isDrawPath, isDrawTarget;
    isDrawPath = {};
    isDrawTarget = {};
    backupCheats = function() {
        invincible = pacman.invincible;
        ai = pacman.ai;
        for (i=0; i<5; i++) {
            isDrawPath[i] = actors[i].isDrawPath;
            isDrawTarget[i] = actors[i].isDrawTarget;
        }
    };
    restoreCheats = function() {
        pacman.invincible = invincible;
        pacman.ai = ai;
        for (i=0; i<5; i++) {
            actors[i].isDrawPath = isDrawPath[i];
            actors[i].isDrawTarget = isDrawTarget[i];
        }
    };
})();

// current level, lives, and score
var level = 1;
var extraLives = 0;

// VCR functions

var savedLevel = {};
var savedExtraLives = {};
var savedHighScore = {};
var savedScore = {};
var savedState = {};

var saveGame = function(t) {
    savedLevel[t] = level;
    savedExtraLives[t] = extraLives;
    savedHighScore[t] = getHighScore();
    savedScore[t] = getScore();
    savedState[t] = state;
};
var loadGame = function(t) {
    level = savedLevel[t];
    if (extraLives != savedExtraLives[t]) {
        extraLives = savedExtraLives[t];
        renderer.drawMap();
    }
    setHighScore(savedHighScore[t]);
    setScore(savedScore[t]);
    state = savedState[t];
};

/// SCORING
// (manages scores and high scores for each game type)

var scores = [
    0,0, // pacman
    0,0, // mspac
    0,0, // cookie
    0,0, // otto
    0 ];
var highScores = [
    10000,10000, // pacman
    10000,10000, // mspac
    10000,10000, // cookie
    10000,10000, // otto
    ];

var getScoreIndex = function() {
    if (practiceMode) {
        return 8;
    }
    return gameMode*2 + (turboMode ? 1 : 0);
};

// handle a score increment
var addScore = function(p) {

    // get current scores
    var score = getScore();

    // handle extra life at 10000 points
    if (score < 10000 && score+p >= 10000) {
        extraLives++;
        renderer.drawMap();
    }

    score += p;
    setScore(score);

    if (!practiceMode) {
        if (score > getHighScore()) {
            setHighScore(score);
        }
    }
};

var getScore = function() {
    return scores[getScoreIndex()];
};
var setScore = function(score) {
    scores[getScoreIndex()] = score;
};

var getHighScore = function() {
    return highScores[getScoreIndex()];
};
var setHighScore = function(highScore) {
    highScores[getScoreIndex()] = highScore;
    saveHighScores();
};
// High Score Persistence

var loadHighScores = function() {
    var hs;
    var hslen;
    var i;
    if (localStorage && localStorage.highScores) {
        hs = JSON.parse(localStorage.highScores);
        hslen = hs.length;
        for (i=0; i<hslen; i++) {
            highScores[i] = Math.max(highScores[i],hs[i]);
        }
    }
};
var saveHighScores = function() {
    if (localStorage) {
        localStorage.highScores = JSON.stringify(highScores);
    }
};
//@line 1 "src/direction.js"
//////////////////////////////////////////////////////////////////////////////////////
// Directions
// (variables and utility functions for representing actor heading direction)

// direction enums (in counter-clockwise order)
// NOTE: changing the order of these enums may effect the enums.
//       I've tried abstracting away the uses by creating functions to rotate them.
// NOTE: This order determines tie-breakers in the shortest distance turn logic.
//       (i.e. higher priority turns have lower enum values)
var DIR_UP = 0;
var DIR_LEFT = 1;
var DIR_DOWN = 2;
var DIR_RIGHT = 3;

var getClockwiseAngleFromTop = function(dirEnum) {
    return -dirEnum*Math.PI/2;
};

var rotateLeft = function(dirEnum) {
    return (dirEnum+1)%4;
};

var rotateRight = function(dirEnum) {
    return (dirEnum+3)%4;
};

var rotateAboutFace = function(dirEnum) {
    return (dirEnum+2)%4;
};

// get direction enum from a direction vector
var getEnumFromDir = function(dir) {
    if (dir.x==-1) return DIR_LEFT;
    if (dir.x==1) return DIR_RIGHT;
    if (dir.y==-1) return DIR_UP;
    if (dir.y==1) return DIR_DOWN;
};

// set direction vector from a direction enum
var setDirFromEnum = function(dir,dirEnum) {
    if (dirEnum == DIR_UP)         { dir.x = 0; dir.y =-1; }
    else if (dirEnum == DIR_RIGHT)  { dir.x =1; dir.y = 0; }
    else if (dirEnum == DIR_DOWN)  { dir.x = 0; dir.y = 1; }
    else if (dirEnum == DIR_LEFT) { dir.x = -1; dir.y = 0; }
};

// return the direction of the open, surrounding tile closest to our target
var getTurnClosestToTarget = function(tile,targetTile,openTiles) {

    var dx,dy,dist;                      // variables used for euclidean distance
    var minDist = Infinity;              // variable used for finding minimum distance path
    var dir = {};
    var dirEnum = 0;
    var i;
    for (i=0; i<4; i++) {
        if (openTiles[i]) {
            setDirFromEnum(dir,i);
            dx = dir.x + tile.x - targetTile.x;
            dy = dir.y + tile.y - targetTile.y;
            dist = dx*dx+dy*dy;
            if (dist < minDist) {
                minDist = dist;
                dirEnum = i;
            }
        }
    }
    return dirEnum;
};

// retrieve four surrounding tiles and indicate whether they are open
var getOpenTiles = function(tile,dirEnum) {

    // get open passages
    var openTiles = {};
    openTiles[DIR_UP] =    map.isFloorTile(tile.x, tile.y-1);
    openTiles[DIR_RIGHT] = map.isFloorTile(tile.x+1, tile.y);
    openTiles[DIR_DOWN] =  map.isFloorTile(tile.x, tile.y+1);
    openTiles[DIR_LEFT] =  map.isFloorTile(tile.x-1, tile.y);

    var numOpenTiles = 0;
    var i;
    if (dirEnum != undefined) {

        // count number of open tiles
        for (i=0; i<4; i++)
            if (openTiles[i])
                numOpenTiles++;

        // By design, no mazes should have dead ends,
        // but allow player to turn around if and only if it's necessary.
        // Only close the passage behind the player if there are other openings.
        var oppDirEnum = rotateAboutFace(dirEnum); // current opposite direction enum
        if (numOpenTiles > 1)
            openTiles[oppDirEnum] = false;
    }

    return openTiles;
};

// returns if the given tile coordinate plus the given direction vector has a walkable floor tile
var isNextTileFloor = function(tile,dir) {
    return map.isFloorTile(tile.x+dir.x,tile.y+dir.y);
};

//@line 1 "src/Map.js"
//////////////////////////////////////////////////////////////////////////////////////
// Map
// (an ascii map of tiles representing a level maze)

// size of a square tile in pixels
var tileSize = 8;

// the center pixel of a tile
var midTile = {x:3, y:4};

// constructor
var Map = function(numCols, numRows, tiles) {

    // sizes
    this.numCols = numCols;
    this.numRows = numRows;
    this.numTiles = numCols*numRows;
    this.widthPixels = numCols*tileSize;
    this.heightPixels = numRows*tileSize;

    // ascii map
    this.tiles = tiles;

    // ghost home location
    this.doorTile = {x:13, y:14};
    this.doorPixel = {
        x:(this.doorTile.x+1)*tileSize-1, 
        y:this.doorTile.y*tileSize + midTile.y
    };
    this.homeTopPixel = 17*tileSize;
    this.homeBottomPixel = 18*tileSize;

    this.timeEaten = {};

    this.resetCurrent();
    this.parseDots();
    this.parseTunnels();
    this.parseWalls();
};

Map.prototype.save = function(t) {
};

Map.prototype.eraseFuture = function(t) {
    // current state at t.
    // erase all states after t.
    var i;
    for (i=0; i<this.numTiles; i++) {
        if (t <= this.timeEaten[i]) {
            delete this.timeEaten[i];
        }
    }
};

Map.prototype.load = function(t,abs_t) {
    var firstTile,curTile;
    var refresh = function(i) {
        var x,y;
        x = i%this.numCols;
        y = Math.floor(i/this.numCols);
        renderer.refreshPellet(x,y);
    };
    var i;
    for (i=0; i<this.numTiles; i++) {
        firstTile = this.startTiles[i];
        if (firstTile == '.' || firstTile == 'o') {
            if (abs_t <= this.timeEaten[i]) { // dot should be present
                if (this.currentTiles[i] != firstTile) {
                    this.dotsEaten--;
                    this.currentTiles[i] = firstTile;
                    refresh.call(this,i);
                }
            }
            else if (abs_t > this.timeEaten[i]) { // dot should be missing
                if (this.currentTiles[i] != ' ') {
                    this.dotsEaten++;
                    this.currentTiles[i] = ' ';
                    refresh.call(this,i);
                }
            }
        }
    }
};

Map.prototype.resetTimeEaten = function()
{
    this.startTiles = this.currentTiles.slice(0);
    this.timeEaten = {};
};

// reset current tiles
Map.prototype.resetCurrent = function() {
    this.currentTiles = this.tiles.split(""); // create a mutable list copy of an immutable string
    this.dotsEaten = 0;
};

// This is a procedural way to generate original-looking maps from a simple ascii tile
// map without a spritesheet.
Map.prototype.parseWalls = function() {

    var that = this;

    // creates a list of drawable canvas paths to render the map walls
    this.paths = [];

    // a map of wall tiles that already belong to a built path
    var visited = {};

    // we extend the x range to suggest the continuation of the tunnels
    var toIndex = function(x,y) {
        if (x>=-2 && x<that.numCols+2 && y>=0 && y<that.numRows)
            return (x+2)+y*(that.numCols+4);
    };

    // a map of which wall tiles that are not completely surrounded by other wall tiles
    var edges = {};
    var i=0,x,y;
    for (y=0;y<this.numRows;y++) {
        for (x=-2;x<this.numCols+2;x++,i++) {
            if (this.getTile(x,y) == '|' &&
                (this.getTile(x-1,y) != '|' ||
                this.getTile(x+1,y) != '|' ||
                this.getTile(x,y-1) != '|' ||
                this.getTile(x,y+1) != '|' ||
                this.getTile(x-1,y-1) != '|' ||
                this.getTile(x-1,y+1) != '|' ||
                this.getTile(x+1,y-1) != '|' ||
                this.getTile(x+1,y+1) != '|')) {
                edges[i] = true;
            }
        }
    }

    // walks along edge wall tiles starting at the given index to build a canvas path
    var makePath = function(tx,ty) {

        // get initial direction
        var dir = {};
        var dirEnum;
        if (toIndex(tx+1,ty) in edges)
            dirEnum = DIR_RIGHT;
        else if (toIndex(tx, ty+1) in edges)
            dirEnum = DIR_DOWN;
        else
            throw "tile shouldn't be 1x1 at "+tx+","+ty;
        setDirFromEnum(dir,dirEnum);

        // increment to next tile
        tx += dir.x;
        ty += dir.y;

        // backup initial location and direction
        var init_tx = tx;
        var init_ty = ty;
        var init_dirEnum = dirEnum;

        var path = [];
        var pad; // (persists for each call to getStartPoint)
        var point;
        var lastPoint;

        var turn,turnAround;

        /*

           We employ the 'right-hand rule' by keeping our right hand in contact
           with the wall to outline an individual wall piece.

           Since we parse the tiles in row major order, we will always start
           walking along the wall at the leftmost tile of its topmost row.  We
           then proceed walking to the right.  

           When facing the direction of the walk at each tile, the outline will
           hug the left side of the tile unless there is a walkable tile to the
           left.  In that case, there will be a padding distance applied.
           
        */
        var getStartPoint = function(tx,ty,dirEnum) {
            var dir = {};
            setDirFromEnum(dir, dirEnum);
            if (!(toIndex(tx+dir.y,ty-dir.x) in edges))
                pad = that.isFloorTile(tx+dir.y,ty-dir.x) ? 5 : 0;
            var px = -tileSize/2+pad;
            var py = tileSize/2;
            var a = getClockwiseAngleFromTop(dirEnum);
            var c = Math.cos(a);
            var s = Math.sin(a);
            return {
                // the first expression is the rotated point centered at origin
                // the second expression is to translate it to the tile
                x:(px*c - py*s) + (tx+0.5)*tileSize,
                y:(px*s + py*c) + (ty+0.5)*tileSize,
            };
        };
        while (true) {
            
            visited[toIndex(tx,ty)] = true;

            // determine start point
            point = getStartPoint(tx,ty,dirEnum);

            if (turn) {
                // if we're turning into this tile, create a control point for the curve
                //
                // >---+  <- control point
                //     |
                //     V
                lastPoint = path[path.length-1];
                if (dir.x == 0) {
                    point.cx = point.x;
                    point.cy = lastPoint.y;
                }
                else {
                    point.cx = lastPoint.x;
                    point.cy = point.y;
                }
            }

            // update direction
            turn = false;
            turnAround = false;
            if (toIndex(tx+dir.y, ty-dir.x) in edges) { // turn left
                dirEnum = rotateLeft(dirEnum);
                turn = true;
            }
            else if (toIndex(tx+dir.x, ty+dir.y) in edges) { // continue straight
            }
            else if (toIndex(tx-dir.y, ty+dir.x) in edges) { // turn right
                dirEnum = rotateRight(dirEnum);
                turn = true;
            }
            else { // turn around
                dirEnum = rotateAboutFace(dirEnum);
                turnAround = true;
            }
            setDirFromEnum(dir,dirEnum);

            // commit path point
            path.push(point);

            // special case for turning around (have to connect more dots manually)
            if (turnAround) {
                path.push(getStartPoint(tx-dir.x, ty-dir.y, rotateAboutFace(dirEnum)));
                path.push(getStartPoint(tx, ty, dirEnum));
            }

            // advance to the next wall
            tx += dir.x;
            ty += dir.y;

            // exit at full cycle
            if (tx==init_tx && ty==init_ty && dirEnum == init_dirEnum) {
                that.paths.push(path);
                break;
            }
        }
    };

    // iterate through all edges, making a new path after hitting an unvisited wall edge
    i=0;
    for (y=0;y<this.numRows;y++)
        for (x=-2;x<this.numCols+2;x++,i++)
            if (i in edges && !(i in visited)) {
                visited[i] = true;
                makePath(x,y);
            }
};

// count pellets and store energizer locations
Map.prototype.parseDots = function() {

    this.numDots = 0;
    this.numEnergizers = 0;
    this.energizers = [];

    var x,y;
    var i = 0;
    var tile;
    for (y=0; y<this.numRows; y++) for (x=0; x<this.numCols; x++) {
        tile = this.tiles[i];
        if (tile == '.') {
            this.numDots++;
        }
        else if (tile == 'o') {
            this.numDots++;
            this.numEnergizers++;
            this.energizers.push({'x':x,'y':y});
        }
        i++;
    }
};

// get remaining dots left
Map.prototype.dotsLeft = function() {
    return this.numDots - this.dotsEaten;
};

// determine if all dots have been eaten
Map.prototype.allDotsEaten = function() {
    return this.dotsLeft() == 0;
};

// create a record of tunnel locations
Map.prototype.parseTunnels = (function(){
    
    // starting from x,y and increment x by dx...
    // determine where the tunnel entrance begins
    var getTunnelEntrance = function(x,y,dx) {
        while (!this.isFloorTile(x,y-1) && !this.isFloorTile(x,y+1) && this.isFloorTile(x,y))
            x += dx;
        return x;
    };

    // the number of margin tiles outside of the map on one side of a tunnel
    // There are (2*marginTiles) tiles outside of the map per tunnel.
    var marginTiles = 2;

    return function() {
        this.tunnelRows = {};
        var y;
        var i;
        var left,right;
        for (y=0;y<this.numRows;y++)
            // a map row is a tunnel if opposite ends are both walkable tiles
            if (this.isFloorTile(0,y) && this.isFloorTile(this.numCols-1,y))
                this.tunnelRows[y] = {
                    'leftEntrance': getTunnelEntrance.call(this,0,y,1),
                    'rightEntrance':getTunnelEntrance.call(this,this.numCols-1,y,-1),
                    'leftExit': -marginTiles*tileSize,
                    'rightExit': (this.numCols+marginTiles)*tileSize-1,
                };
    };
})();

// teleport actor to other side of tunnel if necessary
Map.prototype.teleport = function(actor){
    var i;
    var t = this.tunnelRows[actor.tile.y];
    if (t) {
        if (actor.pixel.x < t.leftExit)       actor.pixel.x = t.rightExit;
        else if (actor.pixel.x > t.rightExit) actor.pixel.x = t.leftExit;
    }
};

Map.prototype.posToIndex = function(x,y) {
    if (x>=0 && x<this.numCols && y>=0 && y<this.numRows) 
        return x+y*this.numCols;
};

// define which tiles are inside the tunnel
Map.prototype.isTunnelTile = function(x,y) {
    var tunnel = this.tunnelRows[y];
    return tunnel && (x < tunnel.leftEntrance || x > tunnel.rightEntrance);
};

// retrieves tile character at given coordinate
// extended to include offscreen tunnel space
Map.prototype.getTile = function(x,y) {
    if (x>=0 && x<this.numCols && y>=0 && y<this.numRows) 
        return this.currentTiles[this.posToIndex(x,y)];
    if ((x<0 || x>=this.numCols) && (this.isTunnelTile(x,y-1) || this.isTunnelTile(x,y+1)))
        return '|';
    if (this.isTunnelTile(x,y))
        return ' ';
};

// determines if the given character is a walkable floor tile
Map.prototype.isFloorTileChar = function(tile) {
    return tile==' ' || tile=='.' || tile=='o';
};

// determines if the given tile coordinate has a walkable floor tile
Map.prototype.isFloorTile = function(x,y) {
    return this.isFloorTileChar(this.getTile(x,y));
};

// mark the dot at the given coordinate eaten
Map.prototype.onDotEat = function(x,y) {
    this.dotsEaten++;
    var i = this.posToIndex(x,y);
    this.currentTiles[i] = ' ';
    this.timeEaten[i] = vcr.getTime();
    renderer.erasePellet(x,y);
};
//@line 1 "src/colors.js"
// source: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r *= 255;
    g *= 255;
    b *= 255;

    return [r,g,b];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r/255, g = g/255, b = b/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    r *= 255;
    g *= 255;
    b *= 255;

    return [r,g,b];
}

function rgbString(rgb) {
    var r = Math.floor(rgb[0]);
    var g = Math.floor(rgb[1]);
    var b = Math.floor(rgb[2]);
    return 'rgb('+r+','+g+','+b+')';
}
//@line 1 "src/mapgen.js"
var mapgen = (function(){

    var shuffle = function(list) {
        var len = list.length;
        var i,j;
        var temp;
        for (i=0; i<len; i++) {
            j = getRandomInt(0,len-1);
            temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        }
    };

    var randomElement = function(list) {
        var len = list.length;
        if (len > 0) {
            return list[getRandomInt(0,len-1)];
        }
    };

    var UP = 0;
    var RIGHT = 1;
    var DOWN = 2;
    var LEFT = 3;

    var cells = [];
    var tallRows = [];
    var narrowCols = [];

    var rows = 9;
    var cols = 5;

    var reset = function() {
        var i;
        var c;

        // initialize cells
        for (i=0; i<rows*cols; i++) {
            cells[i] = {
                x: i%cols,
                y: Math.floor(i/cols),
                filled: false,
                connect: [false, false, false, false],
                next: [],
                no: undefined,
                group: undefined,
            };
        }

        // allow each cell to refer to surround cells by direction
        for (i=0; i<rows*cols; i++) {
            var c = cells[i];
            if (c.x > 0)
                c.next[LEFT] = cells[i-1];
            if (c.x < cols - 1)
                c.next[RIGHT] = cells[i+1];
            if (c.y > 0)
                c.next[UP] = cells[i-cols];
            if (c.y < rows - 1)
                c.next[DOWN] = cells[i+cols];
        }

        // define the ghost home square

        i = 3*cols;
        c = cells[i];
        c.filled=true;
        c.connect[LEFT] = c.connect[RIGHT] = c.connect[DOWN] = true;

        i++;
        c = cells[i];
        c.filled=true;
        c.connect[LEFT] = c.connect[DOWN] = true;

        i+=cols-1;
        c = cells[i];
        c.filled=true;
        c.connect[LEFT] = c.connect[UP] = c.connect[RIGHT] = true;

        i++;
        c = cells[i];
        c.filled=true;
        c.connect[UP] = c.connect[LEFT] = true;
    };

    var genRandom = function() {

        var getLeftMostEmptyCells = function() {
            var x;
            var leftCells = [];
            for (x=0; x<cols; x++) {
                for (y=0; y<rows; y++) {
                    var c = cells[x+y*cols];
                    if (!c.filled) {
                        leftCells.push(c);
                    }
                }

                if (leftCells.length > 0) {
                    break;
                }
            }
            return leftCells;
        };
        var isOpenCell = function(cell,i,prevDir,size) {

            // prevent wall from going through starting position
            if (cell.y == 6 && cell.x == 0 && i == DOWN ||
                cell.y == 7 && cell.x == 0 && i == UP) {
                return false;
            }

            // prevent long straight pieces of length 3
            if (size == 2 && (i==prevDir || rotateAboutFace(i)==prevDir)) {
                return false;
            }

            // examine an adjacent empty cell
            if (cell.next[i] && !cell.next[i].filled) {
                
                // only open if the cell to the left of it is filled
                if (cell.next[i].next[LEFT] && !cell.next[i].next[LEFT].filled) {
                }
                else {
                    return true;
                }
            }

            return false;
        };
        var getOpenCells = function(cell,prevDir,size) {
            var openCells = [];
            var numOpenCells = 0;
            for (i=0; i<4; i++) {
                if (isOpenCell(cell,i,prevDir,size)) {
                    openCells.push(i);
                    numOpenCells++;
                }
            }
            return { openCells: openCells, numOpenCells: numOpenCells };
        };
        var connectCell = function(cell,dir) {
            cell.connect[dir] = true;
            cell.next[dir].connect[rotateAboutFace(dir)] = true;
            if (cell.x == 0 && dir == RIGHT) {
                cell.connect[LEFT] = true;
            }
        };

        var gen = function() {
        
            var cell;      // cell at the center of growth (open cells are chosen around this cell)
            var newCell;   // most recent cell filled
            var firstCell; // the starting cell of the current group

            var openCells;    // list of open cells around the center cell
            var numOpenCells; // size of openCells

            var dir; // the most recent direction of growth relative to the center cell
            var i;   // loop control variable used for iterating directions

            var numFilled = 0;  // current count of total cells filled
            var numGroups;      // current count of cell groups created
            var size;           // current number of cells in the current group
            var probStopGrowingAtSize = [ // probability of stopping growth at sizes...
                    0,     // size 0
                    0,     // size 1
                    0.10,  // size 2
                    0.5,   // size 3
                    0.75,  // size 4
                    1];    // size 5

            // A single cell group of size 1 is allowed at each row at y=0 and y=rows-1,
            // so keep count of those created.
            var singleCount = {};
            singleCount[0] = singleCount[rows-1] = 0;
            var probTopAndBotSingleCellJoin = 0.35;

            // A count and limit of the number long pieces (i.e. an "L" of size 4 or "T" of size 5)
            var longPieces = 0;
            var maxLongPieces = 1;
            var probExtendAtSize2 = 1;
            var probExtendAtSize3or4 = 0.5;

            var fillCell = function(cell) {
                cell.filled = true;
                cell.no = numFilled++;
                cell.group = numGroups;
            };

            for (numGroups=0; ; numGroups++) {

                // find all the leftmost empty cells
                openCells = getLeftMostEmptyCells();

                // stop add pieces if there are no more empty cells.
                numOpenCells = openCells.length;
                if (numOpenCells == 0) {
                    break;
                }

                // choose the center cell to be a random open cell, and fill it.
                firstCell = cell = openCells[getRandomInt(0,numOpenCells-1)];
                fillCell(cell);

                // randomly allow one single-cell piece on the top or bottom of the map.
                if (cell.x < cols-1 && (cell.y in singleCount) && Math.random() <= probTopAndBotSingleCellJoin) {
                    if (singleCount[cell.y] == 0) {
                        cell.connect[cell.y == 0 ? UP : DOWN] = true;
                        singleCount[cell.y]++;
                        continue;
                    }
                }

                // number of cells in this contiguous group
                size = 1;

                if (cell.x == cols-1) {
                    // if the first cell is at the right edge, then don't grow it.
                    cell.connect[RIGHT] = true;
                    cell.isRaiseHeightCandidate = true;
                }
                else {
                    // only allow the piece to grow to 5 cells at most.
                    while (size < 5) {

                        var stop = false;

                        if (size == 2) {
                            // With a horizontal 2-cell group, try to turn it into a 4-cell "L" group.
                            // This is done here because this case cannot be reached when a piece has already grown to size 3.
                            var c = firstCell;
                            if (c.x > 0 && c.connect[RIGHT] && c.next[RIGHT] && c.next[RIGHT].next[RIGHT]) {
                                if (longPieces < maxLongPieces && Math.random() <= probExtendAtSize2) {

                                    c = c.next[RIGHT].next[RIGHT];
                                    var dirs = {};
                                    if (isOpenCell(c,UP)) {
                                        dirs[UP] = true;
                                    }
                                    if (isOpenCell(c,DOWN)) {
                                        dirs[DOWN] = true;
                                    }

                                    if (dirs[UP] && dirs[DOWN]) {
                                        i = [UP,DOWN][getRandomInt(0,1)];
                                    }
                                    else if (dirs[UP]) {
                                        i = UP;
                                    }
                                    else if (dirs[DOWN]) {
                                        i = DOWN;
                                    }
                                    else {
                                        i = undefined;
                                    }

                                    if (i != undefined) {
                                        connectCell(c,LEFT);
                                        fillCell(c);
                                        connectCell(c,i);
                                        fillCell(c.next[i]);
                                        longPieces++;
                                        size+=2;
                                        stop = true;
                                    }
                                }
                            }
                        }

                        if (!stop) {
                            // find available open adjacent cells.
                            var result = getOpenCells(cell,dir,size);
                            openCells = result['openCells'];
                            numOpenCells = result['numOpenCells'];

                            // if no open cells found from center point, then use the last cell as the new center
                            // but only do this if we are of length 2 to prevent numerous short pieces.
                            // then recalculate the open adjacent cells.
                            if (numOpenCells == 0 && size == 2) {
                                cell = newCell;
                                result = getOpenCells(cell,dir,size);
                                openCells = result['openCells'];
                                numOpenCells = result['numOpenCells'];
                            }

                            // no more adjacent cells, so stop growing this piece.
                            if (numOpenCells == 0) {
                                stop = true;
                            }
                            else {
                                // choose a random valid direction to grow.
                                dir = openCells[getRandomInt(0,numOpenCells-1)];
                                newCell = cell.next[dir];

                                // connect the cell to the new cell.
                                connectCell(cell,dir);

                                // fill the cell
                                fillCell(newCell);

                                // increase the size count of this piece.
                                size++;

                                // don't let center pieces grow past 3 cells
                                if (firstCell.x == 0 && size == 3) {
                                    stop = true;
                                }

                                // Use a probability to determine when to stop growing the piece.
                                if (Math.random() <= probStopGrowingAtSize[size]) {
                                    stop = true;
                                }
                            }
                        }

                        // Close the piece.
                        if (stop) {

                            if (size == 1) {
                                // This is provably impossible because this loop is never entered with size==1.
                            }
                            else if (size == 2) {

                                // With a vertical 2-cell group, attach to the right wall if adjacent.
                                var c = firstCell;
                                if (c.x == cols-1) {

                                    // select the top cell
                                    if (c.connect[UP]) {
                                        c = c.next[UP];
                                    }
                                    c.connect[RIGHT] = c.next[DOWN].connect[RIGHT] = true;
                                }
                                
                            }
                            else if (size == 3 || size == 4) {

                                // Try to extend group to have a long leg
                                if (longPieces < maxLongPieces && firstCell.x > 0 && Math.random() <= probExtendAtSize3or4) {
                                    var dirs = [];
                                    var dirsLength = 0;
                                    for (i=0; i<4; i++) {
                                        if (cell.connect[i] && isOpenCell(cell.next[i],i)) {
                                            dirs.push(i);
                                            dirsLength++;
                                        }
                                    }
                                    if (dirsLength > 0) {
                                        i = dirs[getRandomInt(0,dirsLength-1)];
                                        c = cell.next[i];
                                        connectCell(c,i);
                                        fillCell(c.next[i]);
                                        longPieces++;
                                    }
                                }
                            }

                            break;
                        }
                    }
                }
            }
            setResizeCandidates();
        };


        var setResizeCandidates = function() {
            var i;
            var c,q,c2,q2;
            var x,y;
            for (i=0; i<rows*cols; i++) {
                c = cells[i];
                x = i % cols;
                y = Math.floor(i/cols);

                // determine if it has flexible height

                //
                // |_|
                //
                // or
                //  _
                // | |
                //
                q = c.connect;
                if ((c.x == 0 || !q[LEFT]) &&
                    (c.x == cols-1 || !q[RIGHT]) &&
                    q[UP] != q[DOWN]) {
                    c.isRaiseHeightCandidate = true;
                }

                //  _ _
                // |_ _|
                //
                c2 = c.next[RIGHT];
                if (c2 != undefined) {
                    q2 = c2.connect;
                    if (((c.x == 0 || !q[LEFT]) && !q[UP] && !q[DOWN]) &&
                        ((c2.x == cols-1 || !q2[RIGHT]) && !q2[UP] && !q2[DOWN])
                        ) {
                        c.isRaiseHeightCandidate = c2.isRaiseHeightCandidate = true;
                    }
                }

                // determine if it has flexible width

                // if cell is on the right edge with an opening to the right
                if (c.x == cols-1 && q[RIGHT]) {
                    c.isShrinkWidthCandidate = true;
                }

                //  _
                // |_
                // 
                // or
                //  _
                //  _|
                //
                if ((c.y == 0 || !q[UP]) &&
                    (c.y == rows-1 || !q[DOWN]) &&
                    q[LEFT] != q[RIGHT]) {
                    c.isShrinkWidthCandidate = true;
                }

            }
        };

        // Identify if a cell is the center of a cross.
        var cellIsCrossCenter = function(c) {
            return c.connect[UP] && c.connect[RIGHT] && c.connect[DOWN] && c.connect[LEFT];
        };

        var chooseNarrowCols = function() {

            var canShrinkWidth = function(x,y) {

                // Can cause no more tight turns.
                if (y==rows-1) {
                    return true;
                }

                // get the right-hand-side bound
                var x0;
                var c,c2;
                for (x0=x; x0<cols; x0++) {
                    c = cells[x0+y*cols];
                    c2 = c.next[DOWN]
                    if ((!c.connect[RIGHT] || cellIsCrossCenter(c)) &&
                        (!c2.connect[RIGHT] || cellIsCrossCenter(c2))) {
                        break;
                    }
                }

                // build candidate list
                var candidates = [];
                var numCandidates = 0;
                for (; c2; c2=c2.next[LEFT]) {
                    if (c2.isShrinkWidthCandidate) {
                        candidates.push(c2);
                        numCandidates++;
                    }

                    // cannot proceed further without causing irreconcilable tight turns
                    if ((!c2.connect[LEFT] || cellIsCrossCenter(c2)) &&
                        (!c2.next[UP].connect[LEFT] || cellIsCrossCenter(c2.next[UP]))) {
                        break;
                    }
                }
                shuffle(candidates);

                var i;
                for (i=0; i<numCandidates; i++) {
                    c2 = candidates[i];
                    if (canShrinkWidth(c2.x,c2.y)) {
                        c2.shrinkWidth = true;
                        narrowCols[c2.y] = c2.x;
                        return true;
                    }
                }

                return false;
            };

            var x;
            var c;
            for (x=cols-1; x>=0; x--) {
                c = cells[x];
                if (c.isShrinkWidthCandidate && canShrinkWidth(x,0)) {
                    c.shrinkWidth = true;
                    narrowCols[c.y] = c.x;
                    return true;
                }
            }

            return false;
        };

        var chooseTallRows = function() {

            var canRaiseHeight = function(x,y) {

                // Can cause no more tight turns.
                if (x==cols-1) {
                    return true;
                }

                // find the first cell below that will create too tight a turn on the right
                var y0;
                var c;
                var c2;
                for (y0=y; y0>=0; y0--) {
                    c = cells[x+y0*cols];
                    c2 = c.next[RIGHT]
                    if ((!c.connect[UP] || cellIsCrossCenter(c)) && 
                        (!c2.connect[UP] || cellIsCrossCenter(c2))) {
                        break;
                    }
                }

                // Proceed from the right cell upwards, looking for a cell that can be raised.
                var candidates = [];
                var numCandidates = 0;
                for (; c2; c2=c2.next[DOWN]) {
                    if (c2.isRaiseHeightCandidate) {
                        candidates.push(c2);
                        numCandidates++;
                    }

                    // cannot proceed further without causing irreconcilable tight turns
                    if ((!c2.connect[DOWN] || cellIsCrossCenter(c2)) &&
                        (!c2.next[LEFT].connect[DOWN] || cellIsCrossCenter(c2.next[LEFT]))) {
                        break;
                    }
                }
                shuffle(candidates);

                var i;
                for (i=0; i<numCandidates; i++) {
                    c2 = candidates[i];
                    if (canRaiseHeight(c2.x,c2.y)) {
                        c2.raiseHeight = true;
                        tallRows[c2.x] = c2.y;
                        return true;
                    }
                }

                return false;
            };

            // From the top left, examine cells below until hitting top of ghost house.
            // A raisable cell must be found before the ghost house.
            var y;
            var c;
            for (y=0; y<3; y++) {
                c = cells[y*cols];
                if (c.isRaiseHeightCandidate && canRaiseHeight(0,y)) {
                    c.raiseHeight = true;
                    tallRows[c.x] = c.y;
                    return true;
                }
            }

            return false;
        };

        // This is a function to detect impurities in the map that have no heuristic implemented to avoid it yet in gen().
        var isDesirable = function() {

            // ensure a solid top right corner
            var c = cells[4];
            if (c.connect[UP] || c.connect[RIGHT]) {
                return false;
            }

            // ensure a solid bottom right corner
            c = cells[rows*cols-1];
            if (c.connect[DOWN] || c.connect[RIGHT]) {
                return false;
            }

            // ensure there are no two stacked/side-by-side 2-cell pieces.
            var isHori = function(x,y) {
                var q1 = cells[x+y*cols].connect;
                var q2 = cells[x+1+y*cols].connect;
                return !q1[UP] && !q1[DOWN] && (x==0 || !q1[LEFT]) && q1[RIGHT] && 
                       !q2[UP] && !q2[DOWN] && q2[LEFT] && !q2[RIGHT];
            };
            var isVert = function(x,y) {
                var q1 = cells[x+y*cols].connect;
                var q2 = cells[x+(y+1)*cols].connect;
                if (x==cols-1) {
                    // special case (we can consider two single cells as vertical at the right edge)
                    return !q1[LEFT] && !q1[UP] && !q1[DOWN] &&
                           !q2[LEFT] && !q2[UP] && !q2[DOWN];
                }
                return !q1[LEFT] && !q1[RIGHT] && !q1[UP] && q1[DOWN] && 
                       !q2[LEFT] && !q2[RIGHT] && q2[UP] && !q2[DOWN];
            };
            var x,y;
            var g;
            for (y=0; y<rows-1; y++) {
                for (x=0; x<cols-1; x++) {
                    if (isHori(x,y) && isHori(x,y+1) ||
                        isVert(x,y) && isVert(x+1,y)) {

                        // don't allow them in the middle because they'll be two large when reflected.
                        if (x==0) {
                            return false;
                        }

                        // Join the four cells to create a square.
                        cells[x+y*cols].connect[DOWN] = true;
                        cells[x+y*cols].connect[RIGHT] = true;
                        g = cells[x+y*cols].group;

                        cells[x+1+y*cols].connect[DOWN] = true;
                        cells[x+1+y*cols].connect[LEFT] = true;
                        cells[x+1+y*cols].group = g;

                        cells[x+(y+1)*cols].connect[UP] = true;
                        cells[x+(y+1)*cols].connect[RIGHT] = true;
                        cells[x+(y+1)*cols].group = g;

                        cells[x+1+(y+1)*cols].connect[UP] = true;
                        cells[x+1+(y+1)*cols].connect[LEFT] = true;
                        cells[x+1+(y+1)*cols].group = g;
                    }
                }
            }

            if (!chooseTallRows()) {
                return false;
            }

            if (!chooseNarrowCols()) {
                return false;
            }

            return true;
        };

        // set the final position and size of each cell when upscaling the simple model to actual size
        var setUpScaleCoords = function() {
            var i,c;
            for (i=0; i<rows*cols; i++) {
                c = cells[i];
                c.final_x = c.x*3;
                if (narrowCols[c.y] < c.x) {
                    c.final_x--;
                }
                c.final_y = c.y*3;
                if (tallRows[c.x] < c.y) {
                    c.final_y++;
                }
                c.final_w = c.shrinkWidth ? 2 : 3;
                c.final_h = c.raiseHeight ? 4 : 3;
            }
        };

        var reassignGroup = function(oldg,newg) {
            var i;
            var c;
            for (i=0; i<rows*cols; i++) {
                c = cells[i];
                if (c.group == oldg) {
                    c.group = newg;
                }
            }
        };

        var createTunnels = function() {

            // declare candidates
            var singleDeadEndCells = [];
            var topSingleDeadEndCells = [];
            var botSingleDeadEndCells = [];

            var voidTunnelCells = [];
            var topVoidTunnelCells = [];
            var botVoidTunnelCells = [];

            var edgeTunnelCells = [];
            var topEdgeTunnelCells = [];
            var botEdgeTunnelCells = [];

            var doubleDeadEndCells = [];

            var numTunnelsCreated = 0;

            // prepare candidates
            var y;
            var c;
            var upDead;
            var downDead;
            for (y=0; y<rows; y++) {
                c = cells[cols-1+y*cols];
                if (c.connect[UP]) {
                    continue;
                }
                if (c.y > 1 && c.y < rows-2) {
                    c.isEdgeTunnelCandidate = true;
                    edgeTunnelCells.push(c);
                    if (c.y <= 2) {
                        topEdgeTunnelCells.push(c);
                    }
                    else if (c.y >= 5) {
                        botEdgeTunnelCells.push(c);
                    }
                }
                upDead = (!c.next[UP] || c.next[UP].connect[RIGHT]);
                downDead = (!c.next[DOWN] || c.next[DOWN].connect[RIGHT]);
                if (c.connect[RIGHT]) {
                    if (upDead) {
                        c.isVoidTunnelCandidate = true;
                        voidTunnelCells.push(c);
                        if (c.y <= 2) {
                            topVoidTunnelCells.push(c);
                        }
                        else if (c.y >= 6) {
                            botVoidTunnelCells.push(c);
                        }
                    }
                }
                else {
                    if (c.connect[DOWN]) {
                        continue;
                    }
                    if (upDead != downDead) {
                        if (!c.raiseHeight && y < rows-1 && !c.next[LEFT].connect[LEFT]) {
                            singleDeadEndCells.push(c);
                            c.isSingleDeadEndCandidate = true;
                            c.singleDeadEndDir = upDead ? UP : DOWN;
                            var offset = upDead ? 1 : 0;
                            if (c.y <= 1+offset) {
                                topSingleDeadEndCells.push(c);
                            }
                            else if (c.y >= 5+offset) {
                                botSingleDeadEndCells.push(c);
                            }
                        }
                    }
                    else if (upDead && downDead) {
                        if (y > 0 && y < rows-1) {
                            if (c.next[LEFT].connect[UP] && c.next[LEFT].connect[DOWN]) {
                                c.isDoubleDeadEndCandidate = true;
                                if (c.y >= 2 && c.y <= 5) {
                                    doubleDeadEndCells.push(c);
                                }
                            }
                        }
                    }
                }
            }

            // choose tunnels from candidates
            var numTunnelsDesired = Math.random() <= 0.45 ? 2 : 1;
            var c;
            var selectSingleDeadEnd = function(c) {
                c.connect[RIGHT] = true;
                if (c.singleDeadEndDir == UP) {
                    c.topTunnel = true;
                }
                else {
                    c.next[DOWN].topTunnel = true;
                }
            };
            if (numTunnelsDesired == 1) {
                if (c = randomElement(voidTunnelCells)) {
                    c.topTunnel = true;
                }
                else if (c = randomElement(singleDeadEndCells)) {
                    selectSingleDeadEnd(c);
                }
                else if (c = randomElement(edgeTunnelCells)) {
                    c.topTunnel = true;
                }
                else {
                    return false;
                }
            }
            else if (numTunnelsDesired == 2) {
                if (c = randomElement(doubleDeadEndCells)) {
                    c.connect[RIGHT] = true;
                    c.topTunnel = true;
                    c.next[DOWN].topTunnel = true;
                }
                else {
                    numTunnelsCreated = 1;
                    if (c = randomElement(topVoidTunnelCells)) {
                        c.topTunnel = true;
                    }
                    else if (c = randomElement(topSingleDeadEndCells)) {
                        selectSingleDeadEnd(c);
                    }
                    else if (c = randomElement(topEdgeTunnelCells)) {
                        c.topTunnel = true;
                    }
                    else {
                        // could not find a top tunnel opening
                        numTunnelsCreated = 0;
                    }

                    if (c = randomElement(botVoidTunnelCells)) {
                        c.topTunnel = true;
                    }
                    else if (c = randomElement(botSingleDeadEndCells)) {
                        selectSingleDeadEnd(c);
                    }
                    else if (c = randomElement(botEdgeTunnelCells)) {
                        c.topTunnel = true;
                    }
                    else {
                        // could not find a bottom tunnel opening
                        if (numTunnelsCreated == 0) {
                            return false;
                        }
                    }
                }
            }

            // don't allow a horizontal path to cut straight through a map (through tunnels)
            var exit,topy;
            for (y=0; y<rows; y++) {
                c = cells[cols-1+y*cols];
                if (c.topTunnel) {
                    exit = true;
                    topy = c.final_y;
                    while (c.next[LEFT]) {
                        c = c.next[LEFT];
                        if (!c.connect[UP] && c.final_y == topy) {
                            continue;
                        }
                        else {
                            exit = false;
                            break;
                        }
                    }
                    if (exit) {
                        return false;
                    }
                }
            }

            // clear unused void tunnels (dead ends)
            var len = voidTunnelCells.length;
            var i;

            var replaceGroup = function(oldg,newg) {
                var i,c;
                for (i=0; i<rows*cols; i++) {
                    c = cells[i];
                    if (c.group == oldg) {
                        c.group = newg;
                    }
                }
            };
            for (i=0; i<len; i++) {
                c = voidTunnelCells[i];
                if (!c.topTunnel) {
                    replaceGroup(c.group, c.next[UP].group);
                    c.connect[UP] = true;
                    c.next[UP].connect[DOWN] = true;
                }
            }

            return true;
        };

        var joinWalls = function() {

            // randomly join wall pieces to the boundary to increase difficulty

            var x,y;
            var c;

            // join cells to the top boundary
            for (x=0; x<cols; x++) {
                c = cells[x];
                if (!c.connect[LEFT] && !c.connect[RIGHT] && !c.connect[UP] &&
                    (!c.connect[DOWN] || !c.next[DOWN].connect[DOWN])) {

                    // ensure it will not create a dead-end
                    if ((!c.next[LEFT] || !c.next[LEFT].connect[UP]) &&
                        (c.next[RIGHT] && !c.next[RIGHT].connect[UP])) {

                        // prevent connecting very large piece
                        if (!(c.next[DOWN] && c.next[DOWN].connect[RIGHT] && c.next[DOWN].next[RIGHT].connect[RIGHT])) {
                            c.isJoinCandidate = true;
                            if (Math.random() <= 0.25) {
                                c.connect[UP] = true;
                            }
                        }
                    }
                }
            }

            // join cells to the bottom boundary
            for (x=0; x<cols; x++) {
                c = cells[x+(rows-1)*cols];
                if (!c.connect[LEFT] && !c.connect[RIGHT] && !c.connect[DOWN] &&
                    (!c.connect[UP] || !c.next[UP].connect[UP])) {

                    // ensure it will not creat a dead-end
                    if ((!c.next[LEFT] || !c.next[LEFT].connect[DOWN]) &&
                        (c.next[RIGHT] && !c.next[RIGHT].connect[DOWN])) {

                        // prevent connecting very large piece
                        if (!(c.next[UP] && c.next[UP].connect[RIGHT] && c.next[UP].next[RIGHT].connect[RIGHT])) {
                            c.isJoinCandidate = true;
                            if (Math.random() <= 0.25) {
                                c.connect[DOWN] = true;
                            }
                        }
                    }
                }
            }

            // join cells to the right boundary
            var c2;
            for (y=1; y<rows-1; y++) {
                c = cells[cols-1+y*cols];
                if (!c.connect[UP] && !c.connect[DOWN] && !c.connect[RIGHT] &&
                    (!c.connect[LEFT] || !c.next[LEFT].connect[LEFT])) {

                    // ensure it will not create a dead-end
                    if ((!c.next[UP] || !c.next[UP].connect[RIGHT]) &&
                        (c.next[DOWN] && !c.next[DOWN].connect[RIGHT])) {

                        c.isJoinCandidate = true;
                        if (Math.random() <= 0.25) {
                            c.connect[RIGHT] = true;
                        }
                    }
                }
            }
        };

        var countGroups = function() {
            var numGroups = 0;
            var groups = {};
            var i,c;
            for (i=0; i<rows*cols; i++) {
                c = cells[i];
                if (c.group && !(c.group in groups)) {
                    groups[c.group] = true;
                    numGroups++;
                }
            }
            return numGroups;
        };

        var isConnected = function() {
            var q = [];
            var visited = {};
            var count = 0;
            var i,c,n;

            // find first filled cell
            for (i=0; i<rows*cols; i++) {
                c = cells[i];
                if (c.filled) {
                    q.push(c);
                    visited[i] = true;
                    count++;
                    break;
                }
            }

            // flood fill
            while (q.length > 0) {
                c = q.shift();
                for (i=0; i<4; i++) {
                    if (c.connect[i]) {
                        n = c.next[i];
                        if (n && n.filled && !visited[n.x+n.y*cols]) {
                            visited[n.x+n.y*cols] = true;
                            q.push(n);
                            count++;
                        }
                    }
                }
            }

            // count all filled cells
            var total = 0;
            for (i=0; i<rows*cols; i++) {
                if (cells[i].filled) {
                    total++;
                }
            }

            return count == total;
        };

        var count = 0;
        while(true) {
            count++;
            reset();
            gen();
            if (isDesirable() && createTunnels() && isConnected()) {
                setUpScaleCoords();
                joinWalls();
                break;
            }
        }
    };

    var toAscii = function() {

        var text = [];
        var i;
        for (i=0; i<28*31; i++) {
            text.push(' ');
        }

        var drawWall = function(x,y) {
            text[x+y*28] = '|';
        };
        var drawFloor = function(x,y) {
            text[x+y*28] = ' ';
        };
        var drawPellet = function(x,y) {
            text[x+y*28] = '.';
        };

        var x,y;
        var i,c;
        var j,k;
        var x0,y0,w,h;

        // draw wall or floor
        for (i=0; i<rows*cols; i++) {
            c = cells[i];
            if (c.filled) {
                x0 = c.final_x;
                y0 = c.final_y;
                w = c.final_w;
                h = c.final_h;
                for (j=0; j<w; j++) {
                    for (k=0; k<h; k++) {
                        drawWall(x0+j,y0+k);
                        drawWall(27-(x0+j),y0+k);
                    }
                }
            }
        }

        // draw ghost home
        for (x=10; x<=17; x++) {
            drawWall(x,13);
            drawWall(x,17);
        }
        for (y=14; y<=16; y++) {
            drawWall(10,y);
            drawWall(17,y);
        }
        for (x=11; x<=16; x++) {
            for (y=14; y<=16; y++) {
                drawFloor(x,y);
            }
        }
        drawWall(13,12);
        drawWall(14,12);
        drawFloor(13,13);
        drawFloor(14,13);

        // draw tunnels
        for (i=0; i<rows*cols; i++) {
            c = cells[i];
            if (c.topTunnel) {
                y = c.final_y;
                for (x=0; x<c.final_x; x++) {
                    drawFloor(x,y);
                    drawFloor(27-x,y);
                }
                drawFloor(c.final_x,y);
                drawFloor(27-c.final_x,y);
            }
        }

        // draw pellets
        for (x=0; x<14; x++) {
            for (y=0; y<31; y++) {
                if (text[x+y*28] == ' ') {
                    drawPellet(x,y);
                    drawPellet(27-x,y);
                }
            }
        }

        // remove pellets from ghost home
        for (x=11; x<=16; x++) {
            for (y=14; y<=16; y++) {
                text[x+y*28] = ' ';
            }
        }

        // remove pellets from pacman start
        text[13+26*28] = ' ';
        text[14+26*28] = ' ';

        return text.join('');
    };

    return {
        'genRandom': genRandom,
        'toAscii': toAscii,
    };
})();
//@line 1 "src/Actor.js"
//////////////////////////////////////////////////////////////////////////////////////
// Actor
// (a character in the game, stored in a list of actors)

// actor enums
var PACMAN = 0;
var BLINKY = 1; // red
var PINKY = 2;  // pink
var INKY = 3;   // cyan
var CLYDE = 4;  // orange

// actor constructor
// id is one of the actor enums
var Actor = function(id) {

    // add members
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.pixel = {x:0, y:0};
    this.tile = {x:0, y:0};
    this.distToMid = {x:0, y:0};
    this.tilePixel = {x:0, y:0};
    this.dir = {};
    this.dirEnum = DIR_UP;
    this.targetTile = {x:0, y:0};
    this.anim = {};
    this.isDrawPath = false;
    this.isDrawTarget = false;
    this.isStuck = false;
    this.elroy = 0; // 0=not elroy, 1=elroy1, 2=elroy2
    this.isCruiseElroy = function() { return this.elroy > 0; };

    // add functions
    this.onEnterTile = function(){};
    this.onNewLevel = function(){};
    this.onDeath = function(){};
    this.onNewGame = function(){};
    this.onDraw = function(){};
    this.onUpdate = function(){};

    this.save = function(t) {
        this.savedPixel[t] = {x:this.pixel.x, y:this.pixel.y};
        this.savedDirEnum[t] = this.dirEnum;
        this.savedTargetTile[t] = {x:this.targetTile.x, y:this.targetTile.y};
        this.savedState[t] = this.state;
        this.savedElroy[t] = this.elroy;
    };

    this.load = function(t) {
        this.pixel.x = this.savedPixel[t].x;
        this.pixel.y = this.savedPixel[t].y;
        this.dirEnum = this.savedDirEnum[t];
        this.targetTile.x = this.savedTargetTile[t].x;
        this.targetTile.y = this.savedTargetTile[t].y;
        this.state = this.savedState[t];
        this.elroy = this.savedElroy[t];
        this.update(0);
    };

    this.eraseFuture = function(t) {
        var i;
        for (i in this.savedPixel) if (i >= t) {
            delete this.savedPixel[i];
            delete this.savedDirEnum[i];
            delete this.savedTargetTile[i];
            delete this.savedState[i];
            delete this.savedElroy[i];
        }
    };

    this.resetSaved = function() {
        this.savedPixel = {};
        this.savedDirEnum = {};
        this.savedTargetTile = {};
        this.savedState = {};
        this.savedElroy = {};
    };

    // update actor's position and state
    this.update = function(dt) {

        var i;

        // update pixel position
        this.pixel.x += this.vel*this.dir.x;
        this.pixel.y += this.vel*this.dir.y;

        // teleport if necessary
        map.teleport(this);

        // update tile position
        this.tile.x = Math.floor(this.pixel.x / tileSize);
        this.tile.y = Math.floor(this.pixel.y / tileSize);

        // distance to middle of the tile
        this.tilePixel.x = this.tile.x*tileSize+midTile.x;
        this.tilePixel.y = this.tile.y*tileSize+midTile.y;
        this.distToMid.x = this.pixel.x - this.tilePixel.x;
        this.distToMid.y = this.pixel.y - this.tilePixel.y;

        // update direction vector
        setDirFromEnum(this.dir,this.dirEnum);

        // update animation
        if (this.anim.update)
            this.anim.update(dt);

        // update state
        this.onUpdate();
    };

    // draw actor
    this.draw = function(ctx) {

        // draw path
        if (this.isDrawPath) {
            var i;
            var old_x = this.pixel.x;
            var old_y = this.pixel.y;
            var old_dirEnum = this.dirEnum;
            var old_targetTile = {x:this.targetTile.x, y:this.targetTile.y};
            var old_state = this.state;
            var old_onEnterTile = this.onEnterTile;
            this.onEnterTile = function() {
                this.onEnterTileGhost();
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(this.tile.x*tileSize,this.tile.y*tileSize,tileSize,tileSize);
            };
            for (i=0; i<200; i++) {
                this.update(0);
            }
            this.pixel.x = old_x;
            this.pixel.y = old_y;
            this.dirEnum = old_dirEnum;
            this.targetTile.x = old_targetTile.x;
            this.targetTile.y = old_targetTile.y;
            this.state = old_state;
            this.onEnterTile = old_onEnterTile;
            this.update(0);
        }

        // draw target tile
        if (this.isDrawTarget) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.targetTile.x*tileSize, this.targetTile.y*tileSize, tileSize, tileSize);
        }

        // draw self
        this.onDraw(ctx);
    };
};
//@line 1 "src/actors.js"
//////////////////////////////////////////////////////////////////////////////////////
// Actors
// (a list of all actors in the game)

var actors = [];
var pacman;
var blinky,pinky,inky,clyde;

var createActors = function() {
    var i;
    for (i=0; i<5; i++)
        actors[i] = new Actor(i);
};

var initActors = function() {

    // get actors
    pacman = actors[PACMAN];
    blinky = actors[BLINKY];
    pinky = actors[PINKY];
    inky = actors[INKY];
    clyde = actors[CLYDE];

    // add common ghost functions
    var i;
    for (i=1; i<5; i++) {
        actors[i].onEnterTile = function() { this.onEnterTileGhost(); };
        actors[i].onNewLevel = function() { this.onNewLevelGhost(); };
        actors[i].onDeath = function() { this.onDeathGhost(); };
        actors[i].onNewGame = function() { this.onNewGameGhost(); };
        actors[i].onDraw = function(ctx) { this.onDrawGhost(ctx); };
        actors[i].onUpdate = function() { this.onUpdateGhost(); };
    }

    //================================================================================
    // PAC-MAN
    //================================================================================
    (function(actor){

        actor.color = "yellow";
        actor.startPixel = {x:112, y:212};
        actor.startDirEnum = DIR_LEFT;
        actor.anim = atlas.animPacman;
        actor.speed = 1.25;
        actor.invincible = false;
        actor.ai = false;

        var onNewGame = actor.onNewGame;
        actor.onNewGame = function() {
            onNewGame.call(this);
            this.onNewLevel();
        };

        var onNewLevel = actor.onNewLevel;
        actor.onNewLevel = function() {
            onNewLevel.call(this);

            // reset variables
            this.pixel.x = this.startPixel.x;
            this.pixel.y = this.startPixel.y;
            this.dirEnum = this.startDirEnum;
            this.desireDirEnum = this.startDirEnum;
            this.inviTimer = 0;
            this.inviLen = 6;
            this.stopped = false;
            this.timeStopped = 0;
            this.timeSinceLastShot = 1000;
            this.update(0);
            this.anim.set(this.dirEnum);
            this.resetSaved();
        };

        var onUpdate = actor.onUpdate;
        actor.onUpdate = function() {
            onUpdate.call(this);

            // update invincibility timer
            if (this.inviTimer > 0)
                this.inviTimer -= 1/60;

            // update speed
            this.vel = this.speed;
            if (this.state == 1)
                this.vel *= 0.9;
            else if (this.state == 0)
                this.vel *= 0.8;

            // check for collisions with pellets
            if (this.tile.x == 13 && (this.tile.y == 25 || this.tile.y == 26)) {
            }
            if (this.distToMid.x == 0 && this.distToMid.y == 0) {
                var tile = map.getTile(this.tile.x, this.tile.y);
                if (tile == '.' || tile == 'o') {
                    if (tile == 'o') {
                        this.onEatEnergizer();
                    }
                    else {
                        this.onEatPill();
                    }
                    map.onDotEat(this.tile.x, this.tile.y);
                }
            }

            // check for collisions with ghosts
            var i;
            for (i=1; i<5; i++) {
                if (this.tile.x == actors[i].tile.x && this.tile.y == actors[i].tile.y) {
                    if (actors[i].state == 2) { // ghost is frightened
                        actors[i].onEaten();
                        this.onEatGhost();
                    }
                    else if (actors[i].state != 3) { // ghost is not eaten
                        this.onDeath();
                    }
                }
            }

            // update direction
            this.onEnterTile();
        };

        actor.onEnterTile = function() {

            // check if we can make a turn
            var openTiles = getOpenTiles(this.tile, this.dirEnum);
            if (openTiles[this.desireDirEnum]) {
                this.dirEnum = this.desireDirEnum;
            }

            // check if we are at a dead-end
            openTiles = getOpenTiles(this.tile, this.dirEnum);
            if (!openTiles[this.dirEnum]) {
                this.stopped = true;
            }
            else {
                this.stopped = false;
                this.timeStopped = 0;
            }

            // update animation
            this.anim.set(this.dirEnum);
        };

        actor.onDraw = function(ctx) {
            var p = this.pixel;
            var a = this.anim;
            if (this.state == 2) { // dead
                if (a.name == "death") {
                    a.draw(ctx, p.x-a.w/2, p.y-a.h/2);
                }
            }
            else {
                if (this.inviTimer > 0 && Math.floor(this.inviTimer*5)%2 == 0) {
                    // flicker when invincible
                }
                else {
                    if (this.stopped)
                        a.drawFrame(ctx, 0, p.x-a.w/2, p.y-a.h/2);
                    else
                        a.draw(ctx, p.x-a.w/2, p.y-a.h/2);
                }
            }
        };

        actor.onDeath = function() {
            if (this.invincible)
                return;
            audio.die.play();
            state.setState('death');
        };

        actor.onEatPill = function() {
            addScore(10);
            audio.eating.startLoop();
        };

        actor.onEatEnergizer = function() {
            addScore(50);
            audio.eating.stopLoop();
            this.inviTimer = this.inviLen;
            var i;
            for (i=1; i<5; i++)
                actors[i].onPacmanEatEnergizer();
        };

        actor.onEatGhost = function() {
            audio.eatingGhost.play();
            addScore(200);
        };

    })(actors[PACMAN]);

    //================================================================================
    // GHOSTS
    //================================================================================
    (function(){

        var i;
        for (i=1; i<5; i++) {
            var actor = actors[i];
            actor.startPixel = {x:0, y:0};
            actor.startDirEnum = DIR_UP;
            actor.scaredColor = "blue";
            actor.scaredDrawFunc = atlas.drawScaredGhostSprite;
            actor.eatenDrawFunc = atlas.drawEatenGhostSprite;
            actor.speed = 1.25;
            actor.state = 0; // 0=scatter, 1=chase, 2=scared, 3=eaten
            actor.mode = 0; // 0=normal, 1=tunnel
            actor.inPen = false;
            actor.scaredTimer = 0;
            actor.scaredLen = 8; // seconds
        }

        //--------------------------------------------------------------------------------
        // BLINKY (red)
        //--------------------------------------------------------------------------------
        (function(actor){
            actor.color = "red";
            actor.startPixel = {x:112, y:116};
            actor.scatterTarget = {x:25, y:0};
            actor.penTile = {x:13, y:14};
            actor.exitPenDirEnum = DIR_UP;

            var onNewGameGhost = actor.onNewGameGhost;
            actor.onNewGameGhost = function() {
                onNewGameGhost.call(this);
                this.onNewLevelGhost();
            };

            var onNewLevelGhost = actor.onNewLevelGhost;
            actor.onNewLevelGhost = function() {
                onNewLevelGhost.call(this);
                this.elroy = 0;
            };

            var onUpdateGhost = actor.onUpdateGhost;
            actor.onUpdateGhost = function() {
                onUpdateGhost.call(this);

                // update elroy status
                if (this.elroy == 0 && map.dotsLeft() < 20)
                    this.elroy = 1;
                else if (this.elroy == 1 && map.dotsLeft() < 10)
                    this.elroy = 2;

                // update target tile
                if (this.state == 0) // scatter
                    this.targetTile = this.scatterTarget;
                else if (this.state == 1) // chase
                    this.targetTile = pacman.tile;
            };

        })(actors[BLINKY]);

        //--------------------------------------------------------------------------------
        // PINKY (pink)
        //--------------------------------------------------------------------------------
        (function(actor){
            actor.color = "pink";
            actor.startPixel = {x:112, y:140};
            actor.scatterTarget = {x:2, y:0};
            actor.penTile = {x:13, y:17};
            actor.exitPenDirEnum = DIR_UP;

            var onUpdateGhost = actor.onUpdateGhost;
            actor.onUpdateGhost = function() {
                onUpdateGhost.call(this);

                // update target tile
                if (this.state == 0) // scatter
                    this.targetTile = this.scatterTarget;
                else if (this.state == 1) { // chase
                    this.targetTile.x = pacman.tile.x + 4*pacman.dir.x;
                    this.targetTile.y = pacman.tile.y + 4*pacman.dir.y;
                    if (pacman.dirEnum == DIR_UP)
                        this.targetTile.x -= 4;
                }
            };
        })(actors[PINKY]);

        //--------------------------------------------------------------------------------
        // INKY (cyan)
        //--------------------------------------------------------------------------------
        (function(actor){
            actor.color = "cyan";
            actor.startPixel = {x:96, y:140};
            actor.scatterTarget = {x:27, y:35};
            actor.penTile = {x:11, y:17};
            actor.exitPenDirEnum = DIR_UP;

            var onUpdateGhost = actor.onUpdateGhost;
            actor.onUpdateGhost = function() {
                onUpdateGhost.call(this);

                // update target tile
                if (this.state == 0) // scatter
                    this.targetTile = this.scatterTarget;
                else if (this.state == 1) { // chase
                    this.targetTile.x = 2*(pacman.tile.x + 2*pacman.dir.x) - blinky.tile.x;
                    this.targetTile.y = 2*(pacman.tile.y + 2*pacman.dir.y) - blinky.tile.y;
                }
            };
        })(actors[INKY]);

        //--------------------------------------------------------------------------------
        // CLYDE (orange)
        //--------------------------------------------------------------------------------
        (function(actor){
            actor.color = "orange";
            actor.startPixel = {x:128, y:140};
            actor.scatterTarget = {x:0, y:35};
            actor.penTile = {x:15, y:17};
            actor.exitPenDirEnum = DIR_UP;

            var onUpdateGhost = actor.onUpdateGhost;
            actor.onUpdateGhost = function() {
                onUpdateGhost.call(this);

                // update target tile
                if (this.state == 0) // scatter
                    this.targetTile = this.scatterTarget;
                else if (this.state == 1) { // chase
                    var dx = this.tile.x - pacman.tile.x;
                    var dy = this.tile.y - pacman.tile.y;
                    var dist = dx*dx+dy*dy;
                    if (dist > 64)
                        this.targetTile = pacman.tile;
                    else
                        this.targetTile = this.scatterTarget;
                }
            };
        })(actors[CLYDE]);

        //--------------------------------------------------------------------------------
        // GHOST (common)
        //--------------------------------------------------------------------------------
        for (i=1; i<5; i++) (function(actor){

            actor.onNewGameGhost = function() {
            };

            actor.onNewLevelGhost = function() {
                this.pixel.x = this.startPixel.x;
                this.pixel.y = this.startPixel.y;
                this.dirEnum = this.startDirEnum;
                this.state = 0;
                this.mode = 0;
                this.scaredTimer = 0;
                this.inPen = true;
                this.update(0);
                this.resetSaved();
            };

            actor.onDeathGhost = function() {
            };

            actor.onUpdateGhost = function() {

                // update speed
                this.vel = this.speed;
                if (this.state == 2) // scared
                    this.vel *= 0.5;
                else if (this.state == 3) // eaten
                    this.vel *= 2;
                else if (this.mode == 1) // tunnel
                    this.vel *= 0.4;
                else if (this.isCruiseElroy())
                    this.vel *= 1.1;

                // update scared timer
                if (this.scaredTimer > 0) {
                    this.scaredTimer -= 1/60;
                    if (this.scaredTimer <= 0)
                        this.state = 1;
                }

                // if in pen, try to exit
                if (this.inPen) {
                    if (this.pixel.x == 112 && this.pixel.y == 116) {
                        this.dirEnum = this.exitPenDirEnum;
                        this.inPen = false;
                    }
                    else {
                        if (this.pixel.y > 132 && this.pixel.y < 134)
                            this.pixel.y = 133;
                        if (this.pixel.y == 133) {
                            if (this.pixel.x > 112) this.pixel.x--;
                            else if (this.pixel.x < 112) this.pixel.x++;
                            else this.pixel.y--;
                        }
                        else {
                            if (this.pixel.y > 133) this.pixel.y--;
                            else this.pixel.y++;
                        }
                    }
                }
                else
                    this.onEnterTile();
            };

            actor.onEnterTileGhost = function() {

                // update mode
                if (map.isTunnelTile(this.tile.x, this.tile.y))
                    this.mode = 1;
                else
                    this.mode = 0;

                // if eaten, try to get to pen
                if (this.state == 3) {
                    if (this.tile.x == this.penTile.x && this.tile.y == this.penTile.y) {
                        this.inPen = true;
                        this.state = 0;
                    }
                    else {
                        this.targetTile = this.penTile;
                    }
                }

                // get available turns
                var openTiles = getOpenTiles(this.tile, this.dirEnum);

                // get desired turn
                if (this.state == 2) // scared
                    this.dirEnum = this.getTurnScared(openTiles);
                else
                    this.dirEnum = getTurnClosestToTarget(this.tile, this.targetTile, openTiles);
            };

            actor.onDrawGhost = function(ctx) {
                var p = this.pixel;
                var a = this.anim;
                if (this.state == 2) { // scared
                    if (this.scaredTimer < 3 && Math.floor(this.scaredTimer*5)%2==0)
                        atlas.drawScaredGhostSprite2(ctx, p.x-a.w/2, p.y-a.h/2);
                    else
                        atlas.drawScaredGhostSprite(ctx, p.x-a.w/2, p.y-a.h/2);
                }
                else if (this.state == 3) { // eaten
                    atlas.drawEatenGhostSprite(ctx, this.dirEnum, p.x-a.w/2, p.y-a.h/2);
                }
                else {
                    atlas.drawGhostSprite(ctx, this.id, this.dirEnum, p.x-a.w/2, p.y-a.h/2);
                }
            };

            actor.onPacmanEatEnergizer = function() {
                if (this.state != 3) { // if not eaten
                    audio.ghostTurnToBlue.play();
                    this.scaredTimer = this.scaredLen;
                    this.state = 2;
                    this.dirEnum = rotateAboutFace(this.dirEnum);
                }
            };

            actor.onEaten = function() {
                this.state = 3; // eaten
            };

            actor.getTurnScared = function(openTiles) {
                var turns = [];
                var n = 0;
                var i;
                for (i=0; i<4; i++)
                    if (openTiles[i]) {
                        turns.push(i);
                        n++;
                    }
                return turns[getRandomInt(0,n-1)];
            };

        })(actors[i]);
    }
    })();
};
//@line 1 "src/state.js"
//////////////////////////////////////////////////////////////////////////////////////
// State
// (a finite state machine)

var state = (function(){

    var current_state_name;
    var current_state;
    var state_is_running;

    var get = function() {
        return current_state;
    };

    var is = function(name) {
        return name == current_state_name;
    };

    var set = function(name, new_state) {
        
        // default new_state to an empty object
        if (!new_state)
            new_state = {};

        // add members
        new_state.timer = 0;
        new_state.name = name;

        // add functions
        if (!new_state.run) new_state.run = function(){};
        if (!new_state.onEnter) new_state.onEnter = function(){};
        if (!new_state.onExit) new_state.onExit = function(){};

        // exit old state
        if (current_state)
            current_state.onExit();

        // enter new state
        current_state_name = name;
        current_state = new_state;
        current_state.onEnter();
    };

    var run = function() {
        current_state.run();
    };

    return {
        'get': get,
        'is': is,
        'setState': set,
        'run': run,
    };
})();
//@line 1 "src/executive.js"
//////////////////////////////////////////////////////////////////////////////////////
// Executive
// (the main loop)

var executive = (function(){

    var req;
    var running = false;
    var updates_per_second = 60;
    var ms_per_update = 1000/updates_per_second;
    var lag = 0;
    var prev_tick;

    var run = function() {

        // get current time
        var curr_tick = new Date().getTime();
        if (!prev_tick)
            prev_tick = curr_tick;

        // update lag
        lag += curr_tick - prev_tick;
        prev_tick = curr_tick;

        // update game
        while (lag >= ms_per_update) {
            state.run();
            lag -= ms_per_update;
        }

        // draw screen
        renderer.refresh();

        // next frame
        if (running)
            req = requestAnimationFrame(run);
    };

    var start = function() {
        if (!running) {
            running = true;
            prev_tick = new Date().getTime();
            lag = 0;
            run();
        }
    };

    var stop = function() {
        if (running) {
            running = false;
            cancelAnimationFrame(req);
        }
    };

    var setUpdatesPerSecond = function(ups) {
        updates_per_second = ups;
        ms_per_update = 1000/updates_per_second;
    };

    return {
        'start':start,
        'stop':stop,
        'setUpdatesPerSecond':setUpdatesPerSecond,
    };
})();
//@line 1 "src/renderer.js"
//////////////////////////////////////////////////////////////////////////////////////
// Renderer
// (draws the screen)

var renderer = (function(){

    var el,ctx;
    var bg_el,bg_ctx;
    var pellets_el,pellets_ctx;
    var scale = 1;

    var init = function() {

        // get canvas context
        el = document.getElementById('canvas-container');
        ctx = document.createElement('canvas').getContext('2d');
        bg_el = document.createElement('canvas');
        bg_ctx = bg_el.getContext('2d');
        pellets_el = document.createElement('canvas');
        pellets_ctx = pellets_el.getContext('2d');
        el.appendChild(ctx.canvas);

        // disable image smoothing
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;

        // resize for the first time
        resize();
    };

    var resize = function() {

        // get map sizes
        var map_w = map.widthPixels;
        var map_h = map.heightPixels;

        // resize canvases
        ctx.canvas.width = map_w;
        ctx.canvas.height = map_h;
        bg_el.width = map_w;
        bg_el.height = map_h;
        pellets_el.width = map_w;
        pellets_el.height = map_h;

        // get scale
        var win_w = window.innerWidth;
        var win_h = window.innerHeight;
        scale = Math.min(win_w/map_w, win_h/map_h);

        // set scale
        el.style.width = map_w*scale + "px";
        el.style.height = map_h*scale + "px";

        // redraw everything
        drawMap();
    };

    var refresh = function() {

        // clear screen
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

        // draw background
        ctx.drawImage(bg_el,0,0);

        // draw pellets
        if (!map.isFlashing())
            ctx.drawImage(pellets_el,0,0);

        // draw actors
        var i;
        for (i=0; i<5; i++)
            actors[i].draw(ctx);

        // draw score
        drawScore();

        // draw ready
        if (state.is('start-level') || (state.is('game') && state.timer < 240)) {
            if (state.timer < 120)
                drawPlayer1();
            else
                drawReady();
        }
        else if (state.is('game-over')) {
            drawGameOver();
        }
    };

    var drawMap = function() {

        // clear background
        bg_ctx.fillStyle = "black";
        bg_ctx.fillRect(0,0,bg_el.width,bg_el.height);

        // draw walls
        bg_ctx.lineCap = "round";
        bg_ctx.strokeStyle = "blue";
        bg_ctx.lineWidth = 2;
        var i,j;
        var path,point;
        for (i=0; i<map.paths.length; i++) {
            path = map.paths[i];
            bg_ctx.beginPath();
            bg_ctx.moveTo(path[0].x, path[0].y);
            for (j=1; j<path.length; j++) {
                point = path[j];
                if (point.cx == undefined)
                    bg_ctx.lineTo(point.x, point.y);
                else
                    bg_ctx.quadraticCurveTo(point.cx, point.cy, point.x, point.y);
            }
            bg_ctx.stroke();
        }

        // draw lives
        var i;
        for (i=0; i<extraLives; i++)
            atlas.drawPacmanSprite(bg_ctx, 1, 20+i*16, 280);

        // draw fruit
        atlas.drawFruitSprite(bg_ctx, 0, 220, 280);

        // draw pellets
        refreshPellets();
    };

    var refreshPellets = function() {
        pellets_ctx.clearRect(0,0,pellets_el.width,pellets_el.height);
        var x,y;
        for (x=0; x<map.numCols; x++)
            for (y=0; y<map.numRows; y++)
                refreshPellet(x,y);
    };

    var refreshPellet = function(x,y) {
        var tile = map.getTile(x,y);
        if (tile == '.')
            drawPellet(x,y);
        else if (tile == 'o')
            drawEnergizer(x,y);
    };

    var erasePellet = function(x,y) {
        pellets_ctx.clearRect(x*tileSize, y*tileSize, tileSize, tileSize);
    };

    var drawPellet = function(x,y) {
        pellets_ctx.fillStyle = "yellow";
        pellets_ctx.fillRect(x*tileSize+3,y*tileSize+3,2,2);
    };

    var drawEnergizer = function(x,y) {
        pellets_ctx.fillStyle = "yellow";
        pellets_ctx.fillRect(x*tileSize,y*tileSize,8,8);
    };

    var drawText = function(text, color, size, x, y, font) {
        if (font == undefined) font = "retro";
        ctx.fillStyle = color;
        ctx.font = size + "px " + font;
        ctx.fillText(text, x*tileSize, y*tileSize);
    };

    var drawScore = function() {
        drawText("SCORE", "white", 12, 1, 1);
        drawText(getScore(), "white", 12, 5, 1);
        drawText("HIGH SCORE", "white", 12, 13, 1);
        drawText(getHighScore(), "white", 12, 22, 1);
    };

    var drawPlayer1 = function() {
        if (gameMode == GAME_COOKIE)
            drawText("PLAYER OMNOM", "#ff0", 12, 20, 9);
        else
            drawText("PLAYER 1", "cyan", 12, 20, 9);
    };

    var drawReady = function() {
        if (gameMode == GAME_COOKIE)
            drawText("GET READY!", "#ff0", 20, 11, 1);
        else
            drawText("READY!", "yellow", 20, 11);
    };

    var drawGameOver = function() {
        drawText("GAME OVER", "red", 20, 11, 9);
    };

    return {
        'init':init,
        'resize':resize,
        'refresh':refresh,
        'drawMap':drawMap,
        'refreshPellet':refreshPellet,
        'erasePellet':erasePellet,
    };
})();
//@line 1 "src/vcr.js"
//////////////////////////////////////////////////////////////////////////////////////
// VCR
// (records and plays back game state)

var vcr = (function(){

    var time = 0;
    var max_time = 0;
    var snapshots = {};
    var actors_data = {};
    var map_data = {};

    var is_recording = false;
    var is_playing = false;

    var startRecording = function() {
        if (is_recording) return;
        is_recording = true;
        is_playing = false;
        time = 0;
        max_time = 0;
        var i;
        for (i=0; i<5; i++)
            actors[i].resetSaved();
        map.resetTimeEaten();
    };

    var stopRecording = function() {
        if (!is_recording) return;
        is_recording = false;
    };

    var startPlaying = function() {
        if (is_playing) return;
        is_playing = true;
        is_recording = false;
        time = 0;
    };

    var stopPlaying = function() {
        if (!is_playing) return;
        is_playing = false;
    };

    var update = function() {
        if (is_recording) {
            if (time > max_time)
                max_time = time;
            var i;
            for (i=0; i<5; i++)
                actors[i].save(time);
            saveGame(time);
            time++;
        }
        else if (is_playing) {
            if (time < max_time) {
                var i;
                for (i=0; i<5; i++)
                    actors[i].load(time);
                loadGame(time);
                time++;
            }
        }
    };

    var getTime = function() { return time; };
    var getMaxTime = function() { return max_time; };
    var setTime = function(t) { time = t; };
    var getMode = function() {
        if (is_recording) return "record";
        if (is_playing) return "play";
        return "stop";
    };

    return {
        'startRecording': startRecording,
        'stopRecording': stopRecording,
        'startPlaying': startPlaying,
        'stopPlaying': stopPlaying,
        'update': update,
        'getTime': getTime,
        'getMaxTime': getMaxTime,
        'setTime': setTime,
        'getMode': getMode,
    };
})();
//@line 1 "src/main.js"
//////////////////////////////////////////////////////////////////////////////////////
// Main
// (the game)

var map;

var resetGame = function() {
    level = 1;
    setScore(0);
    extraLives = 2;
    map.reset();
    resetLevel();
};

var resetLevel = function() {
    var i;
    for (i=0; i<5; i++)
        actors[i].onNewLevel();
};

var init = (function(){

    var el = document.getElementById('canvas-container');

    var init = function(mode) {

        // create actors
        createActors();

        // load high scores
        loadHighScores();

        // get map
        map = new Map(28,31,maps[level-1]);

        // init actors
        initActors();

        // init renderer
        renderer.init();

        // add event listeners
        window.addEventListener('resize', renderer.resize, false);
        document.addEventListener('keydown', onKeyDown, false);

        // start executive
        executive.start();

        switch (mode) {
            case 'attract':
                state.setState('attract-init');
                break;
            case 'game':
                state.setState(null, {
                    run: function() {
                        if (this.timer == 0) {
                            resetGame();
                            audio.startMusic.play();
                        }
                        if (this.timer == 240) {
                            state.setState('playing');
                        }
                        this.timer++;
                    },
                });
                break;
        }
    };

    var onKeyDown = function(e) {
        if (state.is('death'))
            return;

        if (e.keyCode == 37)
            pacman.desireDirEnum = DIR_LEFT;
        else if (e.keyCode == 38)
            pacman.desireDirEnum = DIR_UP;
        else if (e.keyCode == 39)
            pacman.desireDirEnum = DIR_RIGHT;
        else if (e.keyCode == 40)
            pacman.desireDirEnum = DIR_DOWN;
    };

    return init;
})();


var gameSequence = (function(){

    state.setState('title-init');

    return function() {

        vcr.update();

        switch(state.get().name) {
            case 'title-init':
                state.setState('title', {
                    onEnter: function() {
                        var el = document.getElementById('title-screen');
                        el.style.display = "block";
                        var that = this;
                        el.onclick = function() {
                            that.finished = true;
                        };
                    },
                    run: function() {
                        if (this.finished)
                            state.setState('attract-init');
                    },
                    onExit: function() {
                        var el = document.getElementById('title-screen');
                        el.style.display = "none";
                    },
                });
                break;
            case 'attract-init':
                init('attract');
                state.setState('attract');
                break;
            case 'attract':
                if (state.timer == 1000)
                    state.setState('attract-init');
                break;
            case 'game-init':
                init('game');
                break;
            case 'playing':
                if (map.allDotsEaten()) {
                    state.setState('finish-level');
                }
                break;
            case 'finish-level':
                state.setState(null, {
                    run: function() {
                        if (this.timer == 0) {
                            audio.silence(true);
                        }
                        if (this.timer > 240 && !map.isFlashing()) {
                            level++;
                            resetLevel();
                            state.setState('start-level');
                        }
                        this.timer++;
                    },
                });
                break;
            case 'death':
                state.setState(null, {
                    run: function() {
                        if (this.timer == 0) {
                            audio.silence(true);
                            pacman.state = 2;
                            pacman.anim.set('death');
                        }
                        if (this.timer == 120) {
                            state.setState('lost-life');
                        }
                        this.timer++;
                    },
                });
                break;
            case 'lost-life':
                state.setState(null, {
                    run: function() {
                        if (this.timer == 0) {
                            if (extraLives > 0) {
                                extraLives--;
                                renderer.drawMap();
                            }
                            else {
                                state.setState('game-over');
                                return;
                            }
                        }
                        if (this.timer == 60) {
                            audio.silence();
                            resetLevel();
                            state.setState('start-level');
                        }
                        this.timer++;
                    },
                });
                break;
        case 'start-level':
            state.setState(null, {
                run: function() {
                    if (this.timer == 240) {
                        state.setState('playing');
                    }
                    this.timer++;
                }
            });
            break;
            case 'game-over':
                state.setState(null, {
                    run: function() {
                        if (this.timer == 120)
                            state.setState('attract-init');
                        this.timer++;
                    },
                });
                break;
        }
        state.get().timer++;
    };
})();

// Start the game
init();
setInterval(gameSequence, 1000/60);

})();