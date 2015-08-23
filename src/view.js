'use strict';

/*
* Listen for changes to the puzzle array, and update the sudoku board.
*/
/*
document.addEventListener('puzzleArrayChangeEvent', function (e) {
    var cell = document.getElementById('cell' + e.y + e.x);
    cell.textContent = e.num;
}, false);
*/

/*
document.addEventListener('sudokuBoardChangeEvent', function (e) {
    var arr = boardToArray();
    var bool = Sudoku.equals(arr, strippedPuzzleArray);
    document.getElementById('resetPuzzleButton').disabled = bool;
}, false);
*/

/*
* Publish an event when a cell value in the puzzle array changes.
*/
/*
function publishPuzzleArrayChangeEvent (x, y, num) {
    var event = new Event('puzzleArrayChangeEvent');
    event.x = x;
    event.y = y;
    event.num = num;
    document.dispatchEvent(event);
}
*/

/*
* Publish an event when a number is entered in a cell in the sudoku board.
*/
/*
function publishSudokuBoardChangeEvent (e) {
    var event = new Event('sudokuBoardChangeEvent'),
        id = e.target.id; // ID is in the form: cellYX
    event.y = id.charAt(4);
    event.x = id.charAt(5);
    event.num = parseInt(e.target.textContent, 10);
    document.dispatchEvent(event);
}
*/

/*
* Called via setInterval, continually monitors the board state and adjusts the UI as necessary.
*/
function examineBoardState () {
  var boardArray = boardToArray();
  var arraysAreEqual = Sudoku.equals(boardArray, strippedPuzzleArray);
  document.getElementById('resetPuzzleButton').disabled = arraysAreEqual;
  var boardIsFull = Sudoku.isFull(boardArray);
  document.getElementById('solvePuzzleButton').disabled = boardIsFull;
  if (boardIsFull) {
    var solutionIsCorrect = Sudoku.validateSolution(boardArray);
    if (solutionIsCorrect) {
      document.getElementById('msg').textContent = 'Puzzle solved!';
    } else {
      document.getElementById('msg').textContent = 'Sorry, your solution is incorrect.';
    }
  } else {
    document.getElementById('msg').textContent = '';
  }
  //var boardIsEmpty = isEmpty(boardArray);
  //document.getElementById('clearPuzzleButton').disabled = boardIsEmpty;
}

var strippedPuzzleArray;

function generateNewPuzzle () {
  var puzzleArray = Sudoku.generatePuzzleArray();
  strippedPuzzleArray = Sudoku.stripPuzzle(puzzleArray);
  populateBoard(strippedPuzzleArray);
}

function resetPuzzle () {
  populateBoard(strippedPuzzleArray);
}

function solveIt () {
  var puzzleArray = boardToArray(),
      solvedPuzzleArray = Sudoku.solvePuzzle(puzzleArray);
  if (Sudoku.validateSolution(solvedPuzzleArray)) {
    populateBoard(solvedPuzzleArray);
  } else {
    alert('Cannot solve puzzle in its current state!');
  }
}

/*
* Build the table that represents the sudoku board
*/
function buildSudokuBoard () {
  var table = document.createElement('table'),
      tBody = document.createElement('tbody'),
      tr,
      td;
  for (var i = 0; i < 9; i++) {
    tr = document.createElement('tr');
    for (var j = 0; j < 9; j++) {
      td = document.createElement('td');
      td.id = 'cell' + i + j;
      td.onkeypress = checkUserInput;
      // Publish an event when a number is input into a cell on the sudoku board
      //td.oninput = publishSudokuBoardChangeEvent;
      tr.appendChild(td);
    }
    tBody.appendChild(tr);
  }
  table.appendChild(tBody);
  document.getElementById('sudokuBoard').appendChild(table);
};

/*
* Populate the sudoku board with the values from the puzzle array
*/
function populateBoard (puzzleArray) {
  var num, cell;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      num = puzzleArray[i][j];
      cell = document.getElementById('cell' + i + j);
      if (num) {
        cell.textContent = num;
        cell.contentEditable = false;
      } else {
        cell.textContent = '';
        cell.contentEditable = true;
      }
    }
  }
}

/*
* Clear the sudoku board
*/
function clearBoard () {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      document.getElementById('cell' + i + j).textContent = '';
    }
  }
}

/*
* Check user input
*/
function checkUserInput (e) {
  if (e.keyCode === 9) {
    // Tab key - move to next cell.
    e.target.nextSibling.focus();
  } else if (e.target.textContent || e.keyCode < 49 || e.keyCode > 57) {
    // Target is aleady populated, or the key is something other than 1-9
    e.preventDefault();
  }
}

/*
* Build a 2-dimensional array from the values on the board
*/
function boardToArray () {
  var arr = [],
      subArray = [];
  for (var i = 0; i < 9; i++) {
    subArray = [];
    for (var j = 0; j < 9; j++) {
      var num = parseInt(document.getElementById('cell' + i + j).textContent, 10);
      if (isNaN(num)) num = 0;
        subArray.push(num);
      }
      arr.push(subArray);
  }
  return arr;
}
