var view = new SudokuView(document.getElementById('sudokuGame'));

//document.getElementById('clearPuzzleButton').onclick = function () { view.clearBoard(); };
document.getElementById('resetPuzzleButton').onclick = function () { view.resetPuzzle(); };
document.getElementById('solvePuzzleButton').onclick = function () { view.solveIt(); };
document.getElementById('generateNewPuzzleButton').onclick = function () { view.generateNewPuzzle(); };

view.buildSudokuBoard();
view.generateNewPuzzle();
setInterval(function() { view.examineBoardState(); }, 400);
