var SudokuView = {

    SUDOKU_BOARD_ID: 'sudokuBoard',
    RESET_PUZZLE_BUTTON_ID: 'resetPuzzleButton',
    SOLVE_PUZZLE_BUTTON_ID: 'solvePuzzleButton',
    MSG_ID: 'msg',
    CELL_ID_PREFIX: 'cell',

    getInstance: function (el) {

        this.el = el;
        this.strippedPuzzleArray;

        /*
        * Called via setInterval, continually monitors the board state and adjusts the UI as necessary.
        */
        this.examineBoardState = function () {
            var boardArray = this.boardToArray();
            var arraysAreEqual = Sudoku.equals(boardArray, this.strippedPuzzleArray);
            this.el.querySelector('#' + this.RESET_PUZZLE_BUTTON_ID).disabled = arraysAreEqual;
            var boardIsFull = Sudoku.isFull(boardArray);
            this.el.querySelector('#' + this.SOLVE_PUZZLE_BUTTON_ID).disabled = boardIsFull;
            if (boardIsFull) {
                var solutionIsCorrect = Sudoku.validateSolution(boardArray);
                if (solutionIsCorrect) {
                    this.el.querySelector('#' + this.MSG_ID).textContent = 'Puzzle solved!';
                } else {
                    this.el.querySelector('#' + this.MSG_ID).textContent = 'Sorry, your solution is incorrect.';
                }
            } else {
                this.el.querySelector('#' + this.MSG_ID).textContent = '';
            }
            //var boardIsEmpty = isEmpty(boardArray);
            //this.el.querySelector('#clearPuzzleButton').disabled = boardIsEmpty;
        };

        this.generateNewPuzzle = function () {
            var puzzleArray = Sudoku.generatePuzzleArray();
            this.strippedPuzzleArray = Sudoku.stripPuzzle(puzzleArray);
            this.populateBoard(this.strippedPuzzleArray);
        };

        this.resetPuzzle = function() {
            this.populateBoard(this.strippedPuzzleArray);
        };

        this.solveIt = function () {
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
        this.buildSudokuBoard = function () {
            var table = document.createElement('table'),
                tBody = document.createElement('tbody'),
                tr,
                td;
            for (var i = 0; i < 9; i++) {
                tr = document.createElement('tr');
                for (var j = 0; j < 9; j++) {
                    td = document.createElement('td');
                    td.id = this.CELL_ID_PREFIX + i + j;
                    td.onkeypress = this.checkUserInput;
                    // Publish an event when a number is input into a cell on the sudoku board
                    //td.oninput = publishSudokuBoardChangeEvent;
                    tr.appendChild(td);
                }
                tBody.appendChild(tr);
            }
            table.appendChild(tBody);
            this.el.querySelector('#' + this.SUDOKU_BOARD_ID).appendChild(table);
        };

        /*
        * Populate the sudoku board with the values from the puzzle array
        */
        this.populateBoard = function (puzzleArray) {
            var num, cell;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    num = puzzleArray[i][j];
                    cell = this.el.querySelector('#' + this.CELL_ID_PREFIX + i + j);
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
        this.clearBoard = function () {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    this.el.querySelector('#' + this.CELL_ID_PREFIX + i + j).textContent = '';
                }
            }
        };

        /*
        * Check user input
        */
        this.checkUserInput = function (e) {
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
        this.boardToArray = function () {
            var arr = [],
                subArray = [];
            for (var i = 0; i < 9; i++) {
                subArray = [];
                for (var j = 0; j < 9; j++) {
                    var num = parseInt(this.el.querySelector('#' + this.CELL_ID_PREFIX + i + j).textContent, 10);
                    if (isNaN(num)) num = 0;
                    subArray.push(num);
                }
                arr.push(subArray);
            }
            return arr;
        };

        return this;

    }
}

