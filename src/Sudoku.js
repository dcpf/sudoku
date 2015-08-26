/**
* Object containing all functions able to be performed on a sudoku puzzle array. Note that
* this follows the functional paradigm as opposed to OO, as that seems to make more sense.
*/
var Sudoku = {

  generatePuzzleArray: function () {

    var puzzleArray = this.getEmptyPuzzleArray(),
      cellValue,
      possibleNums;

    // Walk through each cell and see what numbers it can contain based on its row, column and quadrant.
    OUTER: for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        cellValue = puzzleArray[i][j];
        if (!cellValue) {
          possibleNums = this.getPossibleNumbers(puzzleArray, j, i);
          if (possibleNums.length === 0) {
            // We've reached a point where the cell cannot legally contain any number, so start over.
            return this.generatePuzzleArray();
            break OUTER;
          } else {
            // If only one possible number was found, use that. Else, get a random number from the array.
            puzzleArray[i][j] = (possibleNums.length === 1) ? possibleNums[0] : possibleNums[this.generateRandomArrayIndex(possibleNums.length)];
          }
        }
      }
    }

    return puzzleArray;

  },

  /*
  * Strip #s from the puzzle until it's at its minimal solvable state.
  */
  stripPuzzle: function (puzzleArray) {

    var strippedPuzzleArray = this.clonePuzzleArray(puzzleArray),
      i,
      j,
      coords,
      usedCoords = [], // cache the coords we've tried in this array
      num,
      clone,
      solved;

    while (usedCoords.length !== 81) {
      i = this.generateRandomArrayIndex();
      j = this.generateRandomArrayIndex();
      coords = '' + i + j;
      if (usedCoords.indexOf(coords) != -1) {
        // If we've already tried these coords, continue.
        continue;
      }
      // cache the coords
      usedCoords.push(coords);
      // Grab the number from this location, then set it to 0.
      num = strippedPuzzleArray[i][j];
      strippedPuzzleArray[i][j] = 0;
      // Clone the puzzle and see if it's solvable.
      clone = this.clonePuzzleArray(strippedPuzzleArray);
      solved = this.solvePuzzle(clone);
      if (!this.isFull(solved)) {
        // If it's not solvable, reset the cell to its original number.
        strippedPuzzleArray[i][j] = num;
      }
    }

    return strippedPuzzleArray;

  },

  /*
  * Attempt to solve the puzzle. Note that this modifies the passed-in puzzle array!
  */
  solvePuzzle: function (puzzleArray) {

    var cellValue,
      possibleNums,
      populatedCells = 0;

    // Find each unknown cell and see what numbers it can contain based on its row, column and quadrant.
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        cellValue = puzzleArray[i][j];
        if (!cellValue) {
          possibleNums = this.getPossibleNumbers(puzzleArray, j, i);
          if (possibleNums.length === 1) {
            // If only one number found, update the puzzle array
            puzzleArray[i][j] = possibleNums[0];
            populatedCells++;
          }
        }
      }
    }

    // If we're done, return.
    if (populatedCells === 0) {
      return puzzleArray;
    }

    // Else, recurse.
    return this.solvePuzzle(puzzleArray);

  },

  /*
  * Try to validate the solution.
  */
  validateSolution: function (puzzleArray) {

    var cellValue,
      possibleNums;

    // Walk through each cell and see what numbers it can contain based on its row, column and quadrant.
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        // Get the value of the cell
        cellValue = puzzleArray[i][j];
        possibleNums = this.getPossibleNumbers(puzzleArray, j, i);
        if (possibleNums.length !== 1 || cellValue !== possibleNums[0]) {
          // If we found more than one possible #, or if the cell value does not match what we found, the solution is incorrect.
          return false;
        }
      }
    }

    return true;

  },

  generateRandomArrayIndex: function (arrayLength) {
    arrayLength = arrayLength || 9;
    return Math.floor((Math.random() * arrayLength));
  },

  /*
  * See if two puzzleArrays are equal
  */
  equals: function (puzzleArray1, puzzleArray2) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (puzzleArray1[i][j] !== puzzleArray2[i][j]) {
          return false;
        }
      }
    }
    return true;
  },

  /*
  * Get a new, empty 9x9 puzzle array
  */
  getEmptyPuzzleArray: function () {
    var puzzleArray = new Array(9);
    for (var i = 0; i < 9; i++) {
      puzzleArray[i] = new Array(9);
    }
    return puzzleArray;
  },

  clonePuzzleArray: function (puzzleArray) {
    var arr = [],
      subArray = [];
    for (var i = 0; i < 9; i++) {
      subArray = [];
      for (var j = 0; j < 9; j++) {
        subArray.push(puzzleArray[i][j]);
      }
      arr.push(subArray);
    }
    return arr;
  },

  /*
  * Check if all cells are populated
  */
  isFull: function (puzzleArray) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (!puzzleArray[i][j]) return false;
      }
    }
    return true;
  },

  /*
  * Check if all cells are empty
  */
  isEmpty: function (puzzleArray) {
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (puzzleArray[i][j]) return false;
      }
    }
    return true;
  },

  /*
  * Examines the puzzle array, and gets all possible numbers for a given cell
  * @param puzzle array
  * @param x coord
  * @param y coord
  */
  getPossibleNumbers: function (puzzleArray, x, y) {

    var numbersInRow = this.examineRow(puzzleArray, x, y),
      numbersInColumn = this.examineColumn(puzzleArray, x, y),
      numbersInQuadrant = this.examineQuadrant(puzzleArray, x, y),
      existingNums = [].concat(numbersInRow, numbersInColumn, numbersInQuadrant),
      possibleNums = [];

    for (var num = 1; num <= 9; num++) {
      if (existingNums.indexOf(num) === -1) {
        possibleNums.push(num);
      }
    }

    return possibleNums;

  },

  /*
  * Return an array of all numbers in a row, except for the number at x
  */
  examineRow: function (puzzleArray, x, y) {
    var arr = puzzleArray[y].filter(function(elem, index, array) {
      return index !== x && elem > 0;
    });
    return arr;
  },

  /*
  * Return an array of all numbers in a column, except for the number at y
  */
  examineColumn: function (puzzleArray, x, y) {
    var arr = [],
      num;
    for (var i = 0; i < 9; i++) {
      if (i !== y) {
        num = puzzleArray[i][x];
        if (num) arr.push(num);
      }
    }
    return arr;
  },

  /*
  * Return an array of all numbers in a quadrant, except for the number at x/y
  */
  examineQuadrant: function (puzzleArray, x, y) {
    var arr = [],
      num,
      quadrantCoords = this.getQuadrantCoords(x, y);
    for (var i = quadrantCoords[0]; i < quadrantCoords[0] + 3; i++) {
      for (var j = quadrantCoords[1]; j < quadrantCoords[1] + 3; j++) {
        if (x === j && y === i) continue;
        num = puzzleArray[i][j];
        if (num) arr.push(num);
      }
    }
    return arr;
  },

  /*
  * Given x/y coords, get the starting point for the quadrant that the cell lives in
  */
  getQuadrantCoords: function (x, y) {
    if (x < 3 && y < 3) return [0,0];
    if (x < 6 && y < 3) return [0,3];
    if (x < 9 && y < 3) return [0,6];
    if (x < 3 && y < 6) return [3,0];
    if (x < 6 && y < 6) return [3,3];
    if (x < 9 && y < 6) return [3,6];
    if (x < 3 && y < 9) return [6,0];
    if (x < 6 && y < 9) return [6,3];
    if (x < 9 && y < 9) return [6,6];
  }

};
