var view = SudokuView.getInstance(Sudoku, document.getElementById('sudokuGame'));

//document.getElementById('clearPuzzleButton').onclick = function () { view.clearBoard(); };
document.getElementById('resetPuzzleButton').onclick = function () { view.resetPuzzle(); };
document.getElementById('solvePuzzleButton').onclick = function () { view.solveIt(); };
document.getElementById('generateNewPuzzleButton').onclick = function () { view.generateNewPuzzle(); };

view.buildSudokuBoard();
view.generateNewPuzzle();
setInterval(function() { view.examineBoardState(); }, 400);

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
