'use strict';

describe('Sudoku View Test Suite', function() {


    /*
    * Return a new SudokuView object with a default el.
    */
    function getSudokuView () {
        let el = document.createElement('div');
        let board = document.createElement('div');
        board.id = SudokuView.SUDOKU_BOARD_ID;
        el.appendChild(board);
        return SudokuView.getInstance(el);
    }


    it('Tests buildSudokuBoard()', function() {
        let view = getSudokuView();
        let el = view.el;
        view.buildSudokuBoard();
        let table = el.querySelector('#' + SudokuView.SUDOKU_BOARD_ID).firstChild;
        expect(table.tagName).toEqual('TABLE');
        let tbody = table.firstChild;
        expect(tbody.tagName).toEqual('TBODY');
        let rows = tbody.children;
        expect(rows.length).toEqual(9);
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let cells = row.children;
            expect(cells.length).toEqual(9);
            for (let j = 0; j < cells.length; j++) {
                let cell = cells[j];
                expect(cell.id).toEqual(SudokuView.CELL_ID_PREFIX + i + j);
                expect(typeof cell.onkeypress).toBe('function');
            }
        }
    });


    it('Tests clearBoard()', function() {
        let view = getSudokuView();
        let el = view.el;
        view.buildSudokuBoard();
        view.populateBoard(Sudoku.generatePuzzleArray());
        view.clearBoard();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let cell = el.querySelector('#' + SudokuView.CELL_ID_PREFIX + i + j);
                expect(cell.textContent).toEqual('');
            }
        }
    });


    /*
    * Build the sudoku board, populate it with a puzzleArray, call boardToArray(), then verify that the returned puzzleArray == the original puzzleArray.
    */
    it('Tests boardToArray()', function() {
        let view = getSudokuView();
        view.buildSudokuBoard();
        let puzzleArray = Sudoku.generatePuzzleArray();
        view.populateBoard(puzzleArray);
        let puzzleArray2 = view.boardToArray();
        expect(Sudoku.equals(puzzleArray2, puzzleArray)).toBe(true);
    });


    /*
    * Build the sudoku board, populate it with a strippedPuzzleArray, call solveIt(), then verify that the solved puzzleArray == the original puzzleArray.
    */
    it('Tests solveIt()', function() {
        let view = getSudokuView();
        view.buildSudokuBoard();
        let puzzleArray = Sudoku.generatePuzzleArray();
        let strippedPuzzleArray = Sudoku.stripPuzzle(puzzleArray);
        view.populateBoard(strippedPuzzleArray);
        view.solveIt();
        let puzzleArray2 = view.boardToArray();
        expect(Sudoku.equals(puzzleArray2, puzzleArray)).toBe(true);
    });


    // Provides a full puzzleArray and stripped puzzleArray for populateBoard() tests
    let puzzleArrays = [
        Sudoku.generatePuzzleArray(),
        Sudoku.stripPuzzle(Sudoku.generatePuzzleArray())
    ];


    describe('populateBoard() tests', function() {
        puzzleArrays.forEach(function(puzzleArray){
            it('Tests populateBoard() with puzzleArray: ' + puzzleArray, function() {
                let view = getSudokuView();
                let el = view.el;
                view.buildSudokuBoard();
                view.populateBoard(puzzleArray);
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        let num = puzzleArray[i][j];
                        let cell = el.querySelector('#' + SudokuView.CELL_ID_PREFIX + i + j);
                        if (num) {
                            expect(parseInt(cell.textContent, 10)).toEqual(num);
                            expect(cell.contentEditable).toEqual('false');
                        } else {
                            expect(cell.textContent).toEqual('');
                            expect(cell.contentEditable).toEqual('true');
                        }
                    }
                }
            });
        });
    });


});
