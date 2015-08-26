var SudokuView = function (el) {

    this.el = el;

    this.strippedPuzzleArray;

    /*
    * Listen for changes to the puzzle array, and update the sudoku board.
    */
    /*
    document.addEventListener('puzzleArrayChangeEvent', function (e) {
        var cell = dom.getElementById('cell' + e.y + e.x);
        cell.textContent = e.num;
    }, false);
    */

    /*
    document.addEventListener('sudokuBoardChangeEvent', function (e) {
        var arr = boardToArray();
        var bool = Sudoku.equals(arr, strippedPuzzleArray);
        this.el.querySelector('#resetPuzzleButton').disabled = bool;
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

};

/*
* Called via setInterval, continually monitors the board state and adjusts the UI as necessary.
*/
SudokuView.prototype.examineBoardState = function () {
    var boardArray = this.boardToArray();
    var arraysAreEqual = Sudoku.equals(boardArray, this.strippedPuzzleArray);
    this.el.querySelector('#resetPuzzleButton').disabled = arraysAreEqual;
    var boardIsFull = Sudoku.isFull(boardArray);
    this.el.querySelector('#solvePuzzleButton').disabled = boardIsFull;
    if (boardIsFull) {
        var solutionIsCorrect = Sudoku.validateSolution(boardArray);
        if (solutionIsCorrect) {
            this.el.querySelector('#msg').textContent = 'Puzzle solved!';
        } else {
            this.el.querySelector('#msg').textContent = 'Sorry, your solution is incorrect.';
        }
    } else {
        this.el.querySelector('#msg').textContent = '';
    }
    //var boardIsEmpty = isEmpty(boardArray);
    //this.el.querySelector('#clearPuzzleButton').disabled = boardIsEmpty;
};

SudokuView.prototype.generateNewPuzzle = function () {
    var puzzleArray = Sudoku.generatePuzzleArray();
    this.strippedPuzzleArray = Sudoku.stripPuzzle(puzzleArray);
    this.populateBoard(this.strippedPuzzleArray);
};

SudokuView.prototype.resetPuzzle = function() {
    this.populateBoard(this.strippedPuzzleArray);
};

SudokuView.prototype.solveIt = function () {
    var puzzleArray = this.boardToArray(),
        solvedPuzzleArray = Sudoku.solvePuzzle(puzzleArray);
    if (Sudoku.validateSolution(solvedPuzzleArray)) {
        this.populateBoard(solvedPuzzleArray);
    } else {
        alert('Cannot solve puzzle in its current state!');
    }
};

/*
* Build the table that represents the sudoku board
*/
SudokuView.prototype.buildSudokuBoard = function () {
    var table = document.createElement('table'),
        tBody = document.createElement('tbody'),
        tr,
        td;
    for (var i = 0; i < 9; i++) {
        tr = document.createElement('tr');
        for (var j = 0; j < 9; j++) {
            td = document.createElement('td');
            td.id = 'cell' + i + j;
            td.onkeypress = this.checkUserInput;
            // Publish an event when a number is input into a cell on the sudoku board
            //td.oninput = publishSudokuBoardChangeEvent;
            tr.appendChild(td);
        }
        tBody.appendChild(tr);
    }
    table.appendChild(tBody);
    this.el.querySelector('#sudokuBoard').appendChild(table);
};

/*
* Populate the sudoku board with the values from the puzzle array
*/
SudokuView.prototype.populateBoard = function (puzzleArray) {
    var num, cell;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            num = puzzleArray[i][j];
            cell = this.el.querySelector('#cell' + i + j);
            if (num) {
                cell.textContent = num;
                cell.contentEditable = false;
            } else {
                cell.textContent = '';
                cell.contentEditable = true;
            }
        }
    }
};

/*
* Clear the sudoku board
*/
SudokuView.prototype.clearBoard = function () {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            this.el.querySelector('#cell' + i + j).textContent = '';
        }
    }
};

/*
* Check user input
*/
SudokuView.prototype.checkUserInput = function (e) {
    if (e.keyCode === 9) {
        // Tab key - move to next cell.
        e.target.nextSibling.focus();
    } else if (e.target.textContent || e.keyCode < 49 || e.keyCode > 57) {
        // Target is aleady populated, or the key is something other than 1-9
        e.preventDefault();
    }
};

/*
* Build a 2-dimensional array from the values on the board
*/
SudokuView.prototype.boardToArray = function () {
    var arr = [],
        subArray = [];
    for (var i = 0; i < 9; i++) {
        subArray = [];
        for (var j = 0; j < 9; j++) {
            var num = parseInt(this.el.querySelector('#cell' + i + j).textContent, 10);
            if (isNaN(num)) num = 0;
            subArray.push(num);
        }
        arr.push(subArray);
    }
    return arr;
};
