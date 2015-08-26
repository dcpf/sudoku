'use strict';

describe('Sudoku View Test Suite', function() {


    /*
    * Build the element object to pass to: new SudokuView(el)
    */
    function getEl () {
        let el = document.createElement('div');
        let board = document.createElement('div');
        board.id = 'sudokuBoard';
        el.appendChild(board);
        return el;
    }


    it('Tests buildSudokuBoard()', function() {
        let el = getEl();
        let view = new SudokuView(el);
        view.buildSudokuBoard();
        let table = el.querySelector('#sudokuBoard').firstChild;
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
                expect(cell.id).toEqual('cell' + i + j);
                expect(typeof cell.onkeypress).toBe('function');
            }
        }
    });


    // Provides a full puzzleArray and stripped puzzleArray for populateBoard() tests
    let puzzleArrays = [
        Sudoku.generatePuzzleArray(),
        Sudoku.stripPuzzle(Sudoku.generatePuzzleArray())
    ];


    describe('populateBoard() tests', function() {
        puzzleArrays.forEach(function(puzzleArray){
            it('Tests populateBoard() with puzzleArray: ' + puzzleArray, function() {
                let el = getEl();
                let view = new SudokuView(el);
                view.buildSudokuBoard();
                view.populateBoard(puzzleArray);
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        let num = puzzleArray[i][j];
                        let cell = el.querySelector('#cell' + i + j);
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
