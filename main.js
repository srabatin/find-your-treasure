class Game {
  /*constructor(gameMap) {
    this.gameMap = gameMap;
    this.
     }*/
}

class Map {
  constructor(height, width, percentHoles) {
    this.rows = height;
    this.cols = width;
    this.percentHoles = percentHoles;
    this.treasure = "x",
    this.hole = "O",
    this.field = "\u2591",
    this.fog = "\u2593",
    this.player = "\u263B",
    this.path = "\u2592",
    this.holeFall = "\u271D",
    this.treasureFound = "\u22C6",
    this.map = [];
    this.playerPosition = [];
  }

  // generate the game map
  generateMap() { //10, 10, 0.35 gives good results
    let mapArray = [];

    // calculate map parameters
    let numberOfItems = this.rows * this.cols; //zb 100
    let numberOfHoles = Math.floor(numberOfItems * this.percentHoles); // 30
    let emptyFields = numberOfItems - numberOfHoles - 2; // 68

    // generate initial array with all map fields
    let initialArray = [this.player, this.treasure];
    for (let i = 0; i < numberOfHoles; i++) {
      initialArray.push(this.hole);
    }
    for (let i = 0; i < emptyFields; i++) {
      initialArray.push(this.field);
    }

    // shuffle array with map elements
    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
    mapArray = shuffle(initialArray);

    // splice initial array into map
    function chunkify(a, n, balanced) {
      if (n < 2)
        return [a];
      var len = a.length,
        out = [],
        i = 0,
        size;
      if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
          out.push(a.slice(i, i += size));
        }
      }
      else if (balanced) {
        while (i < len) {
          size = Math.ceil((len - i) / n--);
          out.push(a.slice(i, i += size));
        }
      }
      else {
        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
          size--;
        while (i < size * n) {
          out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));
      }
      return out;
    }
    mapArray = chunkify(mapArray, this.rows, true);
    this.map = mapArray;
  }

  // prints the map and stores information about dimensions
  print() {
    let rows = this.map.length;
    this.rows = this.map.length;
    this.cols = this.map[0].length;

    // create shadowMap
    const shadowMap = JSON.parse(JSON.stringify(this.map));

    // fog fields
    let playerPosition = this.initiallyLocatePlayer()
    for (let i = 0; i < shadowMap.length; i++) { // rows
      for (let j = 0; j < shadowMap[i].length; j++) { // cols
        if (i < playerPosition[0] - fov || i > playerPosition[0] + fov || j < playerPosition[1] - fov || j > playerPosition[1] + fov) {
          shadowMap[i][j] = this.fog;
        }
      }
    }

    console.log("\n");
    let paintMap = "";
    let i = 0;
    while (i < rows) {
      if (gameOn) {
        paintMap = paintMap + shadowMap[i].join("") + "\n";
      } else {
        paintMap = paintMap + this.map[i].join("") + "\n";
      }
      i++;
    }

    console.log(paintMap);
  }

  // find the player for first round
  initiallyLocatePlayer() {
    let posRow = 0;
    let posCol = 0;
    let position = [];
    for (let i = 0; i < this.map.length; i++) {
      if (this.map[i].indexOf(this.holeFall) > -1) {
        posCol = this.map[i].indexOf(this.holeFall);
        posRow = i;
        break;
      } else if (this.map[i].indexOf(this.player) > -1) {
        posCol = this.map[i].indexOf(this.player);
        posRow = i;
        break;
      };
    }
    position = [posRow, posCol]
    return position;
  }

  // process the user input and move the player
  movePlayer(move) {
    let pos = this.playerPosition;
    let oldPos = pos.map(x => x);
    switch (move) {
      case "w":
        pos[0]--;
        break;
      case "a":
        pos[1]--;
        break;
      case "s":
        pos[0]++;
        break;
      case "d":
        pos[1]++;
        break;
      default:
        return
    }
    this.paintPlayer(oldPos);
  }

  // paint the player on the map 
  paintPlayer(oldPos) {
    let pos = this.playerPosition;
    let check = this.checkField(pos);

    // is new pos out of bounds ohr hole? --> game lost!
    if (check === "bounds" || check === "hole" || check === "treasure") {
      gameOn = false;
      console.clear();
      if (check === "hole" || check === "treasure") {
        this.map[oldPos[0]][oldPos[1]] = this.path;
        if (check === "hole") {
          this.map[pos[0]][pos[1]] = this.holeFall;
        } else {
          this.map[pos[0]][pos[1]] = this.treasureFound;
        }
        this.print();
        if (check === "hole") {
          console.log("\u00AB Argh, goddamit, " + playerName + "! You fell into a hole! \u00BB\nGame over. Moves: " + moves);
        } else {
          console.log("\u00AB I knew it, " + playerName + "! You are a great pirate! You have found the treasure!\u00BB\nGame won! Moves: " + moves);
          writeHighScore(moves);
        }
      } else {
        this.map[oldPos[0]][oldPos[1]] = this.path;
        this.print();
        console.log("\u00AB Hey, " + playerName + "! Where are you running, ya bloody traitor?! \u00BB\nGame over. Moves: " + moves);
      }
      playAgain();
    }

    // if new pos is map field
    else {
      this.map[oldPos[0]][oldPos[1]] = this.path;
      this.map[pos[0]][pos[1]] = this.player;
    }
  }

  // check field for bounds, hole, treasure
  checkField(pos) {
    if (pos[0] < 0 || pos[1] < 0 || pos[0] > this.rows - 1 || pos[1] > this.cols - 1) {
      return "bounds";
    } else if (this.map[pos[0]][pos[1]] === this.hole) {
      return "hole";
    } else if (this.map[pos[0]][pos[1]] === this.treasure) {
      return "treasure";
    }
  }
};

module.exports = Map;

